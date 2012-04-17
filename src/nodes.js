var Nodes = {

    Math: function(left, right, operator) {
        this._type    = "Math";
        this.left     = left;
        this.right    = right;
        this.operator = operator;
    },

    Integer: function(value) {
        this._type = "Integer";
        this.value = value;
    },

    String: function(value) {
        this._type = "String";
        this.value = value;
    },

    Print: function(expr) {
        this._type = "Print";
        this.expr = expr;
    },

    BracketBlock: function(expr) {
        this._type = "BracketBlock";
        this.expr = expr;
    },

    AssignVariable: function(name, expr, assignType) {
        this._type = "AssignVariable";
        this.name = name;
        this.expr = expr;
        this.assignType = assignType;
    },

    AssignValue: function(name, expr, assignType) {
        this._type = "AssignValue";
        this.name = name;
        this.expr = expr;
        this.assignType = assignType;
    },

    SetVariable: function(name, expr, assignType) {
        this._type = "SetVariable";
        this.name = name;
        this.expr = expr;
        this.assignType = assignType;
    },

    CallVariable: function(name) {
        this._type = "CallVariable";
        this.name = name;
    },

    Comparison: function(left, right, comparator) {
        this._type = "Comparison";
        this.left = left;
        this.right = right;
        this.comparator = comparator;
    },

    IfBlock: function(evaluation, trueBlock, falseBlock, elseIfs) {
        this._type = "IfBlock";
        this.evaluation = evaluation;
        this.trueBlock = trueBlock;
        this.falseBlock = falseBlock;
        this.elseIfs = elseIfs;
    },

    ElseIfBlock: function(evaluation, trueBlock) {
        this._type = "ElseIfBlock";
        this.evaluation = evaluation;
        this.trueBlock = trueBlock;
    },

    Closure: function(body, parameters) {
        this._type = "Closure";
        this.body = body;
        this.parameters = parameters;
    },

    VariableParameter: function(name, type) {
        this._type = "VariableParameter";
        this.name = name;
        this.type = type;
    },

    ValueParameter: function(name, type) {
        this._type = "ValueParameter";
        this.name = name;
        this.type = type;
    },

    CallFunction: function(name, args) {
        this._type = "CallFunction";
        this.name = name;
        this.args = args;
    },

    Class: function(name, body) {
        this._type = "Class";
        this.name = name;
        this.body = body;
    }

};

module.exports = Nodes;