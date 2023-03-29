import express from "express";
import {trend, watch, getEdit, postEdit, getUpload,postUpload,deleteVideo} from "../controllers/videoController";
import { videoMulter, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/",trend);
videoRouter.get("/:id([0-9a-f]{24})",watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);
videoRouter.route("/upload").get(getUpload).post(videoMulter.fields([
    {name:"video",maxCount:1},
    {name:"thumb",maxCount:1}
]), videoUpload, postUpload);


export default videoRouter;
