const fs = require("fs");
const path = require("path");
const cMain = require("@christoph-koschel/console-module").main;
let modules = [];
const settings = {
    module: {
        path: __dirname + "/module"
    },
    baseModule: [
        {
            src: require("./path.js"),
            functions: require("./path.js").functions
        }
    ]
};

exports.loadModules = () => {
    let entries = fs.readdirSync(settings.module.path);

    modules = [];
    let loaded = 0
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        if (fs.statSync(settings.module.path + "/" + entry).isDirectory()) {
            if (fs.existsSync(settings.module.path + "/" + entry + "/module.json")) {
                let module = fs.readFileSync(settings.module.path + "/" + entry + "/module.json", "utf8");
                module = JSON.parse(module);
                modules.push({
                    name: module.name,
                    src: require(settings.module.path + "/" + entry + "/" + module.main),
                    functions: module.functions
                });
                loaded++;
            }
        }
    }
    require("@christoph-koschel/console-module").module.writeInfo("Successfully loaded " + loaded.toString() + " of " + entries.length.toString() + " modules");
    console.log(modules);
}

function isBaseFunction(command) {
    for (let i = 0; i < settings.baseModule.length; i++) {
        if (settings.baseModule[i].functions.indexOf(command) !== -1) {
            return true;
        }
    }
    return false;
}

function isModuleFunction(command) {
    for (let i = 0; i < modules.length; i++) {
        if (modules[i].functions.indexOf(command) !== -1) {
            return true;
        }
    }

    return false;
}

exports.run = function (command, parameters) {
    if (isBaseFunction(command)) {
        cMain.args = parameters;
        for (let i = 0; i < settings.baseModule.length; i++) {
            if (settings.baseModule[i].functions.indexOf(command) !== -1) {
                settings.baseModule[i].src[command]();
            }
        }
    } else {
        if (isModuleFunction(command)) {
            cMain.args = parameters;

            for (let i = 0; i < modules.length; i++) {
                if (modules[i].functions.indexOf(command) !== -1) {
                    modules[i].src[command]();
                }
            }
        }
    }
}

