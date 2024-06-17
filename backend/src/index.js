"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var __dirname = path_1.default.resolve();
var multer_1 = require("multer");
var storage = multer_1.default.memoryStorage();
var upload = (0, multer_1.default)({ storage: storage });
var dotenv_1 = require("dotenv");
dotenv_1.default.config({ path: __dirname + "/./.env" });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var discord_js_1 = require("discord.js");
var client_1 = require("@prisma/client");
var axios_1 = require("axios");
var stream_1 = require("stream");
var cors_1 = require("cors");
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
client.login(process.env.DISCORD_TOKEN);
var prisma = new client_1.PrismaClient();
prisma.$connect();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type"],
    exposedHeaders: ["Content-Disposition", "Content-Length"],
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
function splitBuffer(buffer, maxSize) {
    var buffers = [];
    var start = 0;
    while (start < buffer.length) {
        var end = Math.min(start + maxSize, buffer.length);
        buffers.push(buffer.slice(start, end));
        start = end;
    }
    return buffers;
}
app.post("/upload", upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, MAX_SIZE, buffers, promises, index_1, filename_1, extension_1, _loop_1, _i, buffers_1, buffer, messages, result, mappedResult, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.file)
                    return [2 /*return*/, res.sendStatus(400)];
                channel = client.channels.cache.get(process.env.CHANNEL_ID);
                if (!channel || !(channel instanceof discord_js_1.TextChannel))
                    return [2 /*return*/, res.sendStatus(500)];
                MAX_SIZE = 25 * 1024 * 1024;
                buffers = splitBuffer(req.file.buffer, MAX_SIZE);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                promises = [];
                index_1 = 1;
                filename_1 = req.file.originalname.split(".").slice(0, -1).join("");
                extension_1 = req.file.originalname.split(".").at(-1);
                _loop_1 = function (buffer) {
                    var promise = new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
                        var message;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, channel.send({
                                        files: [
                                            new discord_js_1.AttachmentBuilder(buffer, {
                                                name: "".concat(filename_1, ".part").concat(index_1++, ".").concat(extension_1),
                                            }),
                                        ],
                                    })];
                                case 1:
                                    message = _a.sent();
                                    resolve({ message: message, size: Buffer.byteLength(buffer) });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    promises.push(promise);
                };
                for (_i = 0, buffers_1 = buffers; _i < buffers_1.length; _i++) {
                    buffer = buffers_1[_i];
                    _loop_1(buffer);
                }
                return [4 /*yield*/, Promise.all(promises)];
            case 2:
                messages = _a.sent();
                return [4 /*yield*/, prisma.file.create({
                        data: {
                            name: req.file.originalname,
                            fileChunks: {
                                createMany: {
                                    data: messages.map(function (_a) {
                                        var message = _a.message, size = _a.size;
                                        return ({
                                            messageId: message.id,
                                            size: size,
                                        });
                                    }),
                                },
                            },
                        },
                        include: {
                            fileChunks: true,
                        },
                    })];
            case 3:
                result = _a.sent();
                mappedResult = __assign(__assign({}, result), { totalSize: result.fileChunks.reduce(function (acc, curr) { return acc + curr.size; }, 0) });
                return [2 /*return*/, res.status(200).send(mappedResult)];
            case 4:
                e_1 = _a.sent();
                return [2 /*return*/, res.status(500).send(e_1)];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get("/download/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, channel_1, result, promises, _loop_2, _i, _a, chunk, files, file, readStream, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                channel_1 = client.channels.cache.get(process.env.CHANNEL_ID);
                if (!channel_1 || !(channel_1 instanceof discord_js_1.TextChannel))
                    return [2 /*return*/, res.sendStatus(500)];
                return [4 /*yield*/, prisma.file.findUnique({
                        where: {
                            id: Number(id),
                        },
                        include: {
                            fileChunks: true,
                        },
                    })];
            case 2:
                result = _b.sent();
                if (!result)
                    return [2 /*return*/, res.sendStatus(404)];
                promises = [];
                _loop_2 = function (chunk) {
                    var promise = new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
                        var message, url, response;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, channel_1.messages.fetch({
                                        id: chunk.messageId,
                                        message: "",
                                    })];
                                case 1:
                                    _b.sent();
                                    message = channel_1.messages.cache.get(chunk.messageId);
                                    url = (_a = message === null || message === void 0 ? void 0 : message.attachments.at(0)) === null || _a === void 0 ? void 0 : _a.url;
                                    return [4 /*yield*/, (0, axios_1.default)({
                                            url: url,
                                            method: "GET",
                                            responseType: "arraybuffer",
                                        })];
                                case 2:
                                    response = _b.sent();
                                    resolve(response.data);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    promises.push(promise);
                };
                for (_i = 0, _a = result.fileChunks; _i < _a.length; _i++) {
                    chunk = _a[_i];
                    _loop_2(chunk);
                }
                return [4 /*yield*/, Promise.all(promises)];
            case 3:
                files = _b.sent();
                file = Buffer.concat(files);
                readStream = new stream_1.default.PassThrough();
                readStream.end(file);
                res.set("Content-Disposition", result.name);
                res.set("Content-Length", Buffer.byteLength(file).toString());
                return [2 /*return*/, readStream.pipe(res)];
            case 4:
                e_2 = _b.sent();
                return [2 /*return*/, res.status(500).send(e_2)];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get("", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, mappedResult, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.file.findMany({
                        include: {
                            fileChunks: true,
                        },
                    })];
            case 1:
                result = _a.sent();
                mappedResult = result.map(function (x) { return (__assign(__assign({}, x), { totalSize: x.fileChunks.reduce(function (acc, curr) { return acc + curr.size; }, 0) })); });
                return [2 /*return*/, res.status(200).send(mappedResult)];
            case 2:
                e_3 = _a.sent();
                return [2 /*return*/, res.status(500).send(e_3)];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, channel_2, result, promises, _loop_3, _i, _a, chunk, e_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                channel_2 = client.channels.cache.get(process.env.CHANNEL_ID);
                if (!channel_2 || !(channel_2 instanceof discord_js_1.TextChannel))
                    return [2 /*return*/, res.sendStatus(500)];
                return [4 /*yield*/, prisma.file.findUnique({
                        where: {
                            id: Number(id),
                        },
                        include: {
                            fileChunks: true,
                        },
                    })];
            case 2:
                result = _b.sent();
                if (!result)
                    return [2 /*return*/, res.sendStatus(404)];
                promises = [];
                _loop_3 = function (chunk) {
                    var promise = new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
                        var message;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, channel_2.messages.fetch({
                                        id: chunk.messageId,
                                        message: "",
                                    })];
                                case 1:
                                    _a.sent();
                                    message = channel_2.messages.cache.get(chunk.messageId);
                                    message === null || message === void 0 ? void 0 : message.delete();
                                    resolve(message);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    promises.push(promise);
                };
                for (_i = 0, _a = result.fileChunks; _i < _a.length; _i++) {
                    chunk = _a[_i];
                    _loop_3(chunk);
                }
                return [4 /*yield*/, Promise.all(promises)];
            case 3:
                _b.sent();
                return [4 /*yield*/, prisma.file.delete({
                        where: {
                            id: Number(id),
                        },
                    })];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(200).send(result)];
            case 5:
                e_4 = _b.sent();
                return [2 /*return*/, res.status(500).send(e_4)];
            case 6: return [2 /*return*/];
        }
    });
}); });
try {
    app.listen(PORT, function () {
        console.log("Connected successfully on port ".concat(PORT));
    });
}
catch (error) {
    console.error("Error occurred: ".concat(error.message));
}
