# Code examples to copy from images

This repo contains coding examples to be copied by first-time learners of
programming, on the hypothesis that: "Typing code helps you learn, so rather
than giving you text to copy and paste the code is an image that you must read,
hold in your mind, type in to your editor and then manually check for
accuracy."

- The `code-examples/` directory contains the source files that must be transformed into images. They are divided into multiple stages and extras.
- The `dev/` directory contains all the scripts that are used to transform the source files into images.
- The `docs/pages/` directory contains HTML files that show the examples and its css. When examples are updated, these may need updating too.
- The `docs/img/` directory contains images of the examples.

## How to execute

For the project to work correctly, you must install all the relevant modules:<br>
`npm install`

To execute the main script, type from the command line at the root of the project:<br>
`npm run build`

## Adding new examples

If you want to add an example you must add its source code inside `code-examples/stage-*` or `code-examples/extras-*`.<br>

Then you must create a `.md` file inside `docs/md/stage-*/` with the same name as your source file.<br>
Example: You have added `12-hungry.js` inside `code-examples/stage-1/`, you must create `12-hungry.js.md` inside `docs/md/stage-*/`.


## Md Example
```markdown
# Example title

any description goes here, including **formatting**

<img alt="What you want for the image" >

any further stuff goes here

## Documentation links

* [the modulo operator `%`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)

## Metadata

* badge: for-loop
* badge: for-loop
* category: foobar
* difficulty: easy
```

Even if you don't have documentation links, you **need** to add the three titles.

## Adding a new stage

You can create a new `code-examples/stage-?/` or `code-examples/extras-?/` folder and put your source code inside.<br>
If you create a new `code-examples/stage-?/` or `code-examples/extras-?/` folder you should create the corresponding page: `docs/stage-?.html` or `docs/extras-?.html`.

## Adding new languages
Languages currently supported to convert :
1. javascript
2. html
3. xml

If you want to make the application support another language go inside `dev/create-img-from-source.ts`<br>

Import your language from `highlight.js/lib/languages`<br>
Add `hljs.registerLanguage(languageName, languageDefinition)` near the top of the file.<br>

Documentation for `highlightjs.registerLanguage()` : <br>
https://highlightjs.readthedocs.io/en/latest/api.html#registerlanguage-languagename-languagedefinition

# Old Docs

## Stage 1: Variables and Conditional statements

These examples contain just `if`, variables, strings and numbers, `console.log`, and a sync promp.

The advanced variations touch on arrays, objects, and do-while loops.

1. given a number, log whether it is odd or even
2. … or fractional
3. … or not a number at all
4. given two params, return their concatenation
5. given two numbers, return their sum
6. how long is this word? given a string, log its length
7. rock - paper - scissors - one game
8. what number am I thinking? given a number between 1 and 10, get random number, output if you guessed right
9. … sarcastic, passive-aggresive version of this, as error checking
 - maybe this should still use command-line argument?
 - … more conversational, nice at first but increasingly unhappy and annoyed
 - … with [colors](https://npmjs.com/package/colors)

Advanced:

10. rock-paper-scissors with array and object so it's shorter
11. rock-paper-scissors in a loop until the user enters "stop"

## Stage 2: Arrays, Objects, Loops

These examples deal with arrays, objects, loops.

The advanced variations touch on functions?


1. multiply by adding
2. count words by counting spaces
3. … ignoring consecutive spaces
4. … count sentences by counting ". "
5. take a file name, remove filename extension
6. generate random text of N words
7. generate random text of N words, but with sentences
8. in-memory nickbook (like a phonebook)

Advanced:

9. remove filename extension with lastIndexOf and substring
10. generate sentences with functions to remove repetition

## Stage 3: functions? packages?

1. function: isPrime
2. function: reverseArray
3. function isPalindrome, using reverseArray
4. function to roll a dice
5. compute percentages of numbers
6. show histogram of N dice rolls
  - challenge: show histogram of N rolls of 2 dice each
7. draw a tower
8. … with colors https://npmjs.com/package/colors

Advanced:

9. draw several towers next to one another
10. play hanoi towers without recursion
11. play hanoi towers with recursion

## Stage 4: CLI/fs programs?

change the above programs to use process.argv rather than prompt

1. replicate `seq first last`
2. replicate `seq [first [incr]] last`

3. reverse a text file
4. reverse each word in a text file
5. rot13

6. count the words in a text file
7. print out top-N most frequent words
(challenge: omit counting words shorter than argument `n`)
(challenge: pass a stop list as a paramteter)
(challenge: modify so it works with words or characters)

Advanced:

6. substitution cipher or caesar cipher or some such (Matt)
7. rock - paper - scissors - just with if and Math.random(), log one of them
8. rock - paper - scissors judge: takes two words, logs who won
 - … try to add spock and lizard
 - … ``` node judge `node rps` `node rps` ```
 - … then try write rock.js which always just logs the word "rock", and let rps.js play against rock.js


## Extras

* Milliways: an example where we took a bad repetitive program for ordering meals at the Restaurant at the End of the Universe, and rewrote it in an online session to use functions and loops in the right way.


## further thoughts

maybe our programs can contain a function that does readline with a promise, which they simply copy, and then we can have a conversational interface, so we can avoid `npm i` in the first examples


### when we have DOM

* replicate the PI two-digit distribution check from https://www.youtube.com/watch?v=etx0k1nLn78 with plotting in SVG or on Canvas




also continue adding: on your own, try to write this instead: …

999. ELIZA
