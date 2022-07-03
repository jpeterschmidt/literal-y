const path = require('path')
const fs = require('fs')
const natural = require('natural')
const WordPOS = require('wordpos')
const sentenceTokenizer = new natural.SentenceTokenizer()
const wordTokenizer = new natural.WordPunctTokenizer()
const mostCommonWords = require('thousand-most-common-words').getWordsByLanguageCode('en').map(word => word.englishWord.toLowerCase())
const { customExcludedTokens } = require('./literature/excludedTokens')
const stemmer = natural.LancasterStemmer
const wordPOS = new WordPOS()
const TfIdf = natural.TfIdf
const tfidf = new TfIdf()
const allWords = {}
const sentenceLengths = []
const notWordTokens = {}
const literaturePath = path.join(__dirname, 'literature')
const HAS_LETTERS_REGEX = /\w/

async function literally() {
    fs.readdir(literaturePath, async (err, files) => {
        if (err) {
            return console.log('Unable to open literature directory!')
        }

        await Promise.all(files.map(async (file) => {
            const fileContent = fs.readFileSync(path.join(literaturePath, file))
            await processFile(fileContent.toString())
        }))
        
        await processAndPrintResults()
    })
}

async function processFile(file) {
    let sentences = sentenceTokenizer.tokenize(file)
    return Promise.all(sentences.map(async (sentence) => await processSentence(sentence)))
}

async function processSentence(sentence) {
    let words = wordTokenizer.tokenize(sentence)
    let sentenceLength = 0
    words.forEach(word => {
        word = word.toLowerCase()
        if (allWords[word]) {
            allWords[word]++
            sentenceLength++
        } else {
            if (notWordTokens[word]) {
                notWordTokens[word]++
            } else if (HAS_LETTERS_REGEX.test(word)) {
                allWords[word] = 1
                sentenceLength++
            } else {
                notWordTokens[word] = 1
            }
        }
    })
    sentenceLengths.push(sentenceLength)
}

async function countWords(words) {
    const wordCounts = Object.entries(allWords)
    const stemmedWordCounts = {}
    await Promise.all(wordCounts.map(async ([word, count]) => {
        const stemmedWord = await stemAndFilterWord(word)
        if (stemmedWord) {
            stemmedWordCounts[stemmedWord] = count
        }
    }))
    const stemmedWordCountArray = Object.entries(stemmedWordCounts)
    stemmedWordCountArray.sort((a, b) => {
        return b[1] - a[1]
    })
    return stemmedWordCountArray
}

async function stemAndFilterWord(word) {
    if (!WordPOS.stopwords.includes(word) && !mostCommonWords.includes(word) && !customExcludedTokens.includes(word)) {
        let definition = await wordPOS.lookup(word)
        if (definition && definition.length > 0) {
            return word
        } else {
            return null
        }
    } else {
        return null
    }
}

function reduceRatio(numerator,denominator){
    var gcd = function gcd(a,b){
      return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return [numerator/gcd, denominator/gcd];
}

async function processAndPrintResults() {
    const filteredWordCounts = await countWords(allWords)
    const avgSentenceLength = sentenceLengths.reduce((prevValue, curValue) => {
        return prevValue + curValue
    }, 0) / sentenceLengths.length
    const commaToPeriodRatio = reduceRatio(notWordTokens[','], notWordTokens['.'])

    console.log('Top twenty most frequent words:')
    filteredWordCounts.slice(0, 19).forEach(([word, count], index) => {
        console.log(`   ${index + 1}. "${word}", ${count} times`)
    })

    console.log('Average sentence length: ', Math.round(avgSentenceLength), ' words')
    console.log('Total comma-to-period ratio: ', commaToPeriodRatio[0], 'commas to ', commaToPeriodRatio[1], ' periods')
}

literally()