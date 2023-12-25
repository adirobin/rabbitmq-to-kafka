"use strict";
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
const rabbitmq_1 = require("./rabbitmq");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const { createConnection } = require('typeorm');
const { Vessel } = require('./Vessel');
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Enable CORS for all routes
app.use(body_parser_1.default.json()); // Parse JSON bodies for this app
// // TypeORM Connection
// const connection = await createConnection();
// console.log('Connected to the database');
//
//
//     .catch((error) => console.error('Error connecting to the database:', error));
(0, rabbitmq_1.setupRabbitMQ)().then(() => {
    (0, rabbitmq_1.consumeQueue)().then(() => {
        console.log('Consumer started');
    });
});
app.post('/api/addVessel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vesselData = req.body;
        // Create a new Vessel entity with the received data
        const newVessel = new Vessel();
        Object.assign(newVessel, vesselData);
        // Save the new vessel to the database
        const connection = yield createConnection();
        console.log('Connected to the database');
        yield connection.manager.save(newVessel);
        console.log('Vessel data added to the database:', vesselData);
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
app.post('/send-to-queue', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    console.log(`Message received: ${message} `);
    yield (0, rabbitmq_1.sendMessageToQueue)(message);
    res.status(200).json({ success: true });
}));
app.post('/api/addVessel', (req, res) => {
    const vesselData = req.body;
    // Insert the vessel data into the database here (using TypeORM or any other ORM/library)
    console.log('Received Vessel Data:', vesselData);
    // You can send a response back to the client if needed
    res.json({ success: true, message: 'Vessel data received and added to the database.' });
});
app.get('/api/vessels', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // TypeORM Connection
        const connection = yield createConnection();
        console.log('Connected to the database');
        const vessels = yield connection.manager.find(Vessel);
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
