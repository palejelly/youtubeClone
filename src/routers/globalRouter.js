import express from "express";
import { trending } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.get("/",trending);

export default globalRouter;