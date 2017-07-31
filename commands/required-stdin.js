'use strict'
const chalk = require('chalk');

function grep(stdin, matchString, done) {
    const matcher = new RegExp(matchString, 'g');
    const matches = stdin
    .split('\n')
    .filter(line => matcher.test(line))
    .map(line => {
        return line.replace(matcher,match => chalk.green(match));
    })
    .join('\n');
    done(matches);
}

module.exports = {
    grep
}