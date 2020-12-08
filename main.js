const {autoUpdater} = require("electron-updater");
const {app, BrowserWindow, ipcMain} = require("electron");
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

    WIN.setMenu(null);
    WIN.webContents.openDevTools();
    WIN.loadFile("index.html").then(() => {
        init();
    });

    WIN.on("closed", () => {
        app.quit();
    });

    cMain.on("log", (args) => {
        WIN.webContents.send("log", args);
    });

    cMain.on("error", (args) => {
        WIN.webContents.send("error", args);
    });

    cMain.on("info", (args) => {
       WIN.webContents.send("info", args);
    });

    cMain.on("list-error",(args) => {
        WIN.webContents.send("list-error", args);
    });

    cMain.on("list-log",(args) => {
        WIN.webContents.send("list-log", args);
    });

    cMain.on("list-info",(args) => {
        WIN.webContents.send("list-info", args);
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


