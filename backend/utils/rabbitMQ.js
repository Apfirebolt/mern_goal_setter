// src/utils/rabbitMQ.js
import amqp from 'amqplib';

let connection = null;
let channel = null;
let isConnecting = false;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const RECONNECT_INTERVAL_MS = 5000;

// Queue constants for your streams
export const QUEUES = {
  TODO_CREATED: 'todo.created.stream',
  TODO_EDITED: 'todo.edited.stream',
  LOGIN_ATTEMPT: 'auth.login-attempt.stream',
};

// Stream queue specifications
const STREAM_QUEUE_OPTIONS = {
  durable: true,
  arguments: {
    'x-queue-type': 'stream',
    'x-max-age': '7D',               // Retain messages for 7 days
    'x-max-length-bytes': 104857600,  // Max size: 100 MB per stream
  },
};

/**
 * Initializes and connects to RabbitMQ, setting up channels and streams.
 */
export const connectRabbitMQ = async () => {
  if (channel) return channel;
  if (isConnecting) return;

  isConnecting = true;

  try {
    console.log('[RabbitMQ] Connecting...');
    connection = await amqp.connect(RABBITMQ_URL);

    connection.on('close', (err) => {
      console.error('[RabbitMQ] Connection closed.', err ? err.message : '');
      channel = null;
      connection = null;
      isConnecting = false;
      setTimeout(connectRabbitMQ, RECONNECT_INTERVAL_MS);
    });

    connection.on('error', (err) => {
      console.error('[RabbitMQ] Connection error:', err.message);
    });

    channel = await connection.createChannel();
    console.log('[RabbitMQ] Channel established.');

    // Required prefetch buffer when consuming from stream queues
    await channel.prefetch(100);

    // Assert all persistent stream queues
    for (const queueName of Object.values(QUEUES)) {
      await channel.assertQueue(queueName, STREAM_QUEUE_OPTIONS);
    }
    console.log('[RabbitMQ] Stream queues declared and ready.');

    isConnecting = false;
    return channel;
  } catch (error) {
    console.error(`[RabbitMQ] Connection failed: ${error.message}. Retrying in ${RECONNECT_INTERVAL_MS / 1000}s...`);
    channel = null;
    connection = null;
    isConnecting = false;
    setTimeout(connectRabbitMQ, RECONNECT_INTERVAL_MS);
  }
};

/**
 * Retrieves the active RabbitMQ channel.
 */
export const getRabbitMQChannel = () => {
  if (!channel) {
    throw new Error('[RabbitMQ] Channel not established. Ensure connectRabbitMQ has completed.');
  }
  return channel;
};

/**
 * Publishes a persistent event payload to a given stream queue.
 * @param {string} queueName
 * @param {object} messageObject
 */
export const publishToStream = async (queueName, messageObject) => {
  try {
    const ch = getRabbitMQChannel();
    const payload = Buffer.from(
      JSON.stringify({
        ...messageObject,
        timestamp: new Date().toISOString(),
      })
    );

    return ch.sendToQueue(queueName, payload, {
      persistent: true,
      contentType: 'application/json',
    });
  } catch (error) {
    console.error(`[RabbitMQ] Publish failed for queue ${queueName}:`, error.message);
    return false;
  }
};

/**
 * Attaches a consumer to a persistent stream queue with offset control.
 * @param {string} queueName
 * @param {function} onMessage - Callback receiving (parsedData, offset, rawMessage)
 * @param {'first'|'last'|'next'|number} offset - Stream read position
 */
export const consumeStream = async (queueName, onMessage, offset = 'next') => {
  const ch = getRabbitMQChannel();

  return ch.consume(
    queueName,
    (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        const streamOffset = msg.properties.headers?.['x-stream-offset'];
        onMessage(content, streamOffset, msg);
        ch.ack(msg); // Confirms processing (does not delete from RabbitMQ Streams)
      } catch (err) {
        console.error(`[RabbitMQ] Consumer processing error on ${queueName}:`, err);
        // Nack without requeue if payload is malformed
        ch.nack(msg, false, false);
      }
    },
    {
      noAck: false,
      arguments: {
        'x-stream-offset': offset,
      },
    }
  );
};

/**
 * Gracefully shuts down channel and connection.
 */
export const closeRabbitMQ = async () => {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }
    if (connection) {
      await connection.close();
      connection = null;
    }
    console.log('[RabbitMQ] Connection closed gracefully.');
  } catch (err) {
    console.error('[RabbitMQ] Error while closing connection:', err.message);
  }
};