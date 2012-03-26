var Lexer = require('../src/lexer'),
    assert = require('assert');

module.exports = {
    'Basic Keyword Matcher': function(test) {
        test.expect(1);

        var code = " if  while  ";
        var expect = [
            ["IF", "if", 1], ["WHILE", "while", 1]
        ];

        test.deepEqual(Lexer.tokenize(code), expect, "If While");
        test.done();
    },

    'Test Line Number': function(test) {
        test.expect(7);

        var code   = " if \n  while";
        var lexer  = new Lexer.Lexer();
        var tokens = lexer.tokenize(code);

        test.equal(lexer.lineNo, 2, "Test two line numbers");
        test.equal(tokens[0][2], 1, "Token on line 1");
        test.equal(tokens[1][2], 2, "Token on line 2");

        code   = "if  \n while \n if ";
        tokens = lexer.tokenize(code);

        test.equal(lexer.lineNo, 3, "Test three line numbers");
        test.equal(tokens[0][2], 1, "Token on line 1");
        test.equal(tokens[2][2], 3, "Token on line 3");
        test.deepEqual(tokens[1], ["WHILE", "while", 2], "While token on line 2");

        test.done();
    },

    'Whitespace Matcher': function(test) {
        test.expect(1);

        var code = "    ";
        var expect = [];

        test.deepEqual(Lexer.tokenize(code), expect, "No whitespace tokens");
        test.done();
    },

    "Basic number matcher": function(test) {
        test.expect(1);

        var code = " 1 2   32 1232122321 ";
        var expect = [
            ["NUMBER", 1, 1], ["NUMBER", 2, 1], ["NUMBER", 32, 1], ["NUMBER", 1232122321, 1]
        ];

        test.deepEqual(Lexer.tokenize(code), expect);
        test.done();
    },

    "Basic float matcher": function(test) {
        test.expect(1);

        var code = " 1.23  3.12321234543 34 75739383198.1286874729";
        var exepect = [
            ["NUMBER", 1.23, 1], ["NUMBER", 3.12321234543, 1], ["NUMBER", 34, 1], ["NUMBER", 75739383198.1286874729, 1]
        ];

        test.deepEqual(Lexer.tokenize(code), exepect);
        test.done();
    }

};