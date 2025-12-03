
import {
    setup
} from "./bootstrapper.js";
setup;
import path from "path";
import { fileURLToPath } from "url";

import {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} from "electron";
import {
    telegramBotService
} from "./TelegramBotService.js";
import { promptUser } from "./promptUser.js";

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

    console.log("Logging in index");

    // Wait for the renderer process to finish loading before calling login
    window.webContents.once("did-finish-load", async () => {
        console.log("Renderer finished loading — starting login now");

        await promptUser({
            message: "Enter bot token",
            win: window,
            stopOnFail: false,
            onResponse: async ({
                answer
            }) => {
                await telegramBotService.login({
                    botAuthToken: answer,
                    onFail: async (error) => {
                        const errorMsg =
                            error?.errorMessage ||
                            error?.message ||
                            "Could not get error message";
                        await dialog.showMessageBox(window, {
                            type: "info",
                            buttons: ["OK"],
                            title: "alert",
                            message: errorMsg,
                        });
                    },
                });
            },
        });

        console.log("Login finished");

    });

};
