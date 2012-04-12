var _         = require('underscore'),
    Nodes     = {},
    Variables = [],
    Values    = [];

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
            process.exit();
        }

        if (Values.indexOf(this.name) !== -1) {
            console.log("Cannot redeclare value %s as a variable on line %d", this.name, this.lineNo);
            process.exit();
        }

        Variables.push(this.name);
        return true;
    }

};

Nodes.AssignValue = function() {
    this.initialise.apply(this, arguments);
};
Nodes.AssignValue.prototype = {

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
            console.log("Cannot redeclare variable %s as a value on line %d", this.name, this.lineNo);
            process.exit();
        }

        if (Values.indexOf(this.name) !== -1) {
            console.log("Cannot redeclare value %s on line %d", this.name, this.lineNo);
            process.exit();
        }

        Values.push(this.name);
        return true;
    }

};

Nodes.SetVariable = function() {
    this.initialise.apply(this, arguments);
};
Nodes.SetVariable.prototype = {

    initialise: function(name, expr, assignType)
    {
        _.bindAll(this);
        this.name = name;
        this.expr = expr;
        this.assignType = assignType;
    },

    toJs: function(c)
    {
        return [this.name, this.assignType, c(this.expr)].join(" ") + ";";
    },

    toPhp: function(c)
    {
        return "$" + this.name + " " + this.assignType + " " + c(this.expr) + ";";
    },

    validate: function()
    {
        if (Values.indexOf(this.name) !== -1) {
            console.log("Cannot change value %s on line %d", this.name, this.lineNo);
            return false;
        } else if (Variables.indexOf(this.name) === -1) {
            console.log("Cannot set undefined variable %s on line %d", this.name, this.lineNo);
            return false;
        }

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
    },

    validate: function(c)
    {
        if (Variables.indexOf(this.name) === -1 && Values.indexOf(this.name) === -1) {
            console.log("Call to undefined variable or value %s on line %d", this.name, this.lineNo);
            return false;
        }
        return true;
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

Nodes.IfBlock = function() {
    this.initialise.apply(this, arguments);
    this.type = "IfBlock";
};
Nodes.IfBlock.prototype = {

    initialise: function(evaluation, trueBlock)
    {
        _.bindAll(this);
        this.evaluation = evaluation;
        this.trueBlock = trueBlock;
    },

    toJs: function(c)
    {
        return "if (" + c(this.evaluation) + ") {\n" + c(this.trueBlock) + "\n}";
    },

    toPhp: function(c)
    {
        return this.toJs(c);
    }

};

Nodes.IfElseBlock = function() {
    this.initialise.apply(this, arguments);
    this.type = "IfElseBlock";
};
Nodes.IfElseBlock.prototype = {

    initialise: function(evaluation, trueBlock, falseBlock)
    {
        _.bindAll(this);
        this.evaluation = evaluation;
        this.trueBlock  = trueBlock;
        this.falseBlock = falseBlock;
    },

    toJs: function(c)
    {
        return "if (" + c(this.evaluation) + ") {\n" + c(this.trueBlock) + "\n} else {\n" + c(this.falseBlock) + "\n}";
    },

    toPhp: function(c)
    {
        return this.toJs(c);
    }

};

Nodes.IfElseIfBlock = function() {
    this.initialise.apply(this, arguments);
    this.type = "IfElseIfBlock";
};
Nodes.IfElseIfBlock.prototype = {

    initialise: function(evaluation, trueBlock, elseIfs, falseBlock)
    {
        _.bindAll(this);
        this.evaluation = evaluation;
        this.trueBlock  = trueBlock;
        this.elseIfs    = elseIfs;
        this.falseBlock = falseBlock;
    },

    toJs: function(c)
    {
        var code = ["if (" + c(this.evaluation) + ") {\n" + c(this.trueBlock) + "\n} "];

        _(this.elseIfs).each(function(elseIfBlock) {
            code.push(c(elseIfBlock));
        });

        if (this.falseBlock) {
            code.push(" else {\n" + c(this.falseBlock) + "\n}");
        }

        return code.join("");
    },

    toPhp: function(c)
    {
        return this.toJs(c);
    }

};

Nodes.ElseIfBlock = function() {
    this.initialise.apply(this, arguments);
    this.type = "ElseIfBlock";
};
Nodes.ElseIfBlock.prototype = {

    initialise: function(evaluation, trueBlock)
    {
        _.bindAll(this);
        this.evaluation = evaluation;
        this.trueBlock  = trueBlock;
    },

    toJs: function(c)
    {
        return "else if (" + c(this.evaluation) + ") {\n" + c(this.trueBlock) + "\n}";
    },

    toPhp: function(c)
    {
        return this.toJs(c);
    }

};

module.exports = Nodes;