const fs = require("fs");
exports.functions = [
    "cd",
    "scan"
];

exports.cd = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.variables.args;
    let currentPath = module.variables.path;


    let to = args[0];
    if (to === "..") {
        if (currentPath.search("\\\\") === -1) {
            module.Write("text", "error", "\"" + currentPath + "\" is the root directory and there's no parent directory");
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
        module.Write("text", "error", "The Directory \"" + to + "\" is not exist");
        return;
    }

    require("@christoph-koschel/console-module").main.variables.path = currentPath;
}

exports.scan = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.variables.args;
    let currentPath = module.variables.path;

    if (args[0] === "") {
        let list = new module.List();
        let entries = fs.readdirSync(currentPath);

        for (let i = 0; i < entries.length; i++) {
            if (fs.statSync(currentPath + "\\" + entries[i]).isDirectory()) {
                list.AddListItem(entries[i]);
            }
        }

        module.Write("list", "info", list);
    } else {
        module.Write("text", "error", "No function \"scan\" has the number of supported parameters");
    }
}
