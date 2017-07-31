'use strict'

const fs = require('fs');
// const chalk = require('chalk');
// const prompt = chalk.blue('\n prompt > ');
function pwd (stdin, args, done) {
    done(process.cwd());
}
function date (stdin, args, done) {
    done(Date());
}
function ls (stdin, args, done) {
    fs.readdir('.', function (err, filenames) {
        if (err) throw err
        done(filenames.join('\n'));
    })
}
function echo (stdin, args, done) {
    const output = args
        .split(' ')
        .map(function (arg) {
            return (arg[0] === '$') ? process.env[arg.slice(1)] : arg;
        })
        .join(' ');
    done(output);
}


module.exports = {
    pwd,
    date,
    ls,
    echo,
}