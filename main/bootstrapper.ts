
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config({
    path: path.resolve(__dirname, "..", ".env")
});

const API_ID_STR: string = process.env.API_ID || "";
const API_ID_NUM: number = Number(API_ID_STR);
const API_HASH: string = process.env.API_HASH || "";

if (API_ID_STR === "") {
    throw new Error("Error: API_ID is undefined");
};

if (Number.isNaN(API_ID_NUM) || API_ID_NUM < 0) {
    throw new Error("Error: API_ID_NUM is incorrect");
};

if (API_HASH === "") {
    throw new Error("Error: API_HASH is undefined");
};

const setup = true;

export {
    setup,
    API_ID_STR,
    API_ID_NUM,
    API_HASH,
};
