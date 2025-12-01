
import { ipcMain, BrowserWindow } from "electron";

export type PromptUserResponse = {
    id: number;
    answer: string;
};

export async function promptUser({
    message,
    win,
    validate = (answer: string) => true,
}: {
    message: string;
    win: BrowserWindow;
    validate?: (answer: string) => boolean;
}): Promise<string> {
    return new Promise((resolve) => {
        const id = Date.now();

        function handler(event: Electron.IpcMainEvent, response: PromptUserResponse) {
            const {
                id: responseId,
                answer
            } = response;
            if (responseId === id && validate(answer)) {
                ipcMain.removeListener("prompt-answer", handler);
                // Unshows the prompt component
                // win.webContents.send("prompt-show", { id, message });
                console.log("answer: ", answer);
                console.log("typeof answer: ", typeof answer);
                resolve(answer);
            };
        };

        ipcMain.on("prompt-answer", handler);
            win.webContents.send("prompt-show", { id, message });
    });
};
