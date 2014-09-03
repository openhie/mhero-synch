#!/usr/bin/env node

var http = require('http');

var port = 8082;

function execute(scriptName) {
    console.log('start execution: ' + scriptName);
    var exec = require('child_process').exec;
    exec(__dirname + '/' + scriptName, function (error, stdout, stderr) {
        console.log('execution done at ' + new Date().toString());
        if (error) {
            console.error(stderr);
        } else {
            console.log(stdout);
        }
    });
}

http.createServer(function (req, res) {
    execute('heracles.js');
    execute('sisyphus.js');

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
}).listen(port, '0.0.0.0');

console.log('Server running at port ' + port.toString());