import 'dotenv/config';
import path from "path";
import express from "express";
import cors from "cors";

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { connectRabbitMQ, getRabbitMQChannel, closeRabbitMQ } from './utils/rabbitMQ.js';
import { startScheduledJobs } from "./utils/scheduler.js";
import { connectElasticsearch } from './utils/elasticSearch.js';
import Stripe from 'stripe';

// 1. IMPORT SWAGGER PACKAGES
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

import userRoutes from "./routes/userRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


import { connectDB } from "./config/db.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`[Stripe] Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const goalId = session.metadata.goalId;
      const amount = session.metadata.customAmount;

      console.log(`[Stripe] Payment verified for User: ${userId}, Goal: ${goalId}, Amount: ${amount}`);

      try {
        // ==========================================
        // CUSTOM DATABASE EDITS HERE
        // ==========================================
        // Example: Update goal status or credit user points
        // const goal = await Goal.findById(goalId);
        // if (goal) {
        //   goal.isPaid = true;
        //   await goal.save();
        // }

        console.log("[Database] Successfully updated after successful payment");
      } catch (dbError) {
        console.error("[Database] Failed to process payment update:", dbError);
        return res.status(500).json({ error: "Database update failed" });
      }
    }

    res.json({ received: true });
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.resolve();

// Connect to RabbitMQ
(async () => {
    let channel;
    try {
        channel = await connectRabbitMQ();
        await channel.assertQueue('express_queue', { durable: true });
        console.log("Queue 'express_queue' asserted successfully.");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ or assert queue:", error);
        process.exit(1);
    }
})();

// Connect to Elasticsearch
(async () => {
    try {
        await connectElasticsearch();
    } catch (error) {
        console.error("Failed to connect to Elasticsearch:", error);
        process.exit(1);
    }
})();

// Option 1: Allow requests from port 3000 only
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost'],
  optionsSuccessStatus: 200,
};

// Start scheduled jobs
startScheduledJobs();

app.use(cors(corsOptions));

// 2. SWAGGER CONFIGURATION (OPENAPI SPECS)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MERN Goal Setter API Documentation',
      version: '1.0.0',
      description: 'Documentation for the Express MERN Goal Setter Backend API',
    },
    servers: [
      {
        url: '/api', // Use a relative path if the server handles both HTTP/HTTPS
        description: 'Primary API Server'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: []
    }],
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};

// Generate the Swagger Specification
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// 3. SWAGGER UI ROUTE
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
