import express from "express";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const PORT = 4000;

app.set("view engine","pug");
app.set("views", process.cwd()+ "/src/views");

app.use("/",globalRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);

const startListening = () => console.log(`server listening on port http://localhost:${PORT}`);

app.listen(PORT,startListening);