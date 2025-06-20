// src/rabbitmq.js
import amqp from 'amqplib';

let connection = null;
let channel = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost'; // Default to local

export const connectRabbitMQ = async () => {
    if (channel) {
        console.log("RabbitMQ channel already exists.");
        return channel;
    }
    try {
        console.log("Connecting to RabbitMQ...");
        connection = await amqp.connect(RABBITMQ_URL);
        console.log("RabbitMQ connected.");

        channel = await connection.createChannel();
        console.log("RabbitMQ channel created.");

        // Handle connection close/error
        connection.on("close", () => {
            console.error("RabbitMQ connection closed! Attempting to reconnect...");
            // Implement a reconnection strategy here if needed for robustness
            channel = null; // Invalidate the channel
            connection = null; // Invalidate the connection
            // You might want to re-call connectRabbitMQ after a delay
        });

        connection.on("error", (err) => {
            console.error("RabbitMQ connection error:", err);
            // Handle error, possibly try to reconnect
        });

        return channel;

    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        // Exit process or handle gracefully depending on your application's needs
        process.exit(1);
    }
};

export const getRabbitMQChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not established. Call connectRabbitMQ first.");
    }
    return channel;
};

export const closeRabbitMQ = async () => {
    if (channel) {
        await channel.close();
        console.log("RabbitMQ channel closed.");
    }
    if (connection) {
        await connection.close();
        console.log("RabbitMQ connection closed.");
    }
};