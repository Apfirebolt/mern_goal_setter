// src/controllers/notificationController.js
import asyncHandler from "../middleware/asyncHandler.js";
import Notification from "../models/notification.js";

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find()
    .populate("goal", "title category")
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

export { getNotifications };