import { Router } from "express";
import { toggleLike } from "../controllers/like.controller";
import {
  validateBody,
  validateRequiredFields,
} from "../middlewares/validateRequest.middleware";

const router = Router();

router.post(
  "/:postId/toggle",
  validateBody,
  validateRequiredFields(["userId"]),
  toggleLike
);

export default router;
