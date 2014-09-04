#!/usr/bin/env node

var http = require('http');

var Config = require(__dirname + '/../app/config');
var config = new Config();
var port = config.port;

function execute(scriptName) {
    var Q = require('q');
    var deferred = Q.defer();

    console.log('start execution: ' + scriptName);
    var exec = require('child_process').exec;
    exec(__dirname + '/' + scriptName, function (error, stdout, stderr) {
        console.log('execution done at ' + new Date().toString());
        if (error) {
            console.error(stderr);
            deferred.reject(error, stderr);
        } else {
            console.log(stdout);
            deferred.resolve(stdout);
        }
    });

    return deferred.promise;
}

http.createServer(function (req, res) {
    execute('heracles.js').then(function () {
        execute('sisyphus.js');
    });

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
}).listen(port, '0.0.0.0');

console.log('Server running at port ' + port.toString());