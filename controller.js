const {ipcMain} = require("electron");
const {loadModules} = require("./moduleHandler.js");
exports.init = function () {

}

ipcMain.on("runCMD", () => {
    loadModules();
});
