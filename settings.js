exports.functions = [
    "data"
];

exports.data = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.args;

    if (args[0] === "module") {
        getModuleData();
    }
}

function getModuleData() {

}
