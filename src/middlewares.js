import multer from "multer";


export const localsMiddleware  = (req,res,next)=>{

    res.locals.siteName = "ClimbingTube";
    res.locals.loggedInUser = req.session.user;

    res.locals.loggedIn = Boolean(req.session.loggedIn);
    // console.log(res.locals);

    next();
}

export const avatarUpload = multer({dest:"uploads/avatars/",limits:{fileSize:3000000,}})

export const videoUpload = multer({dest:"uploads/videos/",limits:{fileSize:10000000,}});