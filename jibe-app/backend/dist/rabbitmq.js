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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRabbitMQ = exports.sendMessageToQueue = exports.consumeQueue = void 0;
const amqplib_1 = require("amqplib");
const app_data_source_1 = require("./app-data-source");
//const {runProducer} = require('./kafka-producer');
const createConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const connectionStr = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672//vhost1';
    console.log('Connecting to RabbitMQ at:', connectionStr);
    const connection = yield (0, amqplib_1.connect)(connectionStr);
    return connection;
});
const consumeQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield createConnection();
        const channel = yield connection.createChannel();
        const kafkaChanel = yield connection.createChannel();
        const queueName = 'rabbitmq-kafka-queue';
        yield channel.assertQueue(queueName, { durable: true });
        console.log('Waiting for messages. To exit press CTRL+C');
        // Set the prefetch count to 1 to ensure that a consumer only receives one message at a time.
        yield channel.prefetch(1);
        yield kafkaChanel.prefetch(1);
        yield channel.consume(queueName, (msg) => {
            if (msg !== null) {
                const msgBuffer = msg.content;
                console.log(`Received: ${msgBuffer}`);
                const vessel = JSON.parse(Buffer.from(msgBuffer).toString());
                (0, app_data_source_1.addVessel)(vessel);
                // Acknowledge the message to remove it from the queue
                channel.ack(msg);
            }
        });
        // await kafkaChanel.consume(queueName, (msg) => {
        //     if (msg !== null) {
        //         const msgBuffer = msg.content;
        //         console.log(`Received: ${msgBuffer}`);
        //         const vessel: Vessel = JSON.parse( Buffer.from(msgBuffer).toString());
        //
        //         runProducer(msg.content.toString()).then(() => {
        //             console.log('Message sent to Kafka');
        //             channel.ack(msg);
        //         }).catch((error) => {
        //             console.error('Error sending message to Kafka:', error.message);
        //             channel.nack(msg, false, false);
        //         });
        //
        //         // Acknowledge the message to remove it from the queue
        //         kafkaChanel.ack(msg);
        //     }
        // });
    }
    catch (error) {
        console.error('Error:', error.message);
    }
});
exports.consumeQueue = consumeQueue;
const sendMessageToQueue = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield createConnection();
        const channel = yield connection.createChannel();
        const queueName = 'rabbitmq-kafka-queue';
        // Assert the queue exists. This step is optional, but it's good practice.
        yield channel.assertQueue(queueName, { durable: true });
        const serializedMessage = JSON.stringify(message);
        // Send the message to the queue.
        channel.sendToQueue(queueName, Buffer.from(serializedMessage), { persistent: true });
        console.log(`Message sent to the queue: ${message}`);
        // Close the connection and channel when done.
        yield channel.close();
        yield connection.close();
    }
    catch (error) {
        console.error('Error:', error.message);
    }
});
exports.sendMessageToQueue = sendMessageToQueue;
const setupRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield createConnection();
        const channel = yield connection.createChannel();
        const exchangeName = 'rabbitmq-kafka-exchange';
        const queueName = 'rabbitmq-kafka-queue';
        // Assert the exchange
        yield channel.assertExchange(exchangeName, 'direct', { durable: false });
        // Assert the queue
        yield channel.assertQueue(queueName, { durable: true });
        // Bind the queue to the exchange
        yield channel.bindQueue(queueName, exchangeName, '');
        // Log success
        console.log('RabbitMQ setup complete');
        // Close the connection when done
        yield connection.close();
    }
    catch (error) {
        console.error('Error setting up RabbitMQ:', error.message, error.stackTrace);
    }
});
exports.setupRabbitMQ = setupRabbitMQ;
