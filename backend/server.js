import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { connectRabbitMQ, getRabbitMQChannel, closeRabbitMQ } from './utils/rabbitMQ.js';
import userRoutes from "./routes/userRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

dotenv.config();
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to RabbitMQ
(async () => {
    let channel;
    try {
        channel = await connectRabbitMQ();
        await channel.assertQueue('express_queue', { durable: true });
        console.log("Queue 'express_queue' asserted successfully.");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ or assert queue:", error);
        process.exit(1); // Exit if RabbitMQ connection fails
    }
})();

// Option 1: Allow requests from port 3000 only
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost'], // or your specific domain/IPs
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);

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
