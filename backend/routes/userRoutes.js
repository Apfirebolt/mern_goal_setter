import express from "express";
import {
  authUser,
  registerUser,
  getUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(registerUser).get(getUsers);
router.post("/auth", authUser);

export default router;
