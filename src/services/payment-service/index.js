const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

// In-memory payment storage
let payments = [];

// RabbitMQ Connection
let channel;
async function connectQueue() {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('payment_notifications');
}
connectQueue();

// Payment Routes
app.post('/payments/create-intent', authenticateToken, (req, res) => {
    const { amount, eventId, userEmail } = req.body;
    const payment = { id: payments.length + 1, eventId, userId: req.user.id, amount, status: 'pending' };
    payments.push(payment);

    channel.sendToQueue('payment_notifications', Buffer.from(JSON.stringify({
        type: 'PAYMENT_RECEIVED',
        event: { id: eventId },
        userEmail
    })));

    // res.json({ clientSecret: secret_${payment.id } });
    res.json({ clientSecret: secret_${ payment.id } });
});
