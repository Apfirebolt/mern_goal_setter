import asyncHandler from "../middleware/asyncHandler.js";
import Stripe from 'stripe';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured in environment variables");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// @desc    Create Stripe checkout session
// @route   POST /api/payments/create-checkout-session
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { amount, goalId } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error("Amount is required for checkout");
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Goal Marketplace Purchase',
          },
          unit_amount: Math.round(amount * 100), // Stripe reads cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: req.user._id.toString(),
      goalId: goalId || '',
      customAmount: amount,
    },
    success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/cancel`,
  });

  res.json({ url: session.url });
});

export { createCheckoutSession };