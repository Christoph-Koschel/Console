const {ipcMain} = require("electron");
const {loadModules, run} = require("./moduleHandler.js");

exports.init = function () {
    loadModules();
    let cMain = require("@christoph-koschel/console-module").main;
    cMain.variables.path = process.cwd();
}

ipcMain.on("runCMD", (event, args) => {
    const command = args.substring(0, args.indexOf("("));
    let parameters = args.substring(args.indexOf("(") + 1, args.lastIndexOf(")"));
    parameters = parameters.split(",");
    run(command, parameters);
});

ipcMain.on("getPath", (event) => {
    event.returnValue = require("@christoph-koschel/console-module").main.variables.path;
});
