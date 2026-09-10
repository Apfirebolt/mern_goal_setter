import express from 'express';
const router = express.Router();
import { createCheckoutSession } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/create-checkout-session').post(protect, createCheckoutSession);

export default router;