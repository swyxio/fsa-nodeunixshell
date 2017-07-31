var fs = require('fs');
var path = require('path');
var req = require('request');

var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file))
        else results.push(file)
    })
    return results
}

module.exports = {
    find: function(stdin, args, done) {
        var results = [];
        var dir = args[1];
        if (dir == '.') {
            done(walk(dir).join('\n'));
        } else {
            done(walk('.').filter(x => x == './' + dir).join('\n'))
        }
    },
    pwd: function (stdin, args, done) {
        // process.stdout.write(process.cwd());
        // process.stdout.write('\nprompt > ');
        done(process.cwd());
    },
    date: function (stdin, args, done) {
        // process.stdout.write(new Date().toString());
        // process.stdout.write('\nprompt > ');
        done(new Date().toString());
    },
    echo: function(stdin, args, done) {
        // console.log(stdin, args);
        if (stdin, args[1][0] == "$") {
            var string = process.env[args[1].slice(1)]
        } else {
            var string = args.slice(1).join(' ')
        }
        // process.stdout.write(string)
        // process.stdout.write('\nprompt > ');
        done(string);
    },
    cat: function(stdin, args, done) {
        let str = [];
        args.slice(1).forEach((arg, i) => {
            var cbfunc = function(data) {
                str.push(data);
                // process.stdout.write(str.join('\n'))
                // if (i == args.length - 1) process.stdout.write('\nprompt > ')
                done(str.join('\n'));
            };
            fs.readFile(arg, function read(err,data, str) {
                if (err) throw err
                cbfunc(data)
            })
        })
    },
    head: function(stdin, args, done, cmdList) {
        let str = [];
        var counter = 0;
        if (args.length == 1 && stdin){
            args.push(stdin);
        }
        args.slice(1).forEach((arg, i) => {
            var cbfunc = function(data) {
                str.push(data.toString().split('\n').slice(0, 5).join('\n'));
                str = str.join('\n')
                done(cmdList, str);
                // if (cmdList.length <= 1) {
                //     done(cmdList, str);
                // } else {
                //     return str
                // }
            };
            fs.readFile(arg, function read(err,data, str) {
                if (err) {console.log('Invalid file');
                    process.stdout.write('\nprompt > ')
                    return;
                }
                cbfunc(data);
            })
        })
    },
    tail: function(stdin, args, done) {
        let str = [];
        var counter = 0;
        args.slice(1).forEach((arg, i) => {
            var cbfunc = function(data) {
               
                str.push(data.toString().split('\n').slice(-5).join('\n'));
                 str = str.join('\n')
                    // process.stdout.write(str.split('\n').slice(5).join('\n'))
                    done(str);
                    // process.stdout.write(str)
                    // process.stdout.write('\nprompt > ')
            };
            fs.readFile(arg, function read(err,data, str) {
                if (err) {console.log('Invalid file');
                    process.stdout.write('\nprompt > ')
                    return;
                }
                cbfunc(data);
            })
        })
    },
    sort: function(stdin, args, done) {
        let str = [];
        args.slice(1).forEach((arg, i) => {
            var cbfunc = function(data) {
                str.push(data.toString().split('\n').sort().join('\n'));
                // process.stdout.write(str.join('\n'))
                // if (i == args.length - 1) process.stdout.write('\nprompt > ')
                done(str.join('\n'));
            };
            fs.readFile(arg, function read(err,data, str) {
                if (err) throw err
                cbfunc(data)
            })
        })
    },
    wc: function(stdin, args, done, cmdList) {
        let str = [];
        if (args.length == 1 && stdin){
            args.push(stdin);
        }
        console.log('wc args', args)
        console.log('wc stdin', stdin)
        args.slice(1).forEach((arg, i) => {
            var cbfunc = function(data) {
                str.push(data.toString().split('\n').length);
                done(cmdList, str.toString());
                // process.stdout.write(str.toString());
                // process.stdout.write('\nprompt > ');
            };
            fs.readFile(arg, function read(err,data, str) {
                if (err) throw err
                cbfunc(data)
            })
        })
    },
    uniq: function(stdin, args, done) {
        let str = [];
        args.slice(1).forEach((arg, i) => {
            var cbfunc = function(data) {
                str.push(data.toString().split('\n').reduce(function(acc, v){
                    console.log(acc);
                    if (acc.split('\n').slice(-1)[0] === v){
                        return acc;
                    } else {
                        return acc + '\n' + v;
                    }
                }), '')//.join('\n');
                done(str.toString())
                // process.stdout.write(str.toString());
                // process.stdout.write('\nprompt > ');
            };
            fs.readFile(arg, function read(err,data, str) {
                if (err) throw err
                cbfunc(data)
            })
        })
    },
    ls: function (stdin, args, done) {
        fs.readdir('.', function(err, files) {
        if (err) throw err;
        var str = '';
        files.forEach(function(file) {
            str += file.toString() + "\n";
        })
        done(str);
        // process.stdout.write("\nprompt > ");
        });
    },
    curl: function(stdin, args, done){
        req({followRedirect: false,url:args[1]}, function(status, statusCode, body){
            done(body);
            //  process.stdout.write(body);
            // process.stdout.write("\nprompt > ");
        });
    }
}
