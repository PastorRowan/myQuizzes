
import {
    ipcMain,
    IpcMainEvent,
    dialog,
    BrowserWindow
} from "electron";

import {
    telegramBotService
} from "./TelegramBotService.js";

export function setupIpc(window: BrowserWindow) {
    ipcMain.on("send-questions", async function(e: IpcMainEvent, {
        questions,
        channelId
    }: {
        questions: Question[];
        channelId: string;
    }) {
        await telegramBotService.sendQuestions({
            questions: questions,
            channelId,
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
    });
};
