exports.functions = [
    "clear"
];

exports.clear = function () {
    const {view} = require("@christoph-koschel/console-module").module;
    view.Send("clear");
}
