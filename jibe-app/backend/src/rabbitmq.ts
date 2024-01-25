import {connect, Connection} from 'amqplib';
import {addVessel} from "./app-data-source";
import {Vessel} from "./entity/vessel";
//const {runProducer} = require('./kafka-producer');

const createConnection = async (): Promise<Connection> => {
    const connectionStr = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672//vhost1';
    console.log('Connecting to RabbitMQ at:', connectionStr);
    const connection = await connect(connectionStr);
    console.log('Connected to RabbitMQ');
    return connection;
}

const consumeQueue = async (): Promise<void> => {
    try {
        const connection = await createConnection();
        const channel = await connection.createChannel();
        const kafkaChanel = await connection.createChannel();
        const queueName = 'rabbitmq-kafka-queue';

        await channel.assertQueue(queueName, { durable: true });
        console.log('Waiting for messages. To exit press CTRL+C');

        // Set the prefetch count to 1 to ensure that a consumer only receives one message at a time.
        await channel.prefetch(1);
        await kafkaChanel.prefetch(1);

        await channel.consume(queueName, (msg) => {
            if (msg !== null) {
                const msgBuffer = msg.content;
                console.log(`Received: ${msgBuffer}`);
                const vessel: Vessel = JSON.parse( Buffer.from(msgBuffer).toString());
                addVessel(vessel);
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
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

const sendMessageToQueue = async (message: Vessel): Promise<void> => {
    try {
        const connection = await createConnection();
        const channel = await connection.createChannel();
        const queueName = 'rabbitmq-kafka-queue';

        // Assert the queue exists. This step is optional, but it's good practice.
        await channel.assertQueue(queueName, { durable: true });
        const serializedMessage = JSON.stringify(message);

        // Send the message to the queue.
        channel.sendToQueue(queueName, Buffer.from(serializedMessage), { persistent: true });

        console.log(`Message sent to the queue: ${message}`);

        // Close the connection and channel when done.
        await channel.close();
        await connection.close();
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

const setupRabbitMQ =  async (): Promise<void> => {
    try {
        const connection = await createConnection();
        const channel = await connection.createChannel();

        const exchangeName = 'rabbitmq-kafka-exchange';
        const queueName = 'rabbitmq-kafka-queue';

        // Assert the exchange
        await channel.assertExchange(exchangeName, 'direct', { durable: false });

        // Assert the queue
        await channel.assertQueue(queueName, { durable: true });

        // Bind the queue to the exchange
        await channel.bindQueue(queueName, exchangeName, '');

        // Log success
        console.log('RabbitMQ setup complete');

        // Close the connection when done
        await connection.close();
    } catch (error: any) {
        console.error('Error setting up RabbitMQ:', error.message, error.stackTrace);
    }
}

export { consumeQueue, sendMessageToQueue, setupRabbitMQ };
