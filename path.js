const fs = require("fs");
const path = require("path");
let activePath = process.cwd();

exports.getCurrentPath = function () {
    return activePath;
}
