import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import rootRouter from "./routers/rootRouter";
import {localsMiddleware} from "./middlewares";


const app = express();

app.set("view engine","pug");
app.set("views", process.cwd()+ "/src/views");

app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    })
);

app.use(localsMiddleware);

app.get("/add-one",(req,res,next)=>{
    req.session.potato +=1;
    return res.send(`${req.session.id}\n ${req.session.potato}`);
})

// app.use("/",rootRouter);
app.get('/', (req, res) => {
    res.status(200).send('Hello, world!').end();
});
  
app.use("/uploads",express.static("uploads"));
app.use("/static",express.static("assets"));
app.use("/videos",videoRouter);
app.use("/users",userRouter);

export default app;