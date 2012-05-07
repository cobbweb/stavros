all:
	jison src/grammar.jison -o src/parser.js

deps:
	npm install
	npm prune

# Demo
demo: all test
	bin/stavros examples/demo.stav
	node demo.js

test: all
	nodeunit tests/lexer.js