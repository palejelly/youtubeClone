import multer from "multer";
import MulterGoogleCloudStorage from "multer-cloud-storage";


export const localsMiddleware  = (req,res,next)=>{

    res.locals.siteName = "ClimbingTube";
    res.locals.loggedInUser = req.session.user;

    res.locals.loggedIn = Boolean(req.session.loggedIn);

    next();
}
// export const avatarUpload = multer({
// dest:"uploads/avatars/",
// limits:{fileSize:3000000,}
// });

// export const videoUpload = multer({
//     dest:"uploads/videos/",
//     limits:{fileSize:10000000,}

// });

export const avatarUpload = multer({
    storage: new MulterGoogleCloudStorage(
        {destination:"uploads/avatars/",
        bucket: process.env.GCS_BUCKET,
}
    ),
    // limits:{fileSize:3000000,}
})

export const videoUpload = multer({
    storage: new MulterGoogleCloudStorage({
        destination:"uploads/videos/",
        bucket: process.env.GCS_BUCKET,
    }),
    // limits:{fileSize:10000000,}
});