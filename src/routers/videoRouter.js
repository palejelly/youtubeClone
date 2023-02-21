import express from "express";
import {trend} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/",trend);

export default videoRouter;
