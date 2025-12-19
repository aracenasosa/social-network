import express from "express";
import {
  createUser,
  getUsers,
  loginUser,
  logoutUser,
  removeUser,
  updateUser,
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

router.post(
  "/logout",
  validateBody,
  validateRequiredFields(["userNameOrEmail"]),
  logoutUser
);

router.delete("/delete/:id", removeUser);

router.patch("/update/:id", validateBody, updateUser);

export default router;
