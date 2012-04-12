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
    : 'PRINT' expr
        { $$ = new yy.Print($2); }
    | assignment
        { $$ = $1; }
    | ifblocks
        { $$ = $1; }
    | expr
        { $$ = $1; }
    ;

ifblocks
    : 'IF' '(' expr ')' block
        { $$ = new yy.IfBlock($3, $5); }
    | 'IF' '(' expr ')' block 'ELSE' block
        { $$ = new yy.IfElseBlock($3, $5, $7); }
    | 'IF' '(' expr ')' block elseifs
        { $$ = new yy.IfElseIfBlock($3, $5, $6) }
    | 'IF' '(' expr ')' block elseifs 'ELSE' block
        { $$ = new yy.IfElseIfBlock($3, $5, $6, $8) }
    ;

elseifs
    : 'ELSE' 'IF' '(' expr ')' block
        { $$ = [new yy.ElseIfBlock($4, $6)]; }
    | elseifs 'ELSE' 'IF' '(' expr ')' block
        { $$ = $1; $1.push(new yy.ElseIfBlock($5, $7)); }
    ;

block
    : '{' body '}'
        { $$ = $2[0] }
    ;

assignment
    : 'VAR' 'IDENTIFIER' 'ASSIGN' expr
        { $$ = new yy.AssignVariable($2, $4, $3); $$.lineNo = yylineno; }
    | 'VAL' 'IDENTIFIER' 'ASSIGN' expr
        { $$ = new yy.AssignValue($2, $4, $3); $$.lineNo = yylineno; }
    | 'IDENTIFIER' 'ASSIGN' expr
        { $$ = new yy.SetVariable($1, $3, $2); $$.lineNo = yylineno; }
    ;

expr
    : '(' expr ')'
        { $$ = new yy.BracketBlock($2); }
    | expr 'MATH' expr
        { $$ = new yy.Math($1, $3, $2); }
    | expr 'COMPARE' expr
        { $$ = new yy.Comparison($1, $3, $2); }
    | expr 'BOOLOP' expr
        { $$ = new yy.Comparison($1, $3, $2); }
    | type
        { $$ = $1; }
    ;

type
    : 'IDENTIFIER'
        { $$ = new yy.CallVariable($1); }
    | 'INT'
        { $$ = new yy.Integer($1); }
    ;