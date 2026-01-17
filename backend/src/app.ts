import express from "express";
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.route";
import likeRouter from "./routes/like.route";
import authRouter from "./routes/auth.route";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/likes", likeRouter);
app.use("/api/auth", authRouter);

export default app;
