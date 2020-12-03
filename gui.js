let input = [""];
let step = 0;

function filter(text) {
    let HTML = ["<br>","</br>","<br />","<p>","</p>","<a>","</a>","<div>","</div>"];

    for (let i = 0; i < HTML.length; i++) {
        let doWhile = true;
        while (doWhile) {
            text = text.replace(HTML[i],"");
            doWhile = (text.search(HTML[i]) !== -1);
        }
    }
    return text;
}

window.addEventListener("load",() => {
    document.getElementById("input").addEventListener("keyup", (e) => {
        if (e.keyCode === 13) { // 13 === (ENTER)
            let text = filter(document.getElementById("input").innerHTML);
            let newInput = [""];
            step = 0;
            newInput.push(text);
            for (let i = 1; i < input.length; i++) {
                newInput.push(input[i]);
            }
            input = newInput;
            let backInfo = ipcRenderer.sendSync("runCMD", text);
            write(backInfo.path + "&nbsp;" + text, "default");
            document.getElementById("input").innerHTML = "";
            document.getElementById("path").innerHTML = backInfo.path;
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

    window.addEventListener("dblclick",() => {
        document.getElementById("input").focus();
    });
});
