var _ = require('underscore');

var Rewriter = function() {
    this.initialise.apply(this, arguments);
};
Rewriter.prototype = {

    initialise: function(tokens)
    {
        _.bindAll(this);
        this.tokens = tokens;
    },

    rewrite: function()
    {
        this.newTokens = _.filter(this.tokens, this.rewriteToken);

        return this.newTokens;
    },

    rewriteToken: function(token, index)
    {
        if (token[0] == "{") {
            this.markForRemoval("TERMINATOR", token[2]);
        }

        if (token.length === 4 && token[3] === false) {
            return false;
        }

        return true;
    },

    markForRemoval: function(name, lineNo)
    {
        _.each(this.tokens, function(token, i) {
            if (token[0] == name && token[2] == lineNo) {
                this.tokens[i][3] = false;
            }
        }, this);
    }

};

exports.rewrite = function(tokens)
{
    var rewriter = new Rewriter(tokens);
    return rewriter.rewrite();
}