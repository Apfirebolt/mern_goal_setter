import asyncHandler from "../middleware/asyncHandler.js";
import Razorpay from "razorpay";
import crypto from "crypto";

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

// @desc    Verify Razorpay payment signature & fetch details
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

  // Fetch payment details directly from Razorpay to securely retrieve exact amount and currency
  const razorpay = getRazorpayInstance();
  const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

  const amountPaid = paymentDetails.amount / 100; // Convert from smallest unit (paise) to major unit
  const currencyPaid = paymentDetails.currency;

  // Print/Log amount and currency securely on the server
  console.log(
    `[Payment Success] Order ID: ${razorpay_order_id} | Payment ID: ${razorpay_payment_id} | Amount: ${amountPaid} ${currencyPaid}`
  );

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    amount: amountPaid,
    currency: currencyPaid,
  });
});

export { createOrder, verifyPayment };