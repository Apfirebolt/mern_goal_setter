import { connectRabbitMQ, getRabbitMQChannel } from '../utils/rabbitMQ.js';

const QUEUE_NAME = 'goal_created_queue';

const processMessage = (msg, channel) => {
    if (msg !== null) {
        try {
            // 1. Parse the incoming JSON message
            const content = JSON.parse(msg.content.toString());

            console.log("\n--- NEW GOAL EVENT RECEIVED ---");
            console.log(`Event Name: ${content.eventName}`);
            console.log(`Goal ID: ${content.goalId}`);
            console.log(`Title: ${content.title}`);
            console.log(`User ID: ${content.userId}`);
            console.log(`Received At: ${new Date().toISOString()}`);

            channel.ack(msg);
            console.log("---------------------------------");

        } catch (error) {
            console.error(`[ERROR] Failed to process message for goal ID ${msg.fields.deliveryTag}:`, error.message);

            channel.nack(msg, false, true);
        }
    }
};


/**
 * Initializes the consumer by connecting to RabbitMQ and starting the consumption.
 */
const startConsumer = async () => {
    try {
        // 1. Establish connection and get channel (using external function)
        await connectRabbitMQ();
        const channel = getRabbitMQChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(`\n✅ Waiting for messages in queue: ${QUEUE_NAME}. To exit, press CTRL+C`);

        channel.consume(QUEUE_NAME, (msg) => processMessage(msg, channel), {
            noAck: false
        });

    } catch (error) {
        console.error("--- FATAL ERROR IN CONSUMER ---");
        console.error("Could not start RabbitMQ consumer:", error.message);
        process.exit(1);
    }
};

startConsumer();