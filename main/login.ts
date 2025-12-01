
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { BrowserWindow } from "electron";
import { promptUser } from "./promptUser.js";

import {
    API_ID_NUM,
    API_HASH
} from "./bootstrapper.js";

console.log("API_ID_NUM: ", API_ID_NUM);
console.log("API_HASH: ", API_HASH);

const stringSession = new StringSession(""); // fill this later with the value from session.save()

export async function login(win: BrowserWindow) {

    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, API_ID_NUM, API_HASH, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () => await promptUser({
            message: "Enter phone number international format e.g +271234567",
            win,
        }),
        phoneCode: async () => await promptUser({
            message: "Enter phone code",
            win,
        }),
        password: async () => await promptUser({
            message: "Enter 2fa password",
            win,
        }),
        onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again
    await client.sendMessage("me", { message: "Hello!" });

    return {
        client,
    };

};
