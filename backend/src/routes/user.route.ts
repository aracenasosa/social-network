import express from "express";
import {
  createUser,
  getUsers,
  loginUser,
} from "../controllers/user.controller";
import {
  validateBody,
  validateRequiredFields,
} from "../middlewares/validateRequest.middleware";

const router = express.Router();

router.get("/", getUsers);

router.post(
  "/",
  validateBody,
  validateRequiredFields(["userName", "fullName", "email", "password"]),
  createUser
);

router.post(
  "/login",
  validateBody,
  validateRequiredFields(["userNameOrEmail", "password"]),
  loginUser
);

export default router;
