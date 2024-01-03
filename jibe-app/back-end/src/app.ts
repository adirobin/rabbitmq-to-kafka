import express from 'express';
import cors from 'cors';

import { Request, Response } from "express"
import { sendMessageToQueue, consumeQueue, setupRabbitMQ} from './rabbitmq';
import { addVessel, getVessels } from "./app-data-source"
import * as bodyParser from "body-parser"
import {Vessel} from "./entity/vessel";
import './copyMessagesBetweenQueues';

const app = express();
const port = process.env.APP_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON bodies for this app

setupRabbitMQ().then(() =>{
    consumeQueue().then(() => {
        console.log('Consumer started');
    });
});

app.post('/api/addVessel', async (req: Request, res: Response) => {
    try {
        const vesselData = req.body;
        console.log('Vessel data received:', vesselData);
        await addVessel(vesselData);
        // Respond to the client
        res.json({ success: true, message: 'Vessel data added to the database.' });
    } catch (error) {
        console.error('Error adding vessel data to the database:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.post('/publish', async (req: Request, res: Response) => {
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
});

app.post('/api/add-message-to-queue', async (req: Request, res: Response) => {
    const  message: Vessel = req.body;
    console.log(`Message received: ${message} `);
    await sendMessageToQueue(message);
    res.status(200).json({ success: true })
    });


app.get('/api/vessels',async (req: Request, res: Response) => {
    try {
        const vessels = await getVessels();
        res.json(vessels);
    } catch (error) {
        console.error('Error fetching vessels from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
