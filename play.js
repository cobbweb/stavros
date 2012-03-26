var Lexer = require('./src/lexer');
var fs    = require('fs');

fs.readFile(process.argv[2], 'utf8', function(err, data) {
    if (err) {
        console.log("Error reading file");
        return;
    }

    console.log(Lexer.tokenize(data));
});