const express = require('express');
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// Email transport configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Connect to RabbitMQ and process messages
async function processNotifications() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('event_notifications');
    await channel.assertQueue('payment_notifications');

    channel.consume('event_notifications', async (data) => {
        const notification = JSON.parse(data.content);

        switch (notification.type) {
            case 'EVENT_CREATED':
                // Send email to admin
                await transporter.sendMail({
                    from: 'noreply@events.com',
                    to: 'admin@events.com',
                    subject: 'New Event Created',
                    text: 'New event created: ${ notification.event.title }'
        });
    break;
}

channel.ack(data);
  });

channel.consume('payment_notifications', async (data) => {
    const notification = JSON.parse(data.content);

    switch (notification.type) {
        case 'PAYMENT_RECEIVED':
            // Send confirmation to user
            await transporter.sendMail({
                from: 'noreply@events.com',
                to: notification.userEmail,
                subject: 'Payment Confirmation',
                text: 'Your payment for event has been received'
            });
            break;
    }

    channel.ack(data);
});
}

processNotifications().catch(console.error);
