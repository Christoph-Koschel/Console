const fs = require("fs");
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
        },
        {
            src: require("./install.js"),
            functions: require("./install.js").functions
        }
    ]
};

cMain.module = settings.module.path;
exports.loadModules = () => {
    const {writeInfo, writeError} = require("@christoph-koschel/console-module").module;
    let entries = fs.readdirSync(settings.module.path);

    modules = [];
    let loaded = 0
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        writeInfo("Try to load module \"~\\module\\" + entry + "\"");
        if (fs.statSync(settings.module.path + "/" + entry).isDirectory()) {
            if (fs.existsSync(settings.module.path + "/" + entry + "/module.json")) {
                let module = fs.readFileSync(settings.module.path + "/" + entry + "/module.json", "utf8");
                try {
                    module = JSON.parse(module);
                } catch {
                    writeError("Fatal error in module.json")
                    continue;
                }

                let next = true;

                if (module.functions === undefined) {
                    writeError("In module.json functions array is missing");
                    next = false;
                }
                if (module.name === undefined) {
                    writeError("In module.json name is missing");
                    next = false;
                }

                if (module.main === undefined) {
                    writeError("In module.json main is missing");
                    next = false;
                }

                if (!next) {
                    continue;
                }

                modules.push({
                    name: module.name,
                    src: require(settings.module.path + "/" + entry + "/" + module.main),
                    functions: module.functions
                });
                loaded++;
            } else {
                writeError("module.json is missing");
            }
        } else {
            writeError("Module-root is not a Directory");
        }
    }
    writeInfo("Successfully loaded " + loaded.toString() + " of " + entries.length.toString() + " modules");
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
