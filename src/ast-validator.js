var _ = require('underscore'),
    ScopeManager = require('./scope-manager').ScopeManager,
    util = require("util");

var AstValidator = function() {
    this.scopeManager = new ScopeManager();
    _.bindAll(this, "validate", "validateNode");
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

AstValidator.prototype.validateNode = function(node) {
    switch (node._type) {
        case "AssignVariable":
            var identifier = this.scopeManager.getIdentifier(node.name);

            if (identifier) {
                if (identifier._type == "AssignValue" || identifier._type == "ValueParameter") {
                    this.error = util.format("Cannot redeclare value %s as a variable on line %d", node.name, node.lineNo);
                } else if (identifier.type == "Variable" || identifier._type == "VariableParameter") {
                    this.error = util.format("Cannot redeclare variable %s on line %d", node.name, node.lineNo);
                }
            } else {
                this.scopeManager.pushIdentifier(node.name, node);
                this.validateNode(node.expr);
            }
        break;

        case "AssignValue":
            if (this.scopeManager.hasIdentifier(node.name)) {
                this.error = util.format("Cannot redeclare %s as a value on line %d", node.name, node.lineNo);
            } else {
                this.scopeManager.pushIdentifier(node.name, node);
                this.validateNode(node.expr);
            }
        break;

        case "SetVariable":
            var identifier = this.scopeManager.getIdentifier(node.name);

            if (identifier && (identifier._type == "AssignValue" || identifier._type == "ValueParameter")) {
                this.error = util.format("Cannot change value %s on line %d", node.name, node.lineNo);
            } else {
                this.validateNode(node.expr);
            }
        break;

        case "CallVariable":
            if (!this.scopeManager.hasIdentifier(node.name)) {
                this.error = util.format("Call to undefined variable %s on line %d", node.name, node.lineNo);
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
                this.error = util.format("Cannot redefined a parameter with the same name %s on line %d", node.name, node.lineNo);
            } else {
                this.scopeManager.pushIdentifier(node.name, node);
            }
        break;

        case "CallFunction":
            var identifier = this.scopeManager.getIdentifier(node.name);

            if (!identifier) {
                this.error = util.format("Call to undefined function %s on line %d", node.name, node.lineNo);
            } else if (identifier.expr._type !== "Closure") {
                this.error = util.format("Cannot call %s as a function or closure on line %d", node.name, node.lineNo);
            }
        break;

        case "Print":
            this.validateNode(node.expr);
        break;

        case "Class":
            this.scopeManager.createScope(node.name);

            _.find(node.body, this.validateNode);

            this.scopeManager.exitScope();
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