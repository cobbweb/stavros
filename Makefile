all:
	jison src/grammar.jison -o src/parser.js

deps:
	npm install
	npm prune

# Tests
test: all
	bin/stavros examples/calc.stav
	node calc.js
