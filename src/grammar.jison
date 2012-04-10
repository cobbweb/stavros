/* description: Calculator with variables */

%left 'MATH' 'COMPARE'

%start program
%%

program
    : 'EOF'
        {  }
    | body 'EOF'
        { return $1; }
    ;

body
    : stmt
        { $$ = [$1]; }
    | body TERMINATOR stmt
        { $$ = $1; $1.push($3); }
    | body TERMINATOR
        { $$ = $1; }
    ;

stmt
    : 'PRINT' expr
        { $$ = new yy.Print($2); }
    | 'VAR' 'IDENTIFIER' 'ASSIGN' expr
        { $$ = new yy.AssignVariable($2, $4, $3); $$.lineNo = yylineno; }
    | 'IDENTIFIER' 'ASSIGN' expr
        { $$ = new yy.SetVariable($1, $3, $2); }
    ;

expr
    : '(' expr ')'
        { $$ = new yy.BracketBlock($2); }
    | expr 'MATH' expr
        { $$ = new yy.Math($1, $3, $2); }
    | expr 'COMPARE' expr
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