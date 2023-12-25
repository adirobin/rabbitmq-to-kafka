import {connect} from 'amqplib';
//const {runProducer} = require('./kafka-producer');

const consumeQueue = async (): Promise<void> => {
    try {
        const connection = await connect('amqp://guest:guest@localhost:5672//vhost1');
        const channel = await connection.createChannel();
        const queueName = 'rabbitmq-kafka-queue';

        await channel.assertQueue(queueName, { durable: true });
        console.log('Waiting for messages. To exit press CTRL+C');

        // Set the prefetch count to 1 to ensure that a consumer only receives one message at a time.
        await channel.prefetch(1);

        await channel.consume(queueName, (msg) => {
            if (msg !== null) {
                console.log(`Received: ${msg.content.toString()}`);
                // runProducer(msg.content.toString()).then(() => {
                //     console.log('Message sent to Kafka');
                //     channel.ack(msg);
                // }).catch((error) => {
                //     console.error('Error sending message to Kafka:', error.message);
                //     channel.nack(msg, false, false);
                // });
            }
        });
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

const sendMessageToQueue = async (message: any): Promise<void> => {
    try {
        const connection = await connect('amqp://guest:guest@localhost:5672//vhost1');
        const channel = await connection.createChannel();
        const queueName = 'rabbitmq-kafka-queue';

        // Assert the queue exists. This step is optional, but it's good practice.
        await channel.assertQueue(queueName, { durable: true });

        // Send the message to the queue.
        channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });

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
        const connection = await connect('amqp://guest:guest@localhost:5672//vhost1');
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
        console.error('Error setting up RabbitMQ:', error.message);
    }
}

export { consumeQueue, sendMessageToQueue, setupRabbitMQ };
