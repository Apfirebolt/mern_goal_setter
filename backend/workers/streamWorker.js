// src/workers/streamWorker.js
import { connectRabbitMQ, consumeStream, QUEUES, closeRabbitMQ } from '../utils/rabbitMQ.js';

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

// Handler for todo.edited.stream
const handleTodoEdited = (data, offset) => {
  const { eventName, goalId, userId, updates, timestamp } = data;
  console.log(`[Stream: ${QUEUES.TODO_EDITED}] [Offset: ${offset}]`);
  console.log(`  ➔ Event: ${eventName || 'goalEdited'}`);
  console.log(`  ➔ Goal ID: ${goalId} | User: ${userId} | Time: ${timestamp}`);
  console.log(`  ➔ Updates:`, JSON.stringify(updates || data?.data, null, 2), '\n');
};

const startWorker = async () => {
  try {
    console.log('[Worker] Initializing background stream listeners...');
    
    // Ensure connection is established
    await connectRabbitMQ();

    // 1. Listen to Login Attempts
    await consumeStream(QUEUES.LOGIN_ATTEMPT, handleLoginAttempt, 'first');
    console.log(`[Worker] Subscribed to ${QUEUES.LOGIN_ATTEMPT}`);

    // 2. Listen to Todo/Goal Created Events
    await consumeStream(QUEUES.TODO_CREATED, handleTodoCreated, 'first');
    console.log(`[Worker] Subscribed to ${QUEUES.TODO_CREATED}`);

    // 3. Listen to Todo/Goal Edited Events
    await consumeStream(QUEUES.TODO_EDITED, handleTodoEdited, 'first');
    console.log(`[Worker] Subscribed to ${QUEUES.TODO_EDITED}`);

    console.log('[Worker] Stream worker is running continuously. Press Ctrl+C to stop.\n');
  } catch (error) {
    console.error('[Worker] Fatal error starting stream worker:', error);
    process.exit(1);
  }
};

// Graceful shutdown handlers
const handleShutdown = async (signal) => {
  console.log(`\n[Worker] Received ${signal}. Shutting down consumer...`);
  await closeRabbitMQ();
  process.exit(0);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startWorker();