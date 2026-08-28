// src/workers/streamWorker.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectRabbitMQ, consumeStream, QUEUES, closeRabbitMQ } from '../utils/rabbitMQ.js';
import Notification from '../models/notification.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your_db_name';

// Database connection helper
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

// Handler for auth.login-attempt.stream
const handleLoginAttempt = (data, offset) => {
  const { event, username, success, ipAddress, timestamp } = data;
  console.log(`[Stream: ${QUEUES.LOGIN_ATTEMPT}] [Offset: ${offset}]`);
  console.log(`  ➔ Event: ${event || (success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED')}`);
  console.log(`  ➔ User: ${username} | Success: ${success} | IP: ${ipAddress} | Time: ${timestamp}\n`);
};

// Handler for todo.created.stream
const handleTodoCreated = (data, offset) => {
  const { eventName, goalId, userId, title, createdAt } = data;
  console.log(`[Stream: ${QUEUES.TODO_CREATED}] [Offset: ${offset}]`);
  console.log(`  ➔ Event: ${eventName || 'goalCreated'}`);
  console.log(`  ➔ Goal ID: ${goalId} | User: ${userId} | Title: "${title || data?.data?.title}" | Time: ${createdAt}\n`);
};

// Handler for todo.edited.stream (Creates Notification Instance)
const handleTodoEdited = async (data, offset) => {
  const { eventName, goalId, userId, updates, data: goalData, timestamp } = data;

  console.log(`[Stream: ${QUEUES.TODO_EDITED}] [Offset: ${offset}]`);
  console.log(`  ➔ Event: ${eventName || 'goalEdited'}`);
  console.log(`  ➔ Goal ID: ${goalId} | User: ${userId} | Time: ${timestamp}`);

  try {
    const changes = updates || goalData || {};
    const updatedTitle = changes.title || 'Goal';
    const updatedFields = Object.keys(changes).join(', ');

    // Instantiate and persist the notification document
    const notification = await Notification.create({
      user: userId,
      goal: goalId,
      type: 'GOAL_EDITED',
      message: `Your goal "${updatedTitle}" was updated (${updatedFields || 'details modified'}).`,
      metadata: {
        updates: changes,
        streamOffset: offset,
        occurredAt: timestamp,
      },
    });

    console.log(`  ➔ [Notification Created] ID: ${notification._id}\n`);
  } catch (err) {
    console.error(`  ➔ [Notification Error] Failed to create notification for Goal ID ${goalId}:`, err.message);
  }
};

const startWorker = async () => {
  try {
    console.log('[Worker] Initializing worker dependencies...');
    
    // Connect to MongoDB and RabbitMQ
    await connectDB();
    await connectRabbitMQ();

    // Listen to streams
    await consumeStream(QUEUES.LOGIN_ATTEMPT, handleLoginAttempt, 'first');
    console.log(`[Worker] Subscribed to ${QUEUES.LOGIN_ATTEMPT}`);

    await consumeStream(QUEUES.TODO_CREATED, handleTodoCreated, 'first');
    console.log(`[Worker] Subscribed to ${QUEUES.TODO_CREATED}`);

    await consumeStream(QUEUES.TODO_EDITED, handleTodoEdited, 'first');
    console.log(`[Worker] Subscribed to ${QUEUES.TODO_EDITED}`);

    console.log('[Worker] Worker running and listening for stream events. Press Ctrl+C to stop.\n');
  } catch (error) {
    console.error('[Worker] Fatal startup error:', error);
    process.exit(1);
  }
};

// Graceful shutdown handlers
const handleShutdown = async (signal) => {
  console.log(`\n[Worker] Received ${signal}. Cleaning up resources...`);
  await closeRabbitMQ();
  await mongoose.connection.close();
  console.log('[Worker] Database and RabbitMQ connections closed.');
  process.exit(0);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startWorker();