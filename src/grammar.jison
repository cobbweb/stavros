/* description: Calculator with variables */

%left 'MATH' 'COMPARE' 'BOOLOP'

%start program
%%

program
    : 'EOF'
        {  }
    | body 'EOF'
        { return $1; }
    ;

body
    : line
        { $$ = [$1]; }
    | body TERMINATOR line
        { $$ = $1; $1.push($3); }
    | body TERMINATOR
        { $$ = $1; }
    ;

line
    : PRINT expr
        { $$ = new yy.Print($2); }
    | class
        { $$ = $1; }
    | assignment
        { $$ = $1; }
    | ifblocks
        { $$ = $1; }
    | expr
        { $$ = $1; }
    ;

ifblocks
    : IF '(' expr ')' block
        { $$ = new yy.IfBlock($3, $5); }
    | IF '(' expr ')' block ELSE block
        { $$ = new yy.IfBlock($3, $5, $7); }
    | IF '(' expr ')' block elseifs
        { $$ = new yy.IfBlock($3, $5, false, $6) }
    | IF '(' expr ')' block elseifs ELSE block
        { $$ = new yy.IfBlock($3, $5, $8, $6) }
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
        { $$ = new yy.AssignVariable($2, $4, $3); $$.lineNo = yylineno; }
    | VAL IDENTIFIER ASSIGN expr
        { $$ = new yy.AssignValue($2, $4, $3); $$.lineNo = yylineno; }
    | IDENTIFIER ASSIGN expr
        { $$ = new yy.SetVariable($1, $3, $2); $$.lineNo = yylineno; }
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
        { $$ = $1; }
    | variablecall
        { $$ = $1; }
    | type
        { $$ = $1; }
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
    : FUN '('')' block
        { $$ = new yy.Closure($4); }
    | FUN '(' parameters ')' block
        { $$ = new yy.Closure($5, $3); }
    ;

class
    : CLASS IDENTIFIER block
        { $$ = new yy.Class($2, $3); $$.lineNo = yylineno; }
    ;

variablecall
    : IDENTIFIER '('')'
        { $$ = new yy.CallFunction($1); $$.lineNo = yylineno; }
    | IDENTIFIER '(' arguments ')'
        { $$ = new yy.CallFunction($1, $3); $$.lineNo = yylineno; }
    | IDENTIFIER
        { $$ = new yy.CallVariable($1); $$.lineNo = yylineno; }
    ;

type
    : INT
        { $$ = new yy.Integer($1); }
    | STRING
        { $$ = new yy.String($1); }
    ;