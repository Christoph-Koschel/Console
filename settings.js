exports.functions = [
    "data"
];

exports.data = function () {
    let module = require("@christoph-koschel/console-module").module;
    let args = module.variables.args;

    if (args[0] === "module") {
        let table = getModuleData();
        module.Write("table", "info", table);
    }
}

function getModuleData() {
    let data = require("./moduleHandler.js").getData();
    const {Table} = require("@christoph-koschel/console-module").module;

    let temp = []
    temp.push([
        {
            label: "Modules",
            colspan: 2
        }
    ]);
    temp.push([
        {
            label: "Path"
        },
        {
            label: "Functions"
        }
    ]);
    for (let i = 0; i < data.module.length; i++) {
        let module = data.module[i];
        let functions = "-&nbsp;" + module.functions[0];

        for (let k = 1; k < module.functions.length; k++) {
            functions += "<br>-&nbsp;" + module.functions[k];
        }

        temp.push([
            {
                label: "~\\module\\(" + module.name + ")"
            },
            {
                label: functions
            }
        ]);
    }

    return Table.BuildFromTemplate(temp);
}
