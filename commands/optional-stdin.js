'use strict'

const fs = require('fs');
const request = require('request');

function cat(stdin, filenames, done) {
    if (stdin && !filenames) return done(stdin);
    filenames = filenames.split(' ');
    const texts = []
    var count = 0;
    filenames.forEach(function (filename, i){
        fs.readFile(filename, {encoding: 'utf8'}, function (err, text){
            if (err) throw err
            if (!text) text = '';
            texts[i] = text
            count++
            if(count === filenames.length) {
                done(texts.join(''));
            }
        })
    })
}
function processFile(stdin, filenames, done, custom){
    if (stdin && !filenames) produceOutput(null, stdin)
    else {fs.readFile(filenames, {encoding: 'utf8'}, produceOutput)}
    function produceOutput (err, text) {
        if (err) throw err
        done(custom(text));
    }

}

function head(stdin, filenames, done) {
    processFile(stdin, filenames, done, function custom(text) {
        return text.split('\n').slice(0,5).join('\n')
    })
}

function tail(stdin, filenames, done) {
    processFile(stdin, filenames, done, function custom(text) {
        return text.split('\n').slice(-5).join('\n')
    })
}

function sort(stdin, filenames, done) {
    processFile(stdin, filenames, done, function custom(text) {
        return text.split('/n').sort().join('\n')
    })
}
function wc(stdin, filenames, done) {
    processFile(stdin, filenames, done, function custom(text) {
        return text.split('\n').length
    })
}
function uniq(stdin, filenames, done) {
    processFile(stdin, filenames, done, function custom(text) {
            const lines = text.split('\n');
            for (var i= 0; i < lines.length; i++) {
                if (lines[i] === lines[i + 1]){
                    lines.splice(i, 1);
                    i--
                }
            }
        return lines.join('\n')
    })
}

function curl(url, done) {
    if (url.slice(0, 7) !== 'http://') url = 'http://' + url;
    request(url, function (err, response, body) {
        if (err) throw err
        else if (response && response.statusCode > 399) throw new Error (response.statusCode)
        if (body) done(body);
        else done('')
    })
}

module.exports = {
    cat
    ,head
    ,tail,
    wc,
    uniq,
    sort,
    curl
}