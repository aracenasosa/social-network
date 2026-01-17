import { Router } from "express";
import {
  validateBody,
  validateRequiredFields,
} from "../middlewares/validateRequest.middleware";
import { loginUser, logoutUser, refresh } from "../controllers/auth.controller";

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrUsername
 *               - password
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *                 description: Username or email
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  validateBody,
  validateRequiredFields(["emailOrUsername", "password"]),
  loginUser,
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userNameOrEmail
 *             properties:
 *               userNameOrEmail:
 *                 type: string
 *                 description: Username or email
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post(
  "/logout",
  validateBody,
  validateRequiredFields(["userNameOrEmail"]),
  logoutUser,
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh", refresh);

export default router;
