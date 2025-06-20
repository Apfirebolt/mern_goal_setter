import asyncHandler from "../middleware/asyncHandler.js";
import Goal from "../models/goal.js";
import { getRabbitMQChannel } from "../utils/rabbitMQ.js";

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
const addGoal = asyncHandler(async (req, res) => {
  const { title, description, category, startDate, endDate } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required");
  } else {
    const goal = new Goal({
      title,
      description,
      category,
      startDate,
      endDate,
      user: req.user._id,
    });

    const createdGoal = await goal.save();

    // Push a message to RabbitMQ queue
    try {
      const channel = getRabbitMQChannel();
      const queueName = 'goal_created_queue'; // Define a specific queue for goal creation events

      // Ensure the queue exists (good practice in both producer and consumer)
      await channel.assertQueue(queueName, { durable: true });

      // Create a message payload with relevant goal data
      const messagePayload = {
        eventName: 'goalCreated',
        goalId: createdGoal._id,
        title: createdGoal.title,
        description: createdGoal.description,
        userId: createdGoal.user,
        createdAt: createdGoal.createdAt,
      };
      // Publish the message
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messagePayload)), { persistent: true });
      console.log(`[RabbitMQ] Sent 'goalCreated' event for goal ID: ${createdGoal._id}`);

    } catch (mqError) {
      console.error("Failed to publish 'goalCreated' message to RabbitMQ:", mqError);
    }

    res.status(201).json(createdGoal);
  }
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

  if (goal) {
    goal.title = title || goal.title;
    goal.description = description || goal.description;
    goal.category = category || goal.category;
    goal.startDate = startDate || goal.startDate;
    goal.endDate = endDate || goal.endDate;

    const updatedGoal = await goal.save();

    res.json(updatedGoal);
  } else {
    res.status(404);
    throw new Error("Goal not found");
  }
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (goal) {
    await goal.deleteOne();
    res.status(204).end();
  } else {
    res.status(404);
    throw new Error("Goal not found");
  }
});

// @desc    Get all goals
// @route   GET /api/goals
// @access  Private/Admin
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({}).populate("user", "id name");
  res.json(goals);
});

export { addGoal, getMyGoals, getGoalById, updateGoal, deleteGoal, getGoals };
