import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import rootRouter from "./routers/rootRouter";
import {localsMiddleware} from "./middlewares";
import apiRouter from "./routers/apiRouter";


const app = express();

app.set("view engine","pug");
app.set("views", process.cwd()+ "/src/views");
app.set('trust proxy', true);


app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    })
);

app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
    });
    

app.use(localsMiddleware);

app.use("/",rootRouter);
app.use("/uploads",express.static("uploads"));
app.use("/static",express.static("assets"));
app.use("/videos",videoRouter);
app.use("/users",userRouter);
app.use("/api",apiRouter);

app.get(/^(?!.*_ah).*$/,(req,res,next)=>{
});


export default app;