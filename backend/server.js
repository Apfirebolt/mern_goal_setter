import path from "path";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
