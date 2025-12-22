import express from "express";
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.route";
import likeRouter from "./routes/like.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/likes", likeRouter);

export default app;
