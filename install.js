const fs = require("fs");
const {execSync} = require("child_process");

exports.functions = [
    "install",
    "uninstall"
];

exports.install = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.args;
    const {writeError, writeLog} = module;

    if (fs.existsSync(module.path + "\\" + args[0]) && fs.statSync(module.path + "\\" + args[0]).isFile()) {
        writeLog("Try to install the file \"" + args[0] + "\"");
        try {
            execSync("Installer.exe " +module.path + "\\" + args[0] + " "+ module.module);
            writeLog("Installation was successful");
        } catch (err) {
            writeError(err);
            writeError("Installation was not successful");
        }
    }
}

exports.uninstall = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.args;
    let name = [];
    let entries = fs.readdirSync(module.module);
    const {writeLog,writeError} = module;

    for (let i = 0; i < entries.length; i++) {
        let path = module.module;
        if (fs.statSync(path + "\\" + entries[i]).isDirectory()) {
            path += "\\" + entries[i];
            let thisModuleRoot = path;
            if (fs.existsSync(path + "\\module.json") && fs.statSync(path + "\\module.json")) {
                let moduleJSON = fs.readFileSync(path + "\\module.json","utf8");
                moduleJSON = JSON.parse(moduleJSON);

                name.push({
                    path: thisModuleRoot,
                    name: moduleJSON.name
                });
            }
        }
    }

    for (let i = 0; i < name.length; i++) {
        if (name[i].name === args[0]) {
            try {
                writeLog("Try to uninstall the module \"" + name[i].name + "\"");
                console.log("Uninstall.exe " + name[i].path);
                execSync("Uninstall.exe " + name[i].path);
                writeLog("Uninstallation was successful");
            } catch (err) {
                writeError(err);
                writeError("Uninstallation was not successful");
            }
        }
    }
}
