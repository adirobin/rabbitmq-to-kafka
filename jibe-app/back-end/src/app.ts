import * as express from "express"
import { Request, Response } from "express"
import { sendMessageToQueue, consumeQueue, setupRabbitMQ} from './rabbitmq';
import * as cors from "cors";
import { Vessel } from './entities/Vessel';
import { myDataSource } from "./app-data-source"
import * as bodyParser from "body-parser"
// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    });


const app = express();
const port = 3001;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies for this app

setupRabbitMQ().then(() =>{
    consumeQueue().then(() => {
        console.log('Consumer started');
    });
});

app.post('/api/addVessel', async (req: Request, res: Response) => {
    try {
        const vesselData = req.body;

        // Create a new Vessel entity with the received data

        const newVessel = new Vessel();
        Object.assign(newVessel, vesselData);

        // Save the new vessel to the database
        await myDataSource.getRepository(Vessel).save(newVessel);
        console.log('Vessel data added to the database:', vesselData);

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

app.post('/send-to-queue', async (req: Request, res: Response) => {
    const { message } = req.body;
    console.log(`Message received: ${message} `);
    await sendMessageToQueue(message);
    res.status(200).json({ success: true })
    });

app.post('/api/addVessel', (req: Request, res: Response) => {
    const vesselData = req.body;
    // Insert the vessel data into the database here (using TypeORM or any other ORM/library)

    console.log('Received Vessel Data:', vesselData);

    // You can send a response back to the client if needed
    res.json({ success: true, message: 'Vessel data received and added to the database.' });
});

app.get('/api/vessels',async (req: Request, res: Response) => {
    try {
        const vessels = await myDataSource.getRepository(Vessel).find();
        res.json(vessels);
    } catch (error) {
        console.error('Error fetching vessels from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
