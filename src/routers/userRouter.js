import express from "express";
import {seeUser, logout, seeUsers, getEditUser, postEdit,startGithubLogin,finishGithubLogin} from "../controllers/userController"
import { avatarUpload } from "../middlewares";


const userRouter = express.Router();

userRouter.get("/", seeUsers);
userRouter.get("/:id([0-9a-f]{24})", seeUser);

userRouter.route("/edit").get(getEditUser).post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout",logout);
export default userRouter;