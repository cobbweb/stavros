var parser = require('../src-cov/compiler').parser,
    assert = require('assert');


var tokens = {
    "print string": [
        [ 'PRINT', 'print', 0 ],
        [ 'STRING', '"test"', 0 ],
        [ 'EOF', '', 0 ]
    ],

    "print math": [
        [ 'PRINT', 'print', 0 ],
        [ 'INT', '3', 0 ],
        [ 'MATH', '-', 0 ],
        [ 'INT', '1', 0 ],
        [ 'EOF', '', 0 ]
    ],

    "value assignment": [
        [ 'VAL', 'val', 0 ],
        [ 'IDENTIFIER', 'yoyo', 0 ],
        [ 'ASSIGN', '=', 0 ],
        [ 'STRING', '"test"', 0 ],
        [ 'EOF', '', 0 ]
    ],

    "closure creation": [
        [ 'FUN', 'fun', 0 ],
        [ '(', '(', 0 ],
        [ 'VAR', 'var', 0 ],
        [ 'IDENTIFIER', 'name', 0 ],
        [ ':', ':', 0 ],
        [ 'IDENTIFIER', 'String', 0 ],
        [ ')', ')', 0 ],
        [ ':', ':', 0 ],
        [ 'IDENTIFIER', 'Void', 0 ],
        [ '{', '{', 0 ],
        [ 'PRINT', 'print', 1 ],
        [ 'IDENTIFIER', 'name', 1 ],
        [ 'TERMINATOR', '\n', 1 ],
        [ '}', '}', 2 ],
        [ 'EOF', '', 2 ]
    ],

    "if block": [
        [ 'IF', 'if', 0 ],
        [ '(', '(', 0 ],
        [ 'BOOLEAN', 'true', 0 ],
        [ ')', ')', 0 ],
        [ '{', '{', 0 ],
        [ 'PRINT', 'print', 1 ],
        [ 'STRING', '"test"', 1 ],
        [ 'TERMINATOR', '\n', 1 ],
        [ '}', '}', 2 ],
        [ 'EOF', '', 2 ]
    ],

    "if else block": [
        [ 'IF', 'if', 0 ],
        [ '(', '(', 0 ],
        [ 'BOOLEAN', 'true', 0 ],
        [ ')', ')', 0 ],
        [ '{', '{', 0 ],
        [ 'PRINT', 'print', 1 ],
        [ 'STRING', '"test"', 1 ],
        [ 'TERMINATOR', '\n', 1 ],
        [ '}', '}', 2 ],
        [ 'ELSE', 'else', 2 ],
        [ '{', '{', 2 ],
        [ 'PRINT', 'print', 3 ],
        [ 'STRING', '"false"', 3 ],
        [ 'TERMINATOR', '\n', 3 ],
        [ '}', '}', 4 ],
        [ 'EOF', '', 4 ]
    ]
};



module.exports = {

    "Test print string": function(test) {
        test.expect(1);

        var expect = [
            { _type: "Print", expr: {
                _type: "String", value: '"test"', lineNo: 0
            }, lineNo: 0 }
        ];

        test.deepEqual(parser.parse(tokens['print string']), expect, 'Print string');
        test.done();
    },

    "Test print math": function(test) {
        test.expect(4);

        var ast = parser.parse(tokens['print math']);

        test.equal(ast[0]._type, "Print", "Is Print statement");
        test.equal(ast[0].expr._type, "Math", "Is Math");
        test.equal(ast[0].expr.operator, "-", "Math is minus");
        test.equal(ast[0].expr.left.value, 3);

        test.done();
    },

    "Test value assignment": function(test) {
        test.expect(4);
        var ast = parser.parse(tokens['value assignment']);
        var node = ast[0];

        test.equal(node._type, "AssignValue");
        test.equal(node.name, "yoyo");
        test.equal(node.expr._type, "String");
        test.equal(node.assignType, "=");

        test.done();
    },

    "Test closure assignment": function(test) {
        test.expect(3);

        var ast = parser.parse(tokens["closure creation"]);
        var closure = ast[0];

        test.equal(closure._type, "Closure");
        test.equal(closure.returnType, "Void");
        test.equal(closure.parameters.length, 1);

        test.done();
    },

    "Test boolean true as an expression": function(test) {
        test.expect(2);

        var ast = parser.parse([[ "BOOLEAN", "true", 0 ], [ "EOF", "", 0 ]]);
        var node = ast[0];

        test.equal(node._type, "Boolean", "Is boolean");
        test.equal(node.value, "true", "Is true");

        test.done();
    },

    "Test boolean true as an expression": function(test) {
        test.expect(2);

        var ast = parser.parse([[ "BOOLEAN", "false", 0 ], [ "EOF", "", 0 ]]);
        var node = ast[0];

        test.equal(node._type, "Boolean", "Is boolean");
        test.equal(node.value, "false", "Is false");

        test.done();
    },

    "Test If block": function(test) {
        test.expect(2);

        var ast = parser.parse(tokens["if block"]);
        var node = ast[0];

        test.equal(node._type, "IfBlock");
        test.equal(node.trueBlock[0]._type, "Print");

        test.done();
    },

    "Test If Else Blocks": function(test) {
        test.expect(5);

        var ast = parser.parse(tokens["if else block"]);
        var node = ast[0];
        var trueBlock = node.trueBlock;
        var falseBlock = node.falseBlock;

        test.equal(node._type, "IfBlock");

        test.equal(trueBlock[0]._type, "Print");
        test.equal(trueBlock[0].expr.value, '"test"');

        test.equal(falseBlock[0]._type, "Print");
        test.equal(falseBlock[0].expr.value, '"false"');

        test.done();
    }

};
