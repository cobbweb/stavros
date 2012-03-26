/*!
 Stavros lexer
*/

var _ = require('underscore');

var NUMBER     = /^-?[0-9]+(\.[0-9]+)?/,
    COMMENT    = /^((\/\/|#).*)/,
    WHITESPACE = /^[^\n\S]+/,
    KEYWORD    = /^([a-z]+)/ig,
    IDENTIFIER = /^((\$|[a-z])([a-z0-9_$])*)/ig,
    TERMINATOR = /^(\n|;)/,
    STRING     = /^(\'|\")(\\.|[^\"])*(\'|\")/;

var KEYWORDS = [
    // values
    "true",
    "false",
    "null",

    // language
    "import",
    "namespace",
    "class",
    "extends",
    "fun",
    "var",
    "val",

    // control
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case"
];

var LITERALS = {

    COMPARE: [
        "===",
        "!==",
        "==",
        "!=",
        "<=",
        ">=",
        "<",
        ">"
    ],

    ASSIGN: [
        "+=",
        "-=",
        "*=",
        "/=",
        "="
    ],

    MATH: [
        "+",
        "-",
        "*",
        "/",
        "^",
        "%"
    ],

    SYNTAX: [
        '(', ')',
        '[', ']',
        '!',
        '.',
        ',',
        ':',
        '?',
        "@"
    ],

    INDENT: [ '{' ],
    OUTDENT: [ '}' ]

};

var Lexer = function(){};

Lexer.prototype = {

    tokenize: function(code) {
        this.lineNo = 1;
        var chunk, tokens = [], level = 0, levels = 0, i = 0, token;
        code = code.replace(/(\n|\r)+$/, '');

        while (i < code.length) {
            chunk = code.substring(i);

            // Discard whitespace
            token = this.whitespace(chunk);
            if (token.length === 2) {
                i += token[1].length;
                continue;
            }

            // Test for keyword
            token = this.keyword(chunk);
            if (token.length === 2) {
                i += token[1].length;
                token[2] = this.lineNo;
                tokens.push(token);
                continue;
            }

            // Test for comment
            token = this.comment(chunk);
            if (token.length === 2) {
                i += token[1].length;
                token[2] = this.lineNo;
                tokens.push(token);
                continue;
            }

            // Test for identifier (variable name, method name, etc)
            token = this.identifier(chunk);
            if (token.length === 2) {
                i += token[1].length;
                token[2] = this.lineNo;
                tokens.push(token);
                continue;
            }

            // Test for statement terminators
            token = this.terminator(chunk);
            if (token.length === 2) {
                i += token[1].length;
                token[2] = this.lineNo;
                tokens.push(token);

                if (token[1] == "\n") {
                    this.lineNo += 1;
                }

                continue;
            }

            // Test for literal
            token = this.literals(chunk);
            if (token.length === 2) {
                i += token[1].length;
                token[2] = this.lineNo;
                tokens.push(token);
                continue;
            }

            // Test for string
            token = this.string(chunk);
            if (token.length === 2) {
                i += token[1].length;
                token[2] = this.lineNo;
                tokens.push(token);
                continue;
            }

            // Test for integers/floats
            token = this.number(chunk);
            if (token.length === 2) {
                i += token[1].length;
                token[2] = this.lineNo;
                tokens.push(token);
                continue;
            }

            console.log("Could not match chunk starting with " + chunk[0], "...skipping");
            i += 1;
        }

        return tokens;
    },

    keyword: function(chunk) {
        if (chunk.search(KEYWORD) === 0) {
            var result = chunk.match(KEYWORD)[0];
            var index = KEYWORDS.indexOf(result);

            if (index !== -1) {
                return [result.toUpperCase(), result];
            }
        }

        return [];
    },

    comment: function(chunk) {
        if (chunk.search(COMMENT) === 0) {
            var result = chunk.match(COMMENT)[0];

            return ["COMMENT", result];
        }

        return [];
    },

    identifier: function(chunk) {
        if (chunk.search(IDENTIFIER) === 0) {
            var result = chunk.match(IDENTIFIER)[0];

            return ["IDENTIFIER", result];
        }

        return [];
    },

    whitespace: function(chunk) {
        if (chunk.search(WHITESPACE) === 0) {
            var result = chunk.match(WHITESPACE)[0];

            return ["WHITESPACE", result];
        }

        return [];
    },

    number: function(chunk) {
        if (chunk.search(NUMBER) === 0) {
            var result = chunk.match(NUMBER)[0];

            return ["NUMBER", result];
        }

        return [];
    },

    string: function(chunk) {
        if (chunk.search(STRING) === 0) {
            var result = chunk.match(STRING)[0];

            return ["STRING", result];
        }

        return [];
    },

    literals: function(chunk) {
        var token = [];
        _(LITERALS).each(function(lits, name) {
            _(lits).each(function(lit) {
                if (chunk.indexOf(lit) === 0) {
                    token = [name, lit];
                }
            });
        });

        return token;
    },

    terminator: function(chunk) {
        if (chunk.search(TERMINATOR) === 0) {
            return ['TERMINATOR', chunk[0]];
        }

        return [];
    }

};

exports.Lexer = Lexer;

exports.tokenize = function(code) {
    var lexer = new Lexer();
    return lexer.tokenize(code);
};