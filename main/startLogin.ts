
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { BrowserWindow } from "electron";
import { promptUser } from "./promptUser.js";

const apiId = 123456;
const apiHash = "123456abcdfg";

const stringSession = new StringSession(""); // fill this later with the value from session.save()

export async function startLogin(win: BrowserWindow) {

    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () => await promptUser("Enter phone number", win),
        phoneCode: async () => await promptUser("Enter phone code", win),
        password: async () => await promptUser("Enter 2fa password", win),
        onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again
    await client.sendMessage("me", { message: "Hello!" });

    return {
        client,
    };

};
