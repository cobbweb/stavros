var _ = require('underscore'),
    ScopeManager = require('./scope-manager').ScopeManager,
    util = require("util");

var f = util.format;

var AstValidator = function() {
    this.scopeManager = new ScopeManager();
    _.bindAll(this, "validate", "validateNode", "inferExpressionType");
    this.error = false;
    this.closures = 1;
};

AstValidator.prototype.validate = function(ast) {
    _.find(ast, this.validateNode);

    if (this.error) {
        console.log("Compile error: " + this.error);
        return false;
    }

    return true;
};

/** Search down an Expr AST to find what type of node is at the bottom left */
AstValidator.prototype.inferExpressionType = function(node) {
    var i = this.inferExpressionType;
    var type = {};

    switch (node._type) {
        case "BracketBlock":
            type = i(node.expr);
        break;

        case "Math":
        case "Comparison":
            type = i(node.left);
        break;

        case "Closure":
            type = node.returnType;
        break;

        case "VariableCall":
        break;

        case "Integer":
        case "String":
            type = node;
        break;

        case "ClassInstantiation":
            type = node.name;
        break;
    }

    return type;
};

AstValidator.prototype.validateObjectReference = function(name) {
    if (_.isArray(name)) {
        name = name[0];
    }
    var node = this.scopeManager.getIdentifier(name);
    return node;
};

AstValidator.prototype.validateNode = function(node) {
    var identifier;
    switch (node._type) {
        case "AssignVariable":
            identifier = this.scopeManager.getIdentifier(node.name);

            if (identifier) {
                if (identifier._type == "AssignValue" || identifier._type == "ValueParameter") {
                    this.error = f("Cannot redeclare value %s as a variable on line %d", node.name, node.lineNo);
                } else if (identifier.type == "Variable" || identifier._type == "VariableParameter") {
                    this.error = f("Cannot redeclare variable %s on line %d", node.name, node.lineNo);
                }
            } else {
                this.scopeManager.pushIdentifier(node.name, node);
                this.validateNode(node.expr);
            }
        break;

        case "AssignValue":
            if (this.scopeManager.hasIdentifier(node.name)) {
                this.error = f("Cannot redeclare %s as a value on line %d", node.name, node.lineNo);
            } else {
                this.scopeManager.pushIdentifier(node.name, node);
                this.validateNode(node.expr);
                node._inferredType = this.inferExpressionType(node.expr);
            }
        break;

        case "SetVariable":
            identifier = this.scopeManager.getIdentifier(node.name);

            if (identifier && (identifier._type == "AssignValue" || identifier._type == "ValueParameter")) {
                this.error = f("Cannot change value %s on line %d", node.name, node.lineNo);
            } else {
                this.validateNode(node.expr);
                node._inferredType = this.inferExpressionType(node.expr);
            }
        break;

        case "CallVariable":
            if (!this.scopeManager.hasIdentifier(node.name[0])) {
                this.error = f("Call to undefined variable %s on line %d", node.name, node.lineNo);
            }
        break;

        case "Closure":
            this.closures += 1;
            this.scopeManager.createScope("closure" + this.closures);

            _.find(node.parameters, this.validateNode);
            _.find(node.body, this.validateNode);

            if (!this.error) {
                this.scopeManager.exitScope();
            }
        break;

        case "ValueParameter":
        case "VariableParameter":
            if (this.scopeManager.hasIdentifier(node.name)) {
                this.error = f("Cannot redefined a parameter with the same name %s on line %d", node.name, node.lineNo);
            } else {
                this.scopeManager.pushIdentifier(node.name, node);
            }
        break;

        case "CallFunction":
            if (this.validateObjectReference(node.name)) {

            } else {
                identifier = this.scopeManager.getIdentifier(node.name[0]);

                if (!identifier) {
                    this.error = f("Call to undefined function %s on line %d", node.name, node.lineNo);
                } else if (identifier.expr._type !== "Closure") {
                    this.error = f("Cannot call %s as a function or closure on line %d", node.name, node.lineNo);
                }
            }
        break;

        case "BracketBlock":
        case "Print":
            this.validateNode(node.expr);
        break;

        case "Class":
            identifier = this.scopeManager.getIdentifier(node.name);

            if (identifier && identifier._type == "Class") {
                this.error = f("Cannot redefine class %s on line %d", node.name, node.lineNo);
            } else if (this.scopeManager.currentScope.name != "__GLOBAL__") {
                this.error = f("Y U define class %s out of global scope on line %d?", node.name, node.lineNo);
            } else {
                this.scopeManager.pushIdentifier(node.name, node);
                this.scopeManager.createScope(node.name);
                _.find(node.body, this.validateNode);
                this.scopeManager.exitScope();
            }
        break;

        case "ClassInstantiation":

        break;

        case "Comparison":
            if (!this.validateNode(node.left) && !this.validateNode(node.right)) {
                var left = this.inferExpressionType(node.left);
                var right = this.inferExpressionType(node.right);

                if (left._type !== right._type) {
                    this.error = f("Cannot compare type %s to type %s on line %d", left._type, right._type, node.lineNo);
                }
            }
        break;

        case "Math":
            if (!this.validateNode(node.left) && !this.validateNode(node.right)) {
                var left = this.inferExpressionType(node.left);
                var right = this.inferExpressionType(node.right);

                if (node.operator == "+" && left._type == "String" && right._type != "String") {
                    this.error = f("Cannot concatenate %s to String %s... on line %d", right._type, left.value.substring(0, 5), node.lineNo);
                } else if (left._type !== right._type) {
                    this.error = f("Cannot perform mathematical operation '%s' with types %s and %s on line %d (Expected)", node.operator, left._type, right._type, node.lineNo);
                }
            }
        break;
    }

    if (this.error) {
        return true;
    }

    return false;
};

exports.validate = function(ast) {
    var validator = new AstValidator();
    return validator.validate(ast);
};