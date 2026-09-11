import asyncHandler from "../middleware/asyncHandler.js";
import Razorpay from "razorpay";
import crypto from "crypto";
// Import any payment model if you wish to persist transactions (e.g., Payment from "../models/payment.js")

// Initialize Razorpay instance safely
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Create new Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("A valid payment amount is required");
  }

  const razorpay = getRazorpayInstance();

  const options = {
    amount: Math.round(amount * 100), // Razorpay expects amount in the smallest currency unit (e.g., paise)
    currency: "INR",
    receipt: `receipt_${Date.now()}_${req.user._id}`,
    notes: {
      userId: req.user._id.toString(),
    },
  };

  const order = await razorpay.orders.create(options);

  if (!order) {
    res.status(500);
    throw new Error("Unable to create Razorpay order");
  }

  res.status(201).json({
    success: true,
    order,
  });
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify-payment
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Missing required payment verification parameters");
  }

  // Generate expected cryptographic signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    res.status(400);
    throw new Error("Invalid payment signature, verification failed");
  }

  // TODO: Save transaction details to MongoDB if you have a Payment model
  /*
  await Payment.create({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    user: req.user._id,
    status: 'Success'
  });
  */

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });
});

export { createOrder, verifyPayment };