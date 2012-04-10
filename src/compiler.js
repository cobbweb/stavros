var parser = require('./parser').parser,
    fs     = require('fs'),
    nodes  = require('./nodes'),
    lexer  = require('./lexer'),
    path   = require('path');

parser.yy = nodes;

parser.lexer = {
    "lex": function() {
        var token = this.tokens[this.pos] ? this.tokens[this.pos++] : ['EOF'];
        this.yytext = token[1];
        this.yylineno = token[2];
        return token[0];
    },
    "setInput": function(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    },
    "upcomingInput": function() {
        return "";
    }
};

function compileJS(stmt) {
    var code, error;

    if (!stmt || !stmt.toJs) {
        console.log("Invalid statement", stmt);
        return false;
    }

    if (stmt.validate && !stmt.validate()) {
        return false;
    }

    code = stmt.toJs(compileJS);

    return code;
}

function compilePHP(stmt) {
    var code, error;

    if (!stmt || !stmt.toPhp) {
        console.log("Invalid statement", stmt);
        return false;
    }

    code = stmt.toPhp(compilePHP);

    return code;
}

exports.compile = function(code) {
    var tokens = lexer.tokenise(code);
    var ast = parser.parse(tokens);

    var js = [], php = ["<?php"];
    ast.forEach(function(stmt) {
        js.push(compileJS(stmt));
        php.push(compilePHP(stmt));
    });

    return {
        js: js.join("\n"),
        php: php.join("\n")
    };
};