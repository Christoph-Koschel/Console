const {ipcMain} = require("electron");
const {loadModules, run} = require("./moduleHandler.js");
const {getCurrentPath} = require("./path.js");
exports.init = function () {
    loadModules();
}

ipcMain.on("runCMD", (event, args) => {
    const command = args.substring(0,args.indexOf("("));
    let parameters = args.substring(args.indexOf("(") +1,args.lastIndexOf(")"));
    parameters = parameters.split(",");
    console.log(command, parameters);

    //run();

    event.returnValue = getCurrentPath();
});
