"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rabbitmq_1 = require("./rabbitmq");
const app_data_source_1 = require("./app-data-source");
const bodyParser = __importStar(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.APP_PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(bodyParser.json()); // Parse JSON bodies for this app
(0, rabbitmq_1.setupRabbitMQ)().then(() => {
    (0, rabbitmq_1.consumeQueue)().then(() => {
        console.log('Consumer started');
    });
});
app.post('/api/addVessel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vesselData = req.body;
        console.log('Vessel data received:', vesselData);
        yield (0, app_data_source_1.addVessel)(vesselData);
        // Respond to the client
        res.json({ success: true, message: 'Vessel data added to the database.' });
    }
    catch (error) {
        console.error('Error adding vessel data to the database:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}));
app.post('/publish', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { topic, message } = req.body;
    //
    // if (!topic || !message) {
    //     return res.status(400).json({ error: 'Topic and message are required' });
    // }
    //
    // try {
    //     await producer.connect();
    //
    //     await producer.send({
    //         topic,
    //         messages: [
    //             {
    //                 value: message,
    //             },
    //         ],
    //     });
    //
    //     await producer.disconnect();
    //
    //     res.status(200).json({ success: true });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: 'Internal server error' });
    // }
}));
app.post('/api/add-message-to-queue', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = req.body;
    console.log(`Message received: ${message} `);
    yield (0, rabbitmq_1.sendMessageToQueue)(message);
    res.status(200).json({ success: true });
}));
app.get('/api/vessels', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vessels = yield (0, app_data_source_1.getVessels)();
        res.json(vessels);
    }
    catch (error) {
        console.error('Error fetching vessels from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
