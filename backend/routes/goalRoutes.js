import express from 'express';
const router = express.Router();
import {
    addGoal,
    getMyGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
    getGoals,
} from '../controllers/goalController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addGoal).get(protect, admin, getGoals);
router.route('/mine').get(protect, getMyGoals);
router.route('/:id').get(protect, getGoalById).put(protect, updateGoal).delete(protect, deleteGoal);

export default router;
