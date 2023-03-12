import express from "express";
import {getJoin,postJoin,getLogin,postLogin} from "../controllers/userController";

import {trend,search} from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/",trend);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search",search);

export default rootRouter;