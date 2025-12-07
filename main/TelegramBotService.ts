
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
import {
    isChannelId,
    isQuestions
} from "../helpers/validators";

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
    public async sendQuestions({
        channelId,
        questions,
        onFail = (error) => {throw error},
    }: {
        questions: Question[];
        channelId: string;
        onFail?: (error: any) => Promise<void>;
    }): Promise<void> {

        console.log(
            "questions: ", questions,
            "channelId: ", channelId,
            "onFail: ", onFail
        );

        try {

            if (!isChannelId(channelId)) {
                throw new Error(`Invalid channel ID provided: "${channelId}". Please ensure it starts with "-100"`);
            };

            if (!isQuestions(questions)) {
                throw new Error(`Invalid questions array provided: ${questions}. Check the format and content of the questions.`);
            };

            const client = this.getClient();
            const entity = await client.getEntity(channelId);

            if (!(entity instanceof Api.Channel)) {
                throw new Error(`The provided channel ID does not correspond to a valid channel.`);
            };

            const channelEntity: Api.Channel = entity;

            if (!entity.adminRights) {
                throw new Error("Bot not participant or not admin of channel");
            };

            for (let i = 0; i < questions.length; i++) {
                const question: Question = questions[i];
                await this.sendQuestion({
                    question: question,
                    channelEntity: channelEntity,
                });
                 // 1-second delay before sending next question
                await new Promise(resolve => setTimeout(resolve, 1000));
            };
        } catch (error: any) {
            onFail(error);
        };
    
    };

    private getClient() {
        return this.client;
    };

    // Creates a quiz based on the question object
    private async sendQuestion({
        question,
        channelEntity,
        onFail = (error: any) => {throw error},
    }: {
        question: Question;
        channelEntity: Api.Channel;
        onFail?: (error: any) => Promise<void>;
    }): Promise<void> {

        console.log(
            "question: ", question,
            "onFail: ", onFail
        );

        // Create poll answers
        const apiQuestionText = new Api.TextWithEntities({
            text: question.query,
            entities: []
        });

        const options = question.options;
        const answers: Api.PollAnswer[] = [];

        for (let i = 0; i < options.length; i++) {
            const optionText = options[i];
            answers.push(
                new Api.PollAnswer({
                    text: new Api.TextWithEntities({
                        text: optionText,
                        entities: []
                    }),
                    option: Buffer.from([i]),
                })
            );
        };

        // Create the poll object
        const apiPoll = new Api.Poll({
            id: bigInt(Date.now()),
            closed: false,
            // Has to be false because its a channel
            publicVoters: false,
            // Has to be false because quizes cannot have multiple choice
            multipleChoice: false,
            quiz: true,
            question: apiQuestionText,
            answers: answers,
            closePeriod: 0,
            closeDate: 0,
        });

        const correctOption = question.correctOption;

        // MessageMediaPoll wrapping the poll
        const inputMediaPoll = new Api.InputMediaPoll({
            poll: apiPoll,
            correctAnswers: [
                Buffer.from([correctOption])
            ],
        });

        const client = this.getClient();

        try {

            // Send the poll as a message
            await client.invoke(
                new Api.messages.SendMedia({
                    peer: channelEntity,
                    media: inputMediaPoll,
                    message: "", // optional text
                    randomId: bigInt(Date.now()), // unique random ID
                })
            );

        } catch (error: any) {
            onFail(error);
        };

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
