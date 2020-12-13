const fs = require("fs");
const {execSync} = require("child_process");

exports.functions = [
    "install",
    "uninstall"
];

exports.install = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.variables.args;

    if (fs.existsSync(module.variables.path + "\\" + args[0]) && fs.statSync(module.variables.path + "\\" + args[0]).isFile()) {
        module.Write("text", "info", "Try to install the file \"" + args[0] + "\"");
        try {
            execSync("Installer.exe " + module.variables.path + "\\" + args[0] + " " + module.variables.module);
            module.Write("text", "log", "Installation was successful");
        } catch (err) {
            module.Write("text", "error", err);
            module.Write("text", "error", "Installation was not successful");
        }
    }
}

exports.uninstall = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.variables.args;
    let name = [];
    let entries = fs.readdirSync(module.variables.module);

    for (let i = 0; i < entries.length; i++) {
        let path = module.variables.module;
        if (fs.statSync(path + "\\" + entries[i]).isDirectory()) {
            path += "\\" + entries[i];
            let thisModuleRoot = path;
            if (fs.existsSync(path + "\\module.json") && fs.statSync(path + "\\module.json")) {
                let moduleJSON = fs.readFileSync(path + "\\module.json", "utf8");
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
                module.Write("text", "log", "Try to uninstall the module \"" + name[i].name + "\"");
                console.log("Uninstall.exe " + name[i].path);
                execSync("Uninstall.exe " + name[i].path);
                module.Write("text", "log", "Uninstallation was successful");
            } catch (err) {
                module.Write("text", "error", err);
                module.Write("text", "error", "Uninstallation was not successful");
            }
        }
    }
}
