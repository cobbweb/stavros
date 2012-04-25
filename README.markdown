# Stavros

A work-in-progress attempt at writing my own language for JavaScript, more for fun than anything else. A sort of Scala-like language that combines OOP and functional programming, but without straying too far from JavaScript.

## Install

Clone the repo and cd in, then use `make` to install dependencies and generate the parser.

    make deps
    make

You can then use the `bin/stavros` executable to generate JavaScript for you.

    bin/stavros examples/calc.stav

That will generate a `calc.js` in your pwd which you can execute with Node.JS. For convenience I've added a `test` target in the Makefile.

    make test

This will regenerate the parser, compile `examples/calc.stav` and then execute the generated JavaScript.

## The future

I've still got a number of issue to tackle beyond syntax and learning Jison grammar, like:

* What's the best way inject runtime code to fix features that don't exist in the target languages (i.e. PHP doesn't have a `console.log` so calc.php and calc.js have different outputs).
* How will you integrate with libraries in target languages (i.e. jQuery, Backbone, etc).
* How will you debug code?
