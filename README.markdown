# Stavros

I don't like JavaScript, I don't like PHP, I don't CoffeeScript. I'm trying to roll them all into one language that compiles to JavaScript and PHP. I'm also throwing in a few features from Scala, but it should still be easy for anyone coming from a PHP background. The language is writtin on top of JavaScript and the parser generated using [Jison](http://zaach.github.com/jison/), CoffeeScript and Roy use this.

I still haven't decided on final syntax, I need to think it out more and get some peer review. But you can see some concepts in the examples folder.

## Install

Fork/clone the repo and cd in, then use `make` to install dependencies and generate the parser.

    make deps
    make

You can then use the `bin/stavros` executable to generate PHP and JavaScript for you.

    bin/stavros examples/calc.stav

That will generate a `calc.js` and `calc.php` in your `pwd` which you execute with `php` or `node`. For convenience I've added a `test` target in the Makefile.

    make test

This will regenerate parser, compile `examples/calc.stav` and then execute the generate files in their respective environments.

## The future

I've still got a number of issue to tackle beyond syntax and learning Jison grammar, like:

* How do you choose between what gets compiled to PHP and what gets compiled to JavaScript?
* What's the best way inject runtime code to fix features that don't exist in the target languages (i.e. PHP doesn't have a `console.log` so calc.php and calc.js have different outputs).
* How will you integrate with libraries in target languages (i.e. jQuery, Backbone, Doctrine, Symfony, etc).
* How will you debug code?
* Can I even get complicated Stavros code to compile to both PHP and JavaScript without having to write an special hacks in your Stavros code?
