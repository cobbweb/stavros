var _ = require('underscore');

var ScopeManager = function() {
    this.initialise.apply(this, arguments);
};
ScopeManager.prototype = {

    initialise: function()
    {
        _.bindAll(this);
        this.global = new Scope('__GLOBAL__');
        this.currentScope = this.global;
    },

    createScope: function(name)
    {
        var scope = this.currentScope.pushScope(name, this.currentScope);

        if (!scope) {
            console.log("Scope conlict: Cannot define identifier %s in scope %s", name, this.currentScope.name);
            process.exit();
        }

        this.currentScope = scope;
    },

    exitScope: function()
    {
        if (!this.currentScope.parent) {
            console.log("Scope error: Cannot exit global scope");
        }

        this.currentScope = this.currentScope.parent;
    },

    pushIdentifier: function(name, node)
    {
        this.currentScope.pushIdentifier(name, node);
    },

    hasIdentifier: function(name)
    {
        return this.currentScope.hasIdentifier(name);
    },

    getIdentifier: function(name)
    {
        return this.currentScope.getIdentifier(name);
    }

};

var Scope = function() {
    this.initialise.apply(this, arguments);
};
Scope.prototype = {

    initialise: function(name, parent)
    {
        _.bindAll(this);
        this.name = name;
        this.parent = parent;
        this.identifiers = {};
        this.children = {};
    },

    pushIdentifier: function(name, node)
    {
        this.identifiers[name] = node;
    },

    hasIdentifier: function(name)
    {
        return name in this.identifiers;
    },

    getIdentifier: function(name)
    {
        return this.identifiers[name];
    },

    pushScope: function(name)
    {
        if (this.hasScope(name)) {
            return false;
        }

        this.children[name] = new Scope(name, this);
        return this.children[name];
    },

    hasScope: function(name)
    {
        return name in this.children;
    }

};

exports.ScopeManager = ScopeManager;