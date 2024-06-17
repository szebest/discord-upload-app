var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
const __dirname = path.resolve();
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/./.env" });
import express from "express";
import bodyParser from "body-parser";
import { AttachmentBuilder, Client, GatewayIntentBits, TextChannel, } from "discord.js";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import stream from "stream";
import cors from "cors";
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
client.login(process.env.DISCORD_TOKEN);
const prisma = new PrismaClient();
prisma.$connect();
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type"],
    exposedHeaders: ["Content-Disposition", "Content-Length"],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
function splitBuffer(buffer, maxSize) {
    let buffers = [];
    let start = 0;
    while (start < buffer.length) {
        let end = Math.min(start + maxSize, buffer.length);
        buffers.push(buffer.slice(start, end));
        start = end;
    }
    return buffers;
}
app.post("/upload", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.sendStatus(400);
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel || !(channel instanceof TextChannel))
        return res.sendStatus(500);
    const MAX_SIZE = 25 * 1024 * 1024; // 25 MB in bytes
    const buffers = splitBuffer(req.file.buffer, MAX_SIZE);
    try {
        const promises = [];
        let index = 1;
        const filename = req.file.originalname.split(".").slice(0, -1).join("");
        const extension = req.file.originalname.split(".").at(-1);
        for (const buffer of buffers) {
            const promise = new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const message = yield channel.send({
                    files: [
                        new AttachmentBuilder(buffer, {
                            name: `${filename}.part${index++}.${extension}`,
                        }),
                    ],
                });
                resolve({ message, size: Buffer.byteLength(buffer) });
            }));
            promises.push(promise);
        }
        const messages = yield Promise.all(promises);
        const result = yield prisma.file.create({
            data: {
                name: req.file.originalname,
                fileChunks: {
                    createMany: {
                        data: messages.map(({ message, size }) => ({
                            messageId: message.id,
                            size,
                        })),
                    },
                },
            },
            include: {
                fileChunks: true,
            },
        });
        const mappedResult = Object.assign(Object.assign({}, result), { totalSize: result.fileChunks.reduce((acc, curr) => acc + curr.size, 0) });
        return res.status(200).send(mappedResult);
    }
    catch (e) {
        return res.status(500).send(e);
    }
}));
app.get("/download/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const channel = client.channels.cache.get(process.env.CHANNEL_ID);
        if (!channel || !(channel instanceof TextChannel))
            return res.sendStatus(500);
        const result = yield prisma.file.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                fileChunks: true,
            },
        });
        if (!result)
            return res.sendStatus(404);
        const promises = [];
        for (const chunk of result.fileChunks) {
            const promise = new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                yield channel.messages.fetch({
                    id: chunk.messageId,
                    message: "",
                });
                const message = channel.messages.cache.get(chunk.messageId);
                const url = (_a = message === null || message === void 0 ? void 0 : message.attachments.at(0)) === null || _a === void 0 ? void 0 : _a.url;
                const response = yield axios({
                    url,
                    method: "GET",
                    responseType: "arraybuffer",
                });
                resolve(response.data);
            }));
            promises.push(promise);
        }
        const files = yield Promise.all(promises);
        const file = Buffer.concat(files);
        const readStream = new stream.PassThrough();
        readStream.end(file);
        res.set("Content-Disposition", result.name);
        res.set("Content-Length", Buffer.byteLength(file).toString());
        return readStream.pipe(res);
    }
    catch (e) {
        return res.status(500).send(e);
    }
}));
app.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma.file.findMany({
            include: {
                fileChunks: true,
            },
        });
        const mappedResult = result.map((x) => (Object.assign(Object.assign({}, x), { totalSize: x.fileChunks.reduce((acc, curr) => acc + curr.size, 0) })));
        return res.status(200).send(mappedResult);
    }
    catch (e) {
        return res.status(500).send(e);
    }
}));
app.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const channel = client.channels.cache.get(process.env.CHANNEL_ID);
        if (!channel || !(channel instanceof TextChannel))
            return res.sendStatus(500);
        const result = yield prisma.file.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                fileChunks: true,
            },
        });
        if (!result)
            return res.sendStatus(404);
        const promises = [];
        for (const chunk of result.fileChunks) {
            const promise = new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                yield channel.messages.fetch({
                    id: chunk.messageId,
                    message: "",
                });
                const message = channel.messages.cache.get(chunk.messageId);
                message === null || message === void 0 ? void 0 : message.delete();
                resolve(message);
            }));
            promises.push(promise);
        }
        yield Promise.all(promises);
        yield prisma.file.delete({
            where: {
                id: Number(id),
            },
        });
        return res.status(200).send(result);
    }
    catch (e) {
        return res.status(500).send(e);
    }
}));
try {
    app.listen(PORT, () => {
        console.log(`Connected successfully on port ${PORT}`);
    });
}
catch (error) {
    console.error(`Error occurred: ${error.message}`);
}
