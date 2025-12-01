
import fs from "fs";
import path from "path";
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

const SESSION_FILE_PATH = path.resolve(__dirname, "session.txt");

class TelegramService {
    private client: TelegramClient;
    private stringSession: StringSession;
    private isConnected: boolean = false;

    constructor() {
        this.stringSession = new StringSession("");
        this.client = new TelegramClient(
            this.stringSession,
            API_ID_NUM,
            API_HASH,
            {
                connectionRetries: 5,
            },
        );
    };
    public async login({
        win,
        promptUser,
    }: {
        win: BrowserWindow;
        promptUser: (args: { message: string; win: BrowserWindow }) => Promise<string>;
    }): Promise<void> {
        const client = this.client;
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
    };

    private loadSession(): string {
        try {
            if (fs.existsSync(SESSION_FILE_PATH)) {
                const session = fs.readFileSync(SESSION_FILE_PATH, "utf-8");
                console.log("Loaded saved session");
                return session;
            };
        } catch (err) {
            console.warn("Failed to load session:", err);
        };
        return "";
    };

};
