import asyncHandler from "../middleware/asyncHandler.js";
import Goal from "../models/goal.js";
import { getRabbitMQChannel, QUEUES } from "../utils/rabbitMQ.js";
import { getElasticsearchClient } from "../utils/elasticSearch.js";

// Helper to publish events to RabbitMQ stream queues
const publishStreamEvent = async (queueName, payload) => {
  try {
    const channel = getRabbitMQChannel();

    // Ensure stream queue definition matches rabbitMQ.js
    await channel.assertQueue(queueName, {
      durable: true,
      arguments: {
        "x-queue-type": "stream",
        "x-max-age": "7D",
        "x-max-length-bytes": 104857600,
      },
    });

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({ ...payload, timestamp: new Date().toISOString() })),
      { persistent: true }
    );
  } catch (error) {
    console.error(`[RabbitMQ] Failed to publish event to ${queueName}:`, error);
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
const addGoal = asyncHandler(async (req, res) => {
  const { title, description, category, startDate, endDate } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required");
  }

  const goal = new Goal({
    title,
    description,
    category,
    startDate,
    endDate,
    user: req.user._id,
  });

  const createdGoal = await goal.save();

  // 1. Publish persistent stream event (TODO_CREATED / GOAL_CREATED)
  await publishStreamEvent(QUEUES.TODO_CREATED, {
    eventName: "goalCreated",
    goalId: createdGoal._id,
    userId: req.user._id,
    data: createdGoal,
  });

  // 2. Direct Elasticsearch index (or offload this to a stream consumer)
  try {
    const esClient = getElasticsearchClient();
    await esClient.index({
      index: "goals",
      id: createdGoal._id.toString(),
      document: {
        title: createdGoal.title,
        description: createdGoal.description,
        category: createdGoal.category,
        startDate: createdGoal.startDate,
        endDate: createdGoal.endDate,
        user: createdGoal.user,
        createdAt: createdGoal.createdAt,
        updatedAt: createdGoal.updatedAt,
      },
    });
    console.log(`[Elasticsearch] Indexed goal ID: ${createdGoal._id}`);
  } catch (esError) {
    console.error("[Elasticsearch] Failed to index goal:", esError);
  }

  res.status(201).json(createdGoal);
});

// @desc    Get logged in user goals
// @route   GET /api/goals/mine
// @access  Private
const getMyGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.json(goals);
});

// @desc    Get goal by ID
// @route   GET /api/goals/:id
// @access  Private
const getGoalById = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (goal) {
    res.json(goal);
  } else {
    res.status(404);
    throw new Error("Goal not found");
  }
});

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const { title, description, category, startDate, endDate } = req.body;
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

  goal.title = title || goal.title;
  goal.description = description || goal.description;
  goal.category = category || goal.category;
  goal.startDate = startDate || goal.startDate;
  goal.endDate = endDate || goal.endDate;

  const updatedGoal = await goal.save();

  // Publish stream event for edit
  await publishStreamEvent(QUEUES.TODO_EDITED, {
    eventName: "goalEdited",
    goalId: updatedGoal._id,
    userId: req.user._id,
    updates: { title, description, category, startDate, endDate },
    data: updatedGoal,
  });

  // Sync update to Elasticsearch
  try {
    const esClient = getElasticsearchClient();
    await esClient.update({
      index: "goals",
      id: updatedGoal._id.toString(),
      doc: {
        title: updatedGoal.title,
        description: updatedGoal.description,
        category: updatedGoal.category,
        startDate: updatedGoal.startDate,
        endDate: updatedGoal.endDate,
        updatedAt: updatedGoal.updatedAt,
      },
    });
  } catch (esError) {
    console.error("[Elasticsearch] Failed to update indexed goal:", esError);
  }

  res.json(updatedGoal);
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

  await goal.deleteOne();

  // Delete from Elasticsearch
  try {
    const esClient = getElasticsearchClient();
    await esClient.delete({
      index: "goals",
      id: req.params.id,
    });
  } catch (esError) {
    console.error("[Elasticsearch] Failed to delete indexed goal:", esError);
  }

  res.status(204).end();
});

// @desc    Get all goals
// @route   GET /api/goals
// @access  Private/Admin
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({}).populate("user", "id name");
  res.json(goals);
});

export { addGoal, getMyGoals, getGoalById, updateGoal, deleteGoal, getGoals };