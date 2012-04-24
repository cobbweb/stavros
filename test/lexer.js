var Lexer = require('../src/lexer'),
    assert = require('assert');

module.exports = {

    'Whitespace test': function(test) {
        test.expect(1);

        var code = "     ";
        var expect = [ ['EOF', '', 0] ];

        test.deepEqual(Lexer.tokenise(code), expect, "Whitespace");
        test.done();
    },

    'Keyword test': function(test) {
        test.expect(1);

        var code = "print";
        var expect = [ ["PRINT", "print", 0], ['EOF', '', 0] ];

        test.deepEqual(Lexer.tokenise(code), expect, "Keyword");
        test.done();
    },

    'Combination test': function(test) {
        test.expect(1);

        var code = "print 'Test'\nval sum = 4 + 3";
        var expect = [
            ["PRINT", "print", 0],
            ["STRING", "'Test'", 0],
            ["TERMINATOR", "\n", 0],
            ["VAL", 'val', 1],
            ["IDENTIFIER", "sum", 1],
            ["ASSIGN", "=", 1],
            ["INT", "4", 1],
            ["MATH", "+", 1],
            ["INT", "3", 1],
            ["EOF", '', 1]
        ];

        test.deepEqual(Lexer.tokenise(code), expect, "Combination");
        test.done();
    }

};