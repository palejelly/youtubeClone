import express from "express";
import {seeUser, seeUsers} from "../controllers/userController"

const userRouter = express.Router();

userRouter.get("/", seeUsers);
userRouter.get("/:id", seeUser);

export default userRouter;