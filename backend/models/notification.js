// src/models/notification.js
import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Goal',
    },
    type: {
      type: String,
      required: true,
      enum: ['GOAL_CREATED', 'GOAL_EDITED', 'GOAL_DELETED'],
      default: 'GOAL_EDITED',
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;