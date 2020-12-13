const {ipcRenderer} = require("electron");
const fs = require("fs");
const fontPath = __dirname + "\\font.json";
let input = [""];
let step = 0;

function filter(text) {
    let HTML = ["<br>", "</br>", "<br />", "<p>", "</p>", "<a>", "</a>", "<div>", "</div>"];

    for (let i = 0; i < HTML.length; i++) {
        let doWhile = true;
        while (doWhile) {
            text = text.replace(HTML[i], "");
            doWhile = (text.search(HTML[i]) !== -1);
        }
    }
    return text;
}

function write(value, flag) {
    let output = document.getElementById("output");

    let doScroll = false;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        doScroll = true;
    }

    output.innerHTML += `<div class=\"type-${flag}\"><a>${value}</a></div>`;

    if (doScroll === true) {
        window.scrollTo({
            top: window.innerHeight + window.scrollY,
            behavior: "auto"
        });
    }
}

function writeList(value, flag) {
    let list = "<ul>";

    for (let i = 0; i < value.length; i++) {
        list += `<li>${value[i]}</li>`;
    }

    list += "</ul>";

    write(list, flag);
}

window.addEventListener("load", () => {
    if (fs.existsSync(fontPath) && fs.statSync(fontPath).isFile()) {
        let font = fs.readFileSync(fontPath, "utf8");
        font = JSON.parse(font);
        console.log(font)
        let style = `<style>.type-error { color: ${font.error};} .type-info {color: ${font.info};}</style>`;
        document.head.innerHTML += style;
    }


    document.getElementById("input").addEventListener("keyup", (e) => {
        if (e.keyCode === 13) { // 13 === (ENTER)
            let text = filter(document.getElementById("input").innerHTML);
            document.getElementById("input").innerHTML = "";

            let newInput = [""];
            step = 0;
            newInput.push(text);
            for (let i = 1; i < input.length; i++) {
                newInput.push(input[i]);
            }
            input = newInput;

            write(ipcRenderer.sendSync("getPath") + "> " + text);
            ipcRenderer.send("runCMD", text);
            document.getElementById("path").innerHTML = ipcRenderer.sendSync("getPath") + ">";
        } else if (e.keyCode === 38) { // 83 (ARROW-UP)
            if (step !== input.length - 1) {
                step++;
                document.getElementById("input").innerHTML = input[step];
            }
        } else if (e.keyCode === 40) { // 40 (ARROW-DOWN)
            if (step !== 0) {
                step--;
                document.getElementById("input").innerHTML = input[step];
            }
        }
    });

    window.addEventListener("dblclick", () => {
        document.getElementById("input").focus();
    });

    setTimeout(() => {
        document.getElementById("path").innerHTML = ipcRenderer.sendSync("getPath") + ">";
    }, 20);

    ipcRenderer.on("error", (event, args) => {
        write(args, "error");
    });

    ipcRenderer.on("log", (event, args) => {
        write(args, "log");
    });

    ipcRenderer.on("info", (event, args) => {
        write(args, "info");
    });

    ipcRenderer.on("clear", () => {
        document.getElementById("output").innerHTML = "";
        write("Console cleared", "info");
    });
});
