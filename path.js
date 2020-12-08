const fs = require("fs");
const path = require("path");
exports.functions = [
    "cd",
    "scan"
];

exports.cd = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.args;
    let currentPath = module.path;


    let to = args[0];
    if (to === "..") {
        if (currentPath.search("\\\\") === -1) {
            module.writeError("\"" + currentPath + "\" is the root directory and there's no parent directory");
            return;
        } else {
            currentPath = currentPath.substring(0, currentPath.lastIndexOf('\\'));
        }
    } else if (fs.existsSync(currentPath + "\\" + to) && fs.statSync(currentPath + "\\" + to).isDirectory()) {
        to = (to[to.length - 1] === "\\" || to[to.length - 1] === "/") ? to.replace([/\\$/, /\/$/], "") : to;
        to = to.replace(/\//gi, "\\");
        currentPath = currentPath + "\\" + to;
    } else if (fs.existsSync(to) && fs.statSync(to).isDirectory()) {
        to = to.replace(/\//gi, "\\");
        to = (to[to.length - 1] === "\\") ? to.replace(/\\$/, "") : to;
        currentPath = to;
    } else {
        module.writeError("The Directory \"" + to + "\" is not exist");
        return;
    }

    require("@christoph-koschel/console-module").main.path = currentPath;
}

exports.scan = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.args;
    let currentPath = module.path;

    if (args[0] === "") {

        let list = module.list.create();
        let entries = fs.readdirSync(currentPath);

        for (let i = 0; i < entries.length; i++) {
            if (fs.statSync(currentPath + "\\" + entries[i]).isDirectory()) {
                list.AddListItem(entries[i]);
            }
        }

        list.WriteList("info");
    } else {
        module.writeError("No function \"scan\" has the number of supported parameters")
    }
}
