import multer from "multer";
import MulterGoogleCloudStorage from "multer-cloud-storage";
import {Storage} from "@google-cloud/storage";

export const localsMiddleware  = (req,res,next)=>{

    res.locals.siteName = "ClimbingTube";
    res.locals.loggedInUser = req.session.user;

    res.locals.loggedIn = Boolean(req.session.loggedIn);

    next();
}

//version 1
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
        bucket:"climbing_bucket",
        projectId:"climbing-social-220317",
}
    ),
    // limits:{fileSize:3000000,}
})

// export const videoUpload = multer({
//     storage: new MulterGoogleCloudStorage({
//         destination:"uploads/videos/",
//         bucket:"climbing_bucket",
//         projectId:"climbing-social-220317",
//     }),
//     // limits:{fileSize:10000000,}
// });



// version 3 
// use multer and google cloud storage

// Multer is required to process file uploads and make them available via
// req.files.
export const videoMulter = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:100*1024*1024,
    },
});


export const videoUpload = (req,res,next) =>{
    const storage = new Storage();
    const videoBucket = storage.bucket(process.env.GCS_BUCKET);
    if (!req.files) {
        res.status(400).send('No file uploaded.');
        return;
    }
    let promises = [];
      // Create a new blob in the bucket and upload the file data.
    const {video, thumb} = req.files;
    const thumbBlob = videoBucket.file("uploads/thumb/"+thumb[0].originalname);
    const thumbBlobStream = thumbBlob.createWriteStream();
    const videoBlob = videoBucket.file("uploads/videos/"+video[0].originalname);
    const blobStream = videoBlob.createWriteStream();
    // https://stackoverflow.com/questions/54948585/sending-multiple-files-to-google-bucket-with-multer-why-are-my-files-empty
    
    promises.push(thumbBlobStream);
    promises.push(blobStream);
    thumbBlobStream.on('finish',()=>{
        const publicUrl =`https://storage.googleapis.com/${videoBucket.name}/${thumbBlob.name}`;
        thumb[0].path = publicUrl;
    });

    blobStream.on('error', err => {
        next(err);
      });
    
    blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = `https://storage.googleapis.com/${videoBucket.name}/${videoBlob.name}`;

        // res.status(200).send(publicUrl);
        // we may need this url later, let's add this in file. 
        video[0].path = publicUrl;

        // since this is middleware, we need to send next();
        });
    Promise.all(promises).then(() => {
        console.log("all promise resolved");
        thumbBlobStream.end(thumb[0].buffer);

        blobStream.end(video[0].buffer);
    
        next();
    });


}