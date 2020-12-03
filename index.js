const {autoUpdater} = require("electron-updater");
const {app, BrowserWindow, ipcMain} = require("electron");
const { init } = require("./controller.js");

app.on("ready", () => {

    let WIN = new BrowserWindow({
        width: 950,
        height: 400,
        webPreferences: {
            nodeIntegration: true
        }
    });

    WIN.setMenu(null);
    WIN.webContents.openDevTools();
    WIN.loadFile("index.html").then(() => {
        init(WIN);
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


