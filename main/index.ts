
import {
    app,
    BrowserWindow,
    ipcMain
} from "electron";
import path from "path";
import { fileURLToPath } from "url";
import {
    startLogin
} from "./startLogin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

app.whenReady()
    .then(main);

function main() {

    const window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    window.loadFile(path.join(__dirname, "../public/index.html"));

    window.on("ready-to-show", window.show);

    if (isDev) {
        window.webContents.openDevTools();
    };

    startLogin(window);

};
