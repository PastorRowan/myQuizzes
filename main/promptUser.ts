
import { ipcMain, BrowserWindow } from "electron";

export type PromptUserResponse = {
    id: number;
    answer: string;
};

export async function promptUser({
    message,
    win,
    stopOnFail = false,
    onResponse = (args) => Promise.resolve(),
    onFail = (args) => Promise.resolve(),
    validate = (answer: string) => true,
}: {
    message: string;
    win: BrowserWindow;
    stopOnFail?: boolean;
    onResponse?: (args: { answer: string; }) => Promise<void>;
    onFail?: (args: { error: any; answer: string; }) => Promise<void>;
    validate?: (answer: string) => boolean;
}): Promise<string> {
    return new Promise((resolve) => {
        const id = Date.now();

        console.log("message: ", message);

        async function handler(event: Electron.IpcMainEvent, response: PromptUserResponse) {
            const {
                id: responseId,
                answer
            } = response;
            try {
                if (responseId === id && validate(answer)) {
                    await onResponse({
                        answer,
                    });
                    ipcMain.removeListener("prompt-answer", handler);
                    // Unshows the prompt component
                    win.webContents.send("prompt-hide");
                    console.log("answer: ", answer);
                    console.log("typeof answer: ", typeof answer);
                    resolve(answer);
                };
            } catch (error: any) {
                if (stopOnFail) {
                    ipcMain.removeListener("prompt-answer", handler);
                };
                await onFail({
                    error: error,
                    answer: answer,
                });
            };
        };

        ipcMain.on("prompt-answer", handler);
        win.webContents.send("prompt-show", { id, message });

    });
};
