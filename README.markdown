# Stavros

A [naive attempt at writing a language to target JavaScript](http://cobbweb.me/blog/2012/04/13/im-writing-my-own-language-to-target-javascript/). I sort of Scala-like language that combines OOP and functional programming but without straying to far from the syntax and features of JavaScript and PHP.

I still haven't decided on final syntax, I need to think it out more and get some peer review. But you can see some concepts in the examples folder.

### Rough roadmap

* Get a full language compiling to JavaScript (In progress)
* Add type inferencing and optimise errors
* Write PHP compiler

## Install

Fork/clone the repo and cd in, then use `make` to install dependencies and generate the parser.

    make deps
    make

You can then use the `bin/stavros` executable to generate PHP and JavaScript for you.

    bin/stavros examples/calc.stav

That will generate a `calc.js` and `calc.php` in your `pwd` which you execute with `php` or `node`. For convenience I've added a `test` target in the Makefile.

    make test

This will regenerate the parser, compile `examples/calc.stav` and then execute the generate files in their respective environments.

## The future

I've still got a number of issue to tackle beyond syntax and learning Jison grammar, like:

* How do you choose between what gets compiled to PHP and what gets compiled to JavaScript?
* What's the best way inject runtime code to fix features that don't exist in the target languages (i.e. PHP doesn't have a `console.log` so calc.php and calc.js have different outputs).
* How will you integrate with libraries in target languages (i.e. jQuery, Backbone, Doctrine, Symfony, etc).
* How will you debug code?
* Can I even get complicated Stavros code to compile to both PHP and JavaScript without having to write any special hacks in your Stavros code?
