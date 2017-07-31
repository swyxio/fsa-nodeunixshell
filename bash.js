var methods = require('./commands.js')

var done = function(cmdList, output){
    if (!output) {return x => done(cmdList, x)}
    if (cmdList.length == 1){
        process.stdout.write(output);
        process.stdout.write('\nprompt > ');
    } else {
        return output;
    }

};
//comment 1
//comment 1
//comment 1
// Output a prompt
process.stdout.write('prompt > ');

// The stdin 'data' event fires after a user types in a line
process.stdin.on('data', function (data) {
//   var cmd = data.toString().trim().split(' ');
  var cmdString = data.toString().trim();
  var cmdList = cmdString.split(/\s*\|\s*/g) // any amount of whitespace, pipe, any amount of whitespace // remove the newline
  var stdin;
  while (cmdList.length > 0){
    cmd = cmdList.shift();
    console.log(cmd)
    var fnc = methods[cmd.split(' ')[0]]
    if (fnc) {
        stdin = fnc(stdin, cmd.split(' '), done(cmdList))
    } else {
        done(cmdList, 'You typed: ' + cmd);
    } 
  }
//   cmdList.forEach(function(cmd){
//   var fnc = methods[cmd.split(' ')[0]]
//   if (fnc) {
//     stdin = fnc(stdin, cmd.split(' '), done)
//   } else {
//     done('You typed: ' + cmd.join(' '));
// //   }
//   });
//   var fnc = methods[cmd[0]]
//   if (fnc) {
//     fnc(cmd, done)
//   } else {
//     done('You typed: ' + cmd.join(' '));
//   }
});