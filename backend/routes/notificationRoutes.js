import express from 'express';
const router = express.Router();
import { getNotifications } from '../controllers/notificationController.js';

router.route('/').get(getNotifications);

export default router;
