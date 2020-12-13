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

    let temp = [];
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

    temp.push([
            {
                label: "<hr>",
                colspan: 2
            }
        ]
    )
    temp.push([
        {
            label: "Base Modules",
            colspan: 2
        }
    ]);

    temp.push([
        {
            label: "Functions",
            colspan: 2
        }
    ]);

    let functions = "-&nbsp;" + data.baseModule[0].functions[0];

    for (let i = 1; i < data.baseModule[0].functions.length; i++) {
        functions += "<br>-&nbsp;" + data.baseModule[0].functions[i];
    }

    for (let i = 1; i < data.baseModule.length; i++) {
        for (let k = 0; k < data.baseModule[i].functions.length; k++) {
            functions += "<br>-&nbsp;" + data.baseModule[i].functions[k];
        }
    }

    temp.push([
        {
            label: functions,
            colspan: 2
        }
    ]);

    return Table.BuildFromTemplate(temp);
}
