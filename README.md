# literal-y

Ever struggled to explain your writing style? Here's a little tool that prints simple metrics on prose.

## How to use

1. `npm install`
2. Paste the writing to be analyzed in the `literature` directory.
3. Add any words you'd like to be excluded from the total word frequency counts. I'd suggest including all frequently-used proper nouns like main character names and place names. The most frequently used 1000 words in the English language are already excluded (who cares how many time you write 'the'?). All lower case, please!
4. Run `node index.js` in the root directory.

## Sample Output

Here's the stats for the four Dostoyevsky novels most frequently accessed on Project Gutenberg, excluding the words 'raskolnikov', 'razumihin', 'sonia', 'dounia', 'ivanovna', 'petrovitch', and 'alyosha':

```
Top twenty most frequent words:
   1. "not", 7374 times
   2. "prince", 1897 times
   3. "don", 1805 times
   4. "suddenly", 1142 times
   5. "away", 1023 times
   6. "eyes", 866 times
   7. "almost", 725 times
   8. "understand", 656 times
   9. "going", 637 times
   10. "god", 603 times
   11. "really", 584 times
   12. "looking", 572 times
   13. "won", 531 times
   14. "hands", 512 times
   15. "turned", 511 times
   16. "words", 505 times
   17. "simply", 475 times
   18. "years", 463 times
   19. "sort", 414 times
Average sentence length:  14  words
Total comma-to-period ratio:  69335 commas to  41493  periods
```