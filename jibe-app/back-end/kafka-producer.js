const { Kafka } = require('kafkajs');
const kafkaNode = require('kafka-node');

const kafkaHost = 'localhost:9092';
const topic = 'test-topic';

const kafka = new Kafka({
    clientId: 'my-producer',
    brokers: [kafkaHost],
});

const producer = kafka.producer();

const runProducer = async (message) => {
    await producer.connect();

    // Replace 'test-topic' with your desired topic name

    await producer.send({
        topic,
        messages: [{message}],
    });

    await producer.disconnect();
};

module.exports = {runProducer};
//runProducer().catch(console.error);
