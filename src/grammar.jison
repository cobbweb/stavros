/* description: I like kill bats and mice, and have cute eyes. */

%left 'MATH' 'COMPARE' 'BOOLOP'

%start program
%%

program
    : EOF
        {  }
    | body EOF
        { return $1; }
    ;

body
    : line
        { $$ = [$1]; }
    | body TERMINATOR line
        { $$ = $1; $1.push($3); }
    | body TERMINATOR
    ;

line
    : PRINT expr
        { $$ = new yy.Print($2); }
    | classdef
    | assignment
    | ifblocks
    | expr
    ;

ifblocks
    : IF '(' expr ')' block
        { $$ = new yy.IfBlock($3, $5); }
    | IF '(' expr ')' block ELSE block
        { $$ = new yy.IfBlock($3, $5, $7); }
    | IF '(' expr ')' block elseifs
        { $$ = new yy.IfBlock($3, $5, false, $6); }
    | IF '(' expr ')' block elseifs ELSE block
        { $$ = new yy.IfBlock($3, $5, $8, $6); }
    ;

elseifs
    : ELSE IF '(' expr ')' block
        { $$ = [new yy.ElseIfBlock($4, $6)]; }
    | elseifs ELSE IF '(' expr ')' block
        { $$ = $1; $1.push(new yy.ElseIfBlock($5, $7)); }
    ;

block
    : '{' '}'
        { $$ = []; }
    | '{' body '}'
        { $$ = $2; }
    ;

assignment
    : VAR IDENTIFIER ASSIGN expr
        { $$ = new yy.AssignVariable($2, $4, $3); }
    | VAL IDENTIFIER ASSIGN expr
        { $$ = new yy.AssignValue($2, $4, $3); }
    | IDENTIFIER ASSIGN expr
        { $$ = new yy.SetVariable($1, $3, $2); }
    ;

expr
    : '(' expr ')'
        { $$ = new yy.BracketBlock($2); }
    | expr MATH expr
        { $$ = new yy.Math($1, $3, $2); }
    | expr COMPARE expr
        { $$ = new yy.Comparison($1, $3, $2); }
    | expr BOOLOP expr
        { $$ = new yy.Comparison($1, $3, $2); }
    | closure
    | variablecall
    | type
    ;

parameters
    : parameter
        { $$ = [$1] }
    | parameters ',' parameter
        { $$ = $1; $1.push($3) }
    ;

parameter
    : IDENTIFIER ':' IDENTIFIER
        { $$ = new yy.ValueParameter($1, $3); }
    | VAL IDENTIFIER ':' IDENTIFIER
        { $$ = new yy.ValueParameter($2, $4); }
    | VAR IDENTIFIER ':' IDENTIFIER
        { $$ = new yy.VariableParameter($2, $4); }
    ;

arguments
    : expr
        { $$ = [$1]; }
    | arguments ',' expr
        { $$ = $1; $1.push($3); }
    ;

closure
    : FUN '('')'':' IDENTIFIER block
        { $$ = new yy.Closure($6, $5); }
    | FUN '(' parameters ')' ':' IDENTIFIER block
        { $$ = new yy.Closure($7, $3, $6); }
    ;

classdef
    : CLASS IDENTIFIER '{' classbody '}'
        { $$ = new yy.Class($2, $4); }
    ;

classbody
    : classline
        { $$ = [$1]; }
    | classbody TERMINATOR classline
        { $$ = $1; $1.push($3); }
    | classbody TERMINATOR
    ;

classline
    : method
    ;

method
    : PUBLIC FUN IDENTIFIER '(' ')' block
        { $$ = new yy.Method($1, $3, $6); }
    | PUBLIC FUN IDENTIFIER '(' parameters ')' block
        { $$ = new yy.Method($1, $3, $7, $5); }
    ;

variablecall
    : IDENTIFIER '('')'
        { $$ = new yy.CallFunction($1); }
    | IDENTIFIER '(' arguments ')'
        { $$ = new yy.CallFunction($1, $3); }
    | IDENTIFIER
        { $$ = new yy.CallVariable($1); }
    ;

type
    : INT
        { $$ = new yy.Integer($1); }
    | STRING
        { $$ = new yy.String($1); }
    ;