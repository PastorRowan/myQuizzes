
import { ipcMain, BrowserWindow } from "electron";

export type PromptUserResponse = {
    id: number;
    answer: string;
};

export async function promptUser(message: string, win: BrowserWindow): Promise<string> {
    return new Promise((resolve) => {
        const id = Date.now();

        function handler(event: Electron.IpcMainEvent, response: PromptUserResponse) {
            if (response.id === id) {
                ipcMain.removeListener("prompt-answer", handler);
                resolve(response.answer);
            };
        };

        ipcMain.on("prompt-answer", handler);
            win.webContents.send("prompt-show", { id, message });
    });
};
