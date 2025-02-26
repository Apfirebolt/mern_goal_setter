import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Option 1: Allow requests from port 3000 only
const corsOptions = {
  origin: 'http://localhost:3000', // or your specific domain/IP
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
  }
);

app.use("/api/users", userRoutes);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
