var _    = require('underscore'),
    util = require('util');

var f = util.format;

var JsCompiler = function() {
    _.bindAll(this);
    this.code = ["var _ = require('underscore');"];
};

JsCompiler.prototype.compile = function(ast) {
    _.each(ast, function(node) {
        this.code.push(this.compileNode(node));
    }, this);

    return this.code;
};

JsCompiler.prototype.compileNode = function(node) {
    var code;
    var c = this.compileNode;

    switch (node._type) {
        case "Print":
            code = f("console.log(%s);", c(node.expr));
        break;

        case "String":
            code = String(node.value);
        break;

        case "Math":
            code = f("%s %s %s", c(node.left), node.operator, c(node.right));
        break;

        case "Integer":
            code = node.value;
        break;

        case "BracketBlock":
            code = f("(%s)", c(node.expr));
        break;

        case "AssignValue":
        case "AssignVariable":
            code = f("var %s = %s;", node.name, c(node.expr));
        break;

        case "SetVariable":
            code = f("%s = %s;", node.name, c(node.expr));
        break;

        case "VariableParameter":
        case "ValueParameter":
        case "CallVariable":
            code = node.name;
        break;

        case "Comparison":
            code = f("%s %s %s", c(node.left), node.comparator, c(node.right));
        break;

        case "IfBlock":
            code = f("if (%s) {\n%s\n}", c(node.evaluation), c(node.trueBlock));

            if (node.elseIfs) {
                _.each(node.elseIfs, function(node) {
                    code += c(node);
                }, this);
            }

            if (node.falseBlock) {
                code += f(" else {\n%s\n}", c(node.falseBlock));
            }
        break;

        case "ElseIfBlock":
            code = f(" else if (%s) {\n%s\n}", node.evaluation, node.trueBlock);
        break;

        case "Closure":
            var params = [], body = [];

            if (node.parameters) {
                _.each(node.parameters, function(parameter) {
                    params.push(c(parameter));
                }, this);
            }

            _.each(node.body, function(bodyNode) {
                body.push(c(bodyNode));
            }, this);

            code = f("_.bind(function (%s) {\n%s\n}, this)", params.join(""), body.join("\n"));
        break;

        case "CallFunction":
            var args = [];

            if (node.args) {
                _.each(node.args, function(arg) {
                    args.push(c(arg));
                }, this);
            }

            code = f("%s(%s);", node.name, args.join(", "));
        break;

        case "Class":
            var body = [];

            _.each(node.body, function(bodyNode) {
                body.push(c(bodyNode));
            });

            code = f("function %s() {\n%s\n}", node.name, body.join("\n"));
        break;
    }

    return code;
};

exports.compile = function(ast) {
    var compiler = new JsCompiler();
    return compiler.compile(ast);
};