const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

// In-memory event storage
let events = [];
let eventId = 1;

// RabbitMQ Connection
let channel;
async function connectQueue() {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('event_notifications');
}
connectQueue();

// Event Routes
app.post('/events', (req, res) => {
    const event = { id: eventId++, ...req.body };
    events.push(event);
    channel.sendToQueue('event_notifications', Buffer.from(JSON.stringify({
        type: 'EVENT_CREATED',
        event
    })));
    res.status(201).json(event);
});
