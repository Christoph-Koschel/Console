const fs = require("fs");
const path = require("path");
let modules = [];
const settings = {
    module: {
        path: __dirname + "/module"
    }
};

exports.loadModules = () => {
    let entries = fs.readdirSync(settings.module.path);

    modules = [];

    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        if (fs.statSync(settings.module.path + "/" + entry).isDirectory()) {
            if (fs.existsSync(settings.module.path + "/" + entry + "/module.json")) {
                let module = fs.readFileSync(settings.module.path + "/" + entry + "/module.json", "utf8");
                module = JSON.parse(module);
                modules.push({
                    src: require(settings.module.path + "/" + entry + "/" + module.main),
                    functions: module.functions
                });
            }
        }
    }
    console.log(modules);
}


exports.run = function () {

}

