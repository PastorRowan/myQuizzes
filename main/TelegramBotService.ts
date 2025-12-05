
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
    TelegramClient,
    Api
} from "telegram";
import { StringSession } from "telegram/sessions/index.js";

import {
    API_ID_NUM,
    API_HASH
} from "./bootstrapper.js";
import { Buffer } from "buffer"; // Node.js buffer module
import bigInt from "big-integer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSION_FILE_PATH = path.resolve(__dirname, "token.txt");

class TelegramService {
    private client: TelegramClient;
    private stringSession: StringSession;

    constructor() {
        this.stringSession = new StringSession("")
        this.client = new TelegramClient(
            this.stringSession,
            API_ID_NUM,
            API_HASH,
            { connectionRetries: 5 }
        );
    };

    public async login({
        botAuthToken,
        onFail = (error) => Promise.resolve(),
    }: {
        botAuthToken: string;
        onFail?: (error: any) => Promise<void>;
    }): Promise<void> {

        console.log("Logging in");
        const client = this.getClient();

        await client.start({
            botAuthToken: botAuthToken,
            onError: async (err: any) => {
                await onFail(err);
                return true;
            },
        });
    
        console.log("You should now be connected.");
    };

    // Creates the quiz based on the quiz json
    public async sendPoll({
        inviteLink,
        alertOnFail = (args: { message: string; }) => Promise.resolve(),
    }: {
        inviteLink: string;
        alertOnFail?: (args: { message: string; }) => Promise<void>;
    }) {

        // Create poll answers
        const question = new Api.TextWithEntities({
            text: "Are you a bomba pussy clat man?",
            entities: []
        });

        const answers = [
            new Api.PollAnswer({
                text: new Api.TextWithEntities({
                    text: "Option 1",
                    entities: []
                }),
                option: Buffer.from([0]),
            }),
            new Api.PollAnswer({
                text: new Api.TextWithEntities({
                    text: "Option 2",
                    entities: []
                }),
                option: Buffer.from([1]),
            }),
        ];

        // Create the poll object
        const poll = new Api.Poll({
            id: bigInt(Date.now()),
            closed: false,
            publicVoters: true,
            multipleChoice: true,
            quiz: true,
            question: question,
            answers: answers,
            closePeriod: 0,
            closeDate: 0,
        });

        // MessageMediaPoll wrapping the poll
        const inputMediaPoll = new Api.InputMediaPoll({
            poll: poll,
            correctAnswers: [
                Buffer.from([0])
            ],
        });

        const client = this.getClient();

        try {

            inviteLink
            // Insert invite link here: inviteLink
            // https://t.me/+EomMiwKObYo1NmM0

            const entity = await client.getEntity("https://t.me/+EomMiwKObYo1NmM0");

            if (!(entity instanceof Api.Channel)) {
                throw new Error("Provided invite link is not channel link");
            };

            const channel = entity as Api.Channel; // type-safe now

            if (!channel.adminRights) {
                throw new Error("Bot not participant or not admin");
            };

            // Send the poll as a message
            await client.invoke(
                new Api.messages.SendMedia({
                    peer: channel,
                    media: inputMediaPoll,
                    message: "", // optional text
                    randomId: bigInt(Date.now()), // unique random ID
                })
            );

        } catch (error: any) {
            switch (error.errorMessage) {

                // client.getEntity error messages
                case "Invite link is not channel link":
                    alertOnFail({
                        message: "Provided invite link is not a channel link",
                    });
                    break;
                case "Bot not participant or not admin":
                    alertOnFail({
                        message: "The bot is not a participant or an admin"
                    });
                    break;
                // client.invoke error messages (sending poll)
                case "PEER_FLOOD":
                    alertOnFail({
                        message: "Too many requests sent at once please slow down"
                    });
                    break;
                default:
                    console.error("An unexpected error occurred:", error);
                    break;
            };

            throw error;
        };

    };

    private getClient() {
        return this.client;
    };

    private async isAuthorised({ willThrow }: { willThrow: boolean }): Promise<boolean> {
        const client = this.getClient();

        // Check bot identity
        const isBot = await client.isBot();
        if (!isBot) {
            const msg = "Client is not logged in or is not a bot";
            if (willThrow) throw new Error(msg);
            console.error(msg);
            return false;
        };

        return true;
    };

    // Work in progress
    private loadBotToken(): string {
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

export const telegramBotService = new TelegramService();
