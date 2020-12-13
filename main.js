const {autoUpdater} = require("electron-updater");
const {app, BrowserWindow, ipcMain, Menu} = require("electron");
const {init} = require("./controller");
const cMain = require("@christoph-koschel/console-module").main;

app.on("ready", () => {
    let WIN = new BrowserWindow({
        width: 950,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            spellcheck: false
        }
    });

    WIN.webContents.on("update-target-url",(event) => {
        let url = WIN.webContents.getURL();
        if (url !== "file:///" + (__dirname.replace(/\\/gi,"/")) + "/index.html") {
            WIN.loadFile("index.html");
        }
    });

    WIN.on("closed", () => {
        app.quit();
    });

    WIN.setMenu(null);
    WIN.webContents.openDevTools();
    WIN.loadFile("index.html").then(() => {
        init();
    });

    cMain.On("log", (args) => {
        WIN.webContents.send("log", args);
    });

    cMain.On("error", (args) => {
        WIN.webContents.send("error", args);
    });

    cMain.On("info", (args) => {
        WIN.webContents.send("info", args);
    });

    /*
    * ===================================
    * == App Updater
    * ===================================
    */
    //region

    WIN.once("ready-to-show", () => {
        autoUpdater.checkForUpdatesAndNotify();
    });

    autoUpdater.on('update-available', () => {
        WIN.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', () => {
        WIN.webContents.send('update_downloaded');
    });

    ipcMain.on("appVersion", (event) => {
        event.sender.send("appVersion", app.getVersion());
    });

    ipcMain.on('restart_app', () => {
        autoUpdater.quitAndInstall();
    });

    //endregion

});


