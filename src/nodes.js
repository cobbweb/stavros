var _     = require('underscore'),
    Nodes = {},
    Variables = [];

Nodes.Math = function() {
    this.initialise.apply(this, arguments);
    this.type = "Math";
};
Nodes.Math.prototype = {

    initialise: function(left, right, operator)
    {
        _.bindAll(this);
        this.left = left;
        this.right = right;
        this.operator = operator;
    },

    toJs: function(c)
    {
        return [c(this.left), this.operator, c(this.right)].join(' ');
    },

    toPhp: function(c)
    {
        return this.toJs(c);
    }

};

Nodes.Integer = function() {
    this.initialise.apply(this, arguments);
    this.type = "Print";
};
_.extend(Nodes.Integer.prototype, {

    initialise: function(value)
    {
        _.bindAll(this);
        this.value = parseInt(value, 10);
    },

    toJs: function(c)
    {
        return this.value;
    },

    toPhp: function(c)
    {
        return this.toJs(c);
    }

});

Nodes.Print = function() {
    this.initialise.apply(this, arguments);
    this.type = "Print";
};
Nodes.Print.prototype = {

    initialise: function(expr)
    {
        _.bindAll(this);
        this.expr = expr;
    },

    toJs: function(c)
    {
        return 'console.log(' + c(this.expr) + ');';
    },

    toPhp: function(c)
    {
        return 'var_dump(' + c(this.expr) + ');';
    }

};

Nodes.BracketBlock = function() {
    this.initialise.apply(this, arguments);
};
Nodes.BracketBlock.prototype = {

    initialise: function(expr)
    {
        _.bindAll(this);
        this.expr = expr;
    },

    toJs: function(c)
    {
        return '(' + c(this.expr) + ')';
    },

    toPhp: function(c)
    {
        return this.toJs(c);
    }

};

Nodes.AssignVariable = function() {
    this.initialise.apply(this, arguments);
};
Nodes.AssignVariable.prototype = {

    initialise: function(name, expr, assignType)
    {
        _.bindAll(this);
        this.name = name;
        this.expr = expr;
        this.assignType = assignType;
    },

    toJs: function(c)
    {
        return ["var", this.name, this.assignType, c(this.expr)].join(" ") + ";";
    },

    toPhp: function(c)
    {
        return "$" + this.name + " " + this.assignType + " " + c(this.expr) + ";";
    },

    validate: function()
    {
        if (Variables.indexOf(this.name) !== -1) {
            console.log("Cannot redeclare variable %s on line %d", this.name, this.lineNo);
            return false;
        }

        Variables.push(this.name);
        return true;
    }

};

Nodes.CallVariable = function() {
    this.initialise.apply(this, arguments);
};
Nodes.CallVariable.prototype = {

    initialise: function(name)
    {
        _.bindAll(this);
        this.name = name;
    },

    toJs: function(c)
    {
        return this.name;
    },

    toPhp: function(c)
    {
        return "$" + this.name;
    }

};

Nodes.Comparison = function() {
    this.initialise.apply(this, arguments);
};
Nodes.Comparison.prototype = {

    initialise: function(left, right, comparator)
    {
        _.bindAll(this);
        this.left = left;
        this.right = right;
        this.comparator = comparator;
    },

    toJs: function(c)
    {
        return [c(this.left), this.comparator, c(this.right)].join(" ");
    },

    toPhp: function(c)
    {
        return this.toJs(c);
    }

};

module.exports = Nodes;