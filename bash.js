const chalk = require('chalk');
const commands = require('./commands')

const prompt = chalk.blue('\n prompt > ');
var cmdGroups = [];

process.stdout.write(prompt);
process.stdin.on('data', function (data) {
    cmdGroups = data.toString().trim().split(/\s*\|\s*/g);
    const unsafeCommands = getUnsafe(cmdGroups);
    if (unsafeCommands.length) {
        process.stderr.write(chalk.red('command(s) not found: ') + unsafeCommands.join(' '));
        cmdGroups = [];
        done('');
    } else {
        execute(cmdGroups.shift());
    }

})
//potato

function getUnsafe(cmdStrings) {
    return cmdStrings
    .map(cmdString => cmdString.split(' ')[0])
    .filter(cmd => !commands[cmd]);
}

function execute(cmdString, lastOutput) {
    const tokens = cmdString.toString().trim().split(' ');
    const cmd = tokens[0];
    const args = tokens.slice(1).join(' ');

    if (commands[cmd]) commands[cmd](lastOutput, args, done)
    // else {
    //     process.stderr.write(chalk.red('commend not found: ') + cmd);
    //     process.stdout.write(prompt);
    // }
}
function done(output) {
    if (cmdGroups.length) {
        execute(cmdGroups.shift(), output)
    } else {
        process.stdout.write(output + prompt);
    }
}