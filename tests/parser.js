var parser = require('../src/compiler').parser,
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
    }
};
