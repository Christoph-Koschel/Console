exports.functions = [
    "clear",
    "print"
];

exports.clear = function () {
    const {view} = require("@christoph-koschel/console-module").module;
    view.Send("clear");
}

exports.print = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.variables.args;

    for (let i = 0; i < args.length; i++) {
        module.Write("text", "info", args[i]);
    }
}
