import Video from "../models/Video"
import User from "../models/User"
import {Storage} from "@google-cloud/storage";


const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    storage: process.env.GCS_BUCKET,
});
// https://stackoverflow.com/questions/72605933/google-cloud-storage-file-stream-into-fsreadstream-without-saving-to-file
async function generateSignedUrl(){
    const fileName = "uploads/videos/MyRecording.webm";
    const options = {
        version:'v2',
        action:'read',
        expires:Date.now() + 1000*60*60,
    };
    const [url] = await storage
    .bucket(process.env.GCS_BUCKET)
    .file(fileName)
    .getSignedUrl(options);

    console.log(`The signed url for ${fileName} is ${url}.`);

    // generateSignedUrl().catch(console.error);;;
    return url;
}


export const trend = async (req,res) => {
    // Method 1 : callback
    // Video.find({},(error,videos) => {console.log(error);
    //     console.log(error);
    //     console.log(videos);    
    // });
    // Method 2: promise
    try{
        const videos = await Video.find({}).populate("owner").sort({createdAt:"asc"});

        return res.render("home",{pageTitle:"Home", videos});
    } catch(error){
        // console.log(error);
        return res.render("home",{pageTitle:"Home", videos:[]});
    }
};
export const watch = async (req,res) => {
    // testing 
    const url = await generateSignedUrl();

    const {id} = req.params;
    const video = await Video.findById(id).populate("owner");

    // TODO: need to change this.
    // TODO 1: use ffmpeg to make files to mp4. otherwise, it won't work. 
    // todo 2: auth problem. errordd fetching application [apps/climbing-social-220317]. Please make sure that you have permission to view applications on the project and that 663145008847@cloudbuild.gserviceaccount.com has the App Engine Deployer (roles/appengine.deployer) role.
    video.fileUrl = url;

    if(video === null){
        return res.status(404).render("404",{pageTitle:"Video not found"});
    }
    return res.render("watch", {pageTitle: video.title, video});

};
export const getEdit = async (req,res) => {
    const {id} = req.params;
    const {user:{_id}} = req.session;
    const video = await Video.findById(id);
    if(video === null){
        return res.status(404).render("404",{pageTitle:"Video not found"});
    }

    if(String(video.owner) !== String(_id) ){
        return res.status(403).redirect("/");
    }
    return res.render("edit",{pageTitle:`Editt ${video.title}`,video});
};

export const postEdit = async (req,res) => {
    const {id} = req.params;
    const {user:{_id},} = req.session;
    const { title , description, hashtags} = req.body;
    const video = await Video.exists({_id:id});

    if(video === null){
        return res.render("404",{pageTitle:"Video not found"});
    }
    await Video.findByIdAndUpdate(id,{
        title:title,
        description, 
        hashtags: Video.formatHashtags(hashtags),
    });
    if(String(video.owner) !== String(_id) ){
        return res.status(403).redirect("/");
    }

    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req,res) =>{
    return res.render("upload",{pageTitle:`Upload`});
}

export const postUpload = async (req,res)=>{
    const {user:{_id}} = req.session;
    const {video, thumb} = req.files;
    const {title,description, hashtags} = req.body;
    try{
        const newVideo = await Video.create({
            title: title,
            description : description, 
            fileUrl:video[0].path,
            owner:_id,
            thumbUrl:thumb[0].path,
            date: Date.now(),
            hashtags: Video.formatHashtags(hashtags),
            meta:{
                views: 0,
                rating: 0,
            },
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");

    } catch(error){
        return res.status(400).render("upload",{pageTitle:`Upload`, errorMessage: error._message});
    }
}

export const deleteVideo= async (req,res)=>{
    const {id} = req.params;
    const {user:{_id},} = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404",{pageTitle:"Video not found."});
    }
    if(String(video.owner) !== String(_id) ){
        return res.status(403).redirect("/");
    }

    await Video.findByIdAndDelete(id);
    //delete video


    return res.redirect("/");

}

export const search = (req,res) =>{
    const {keyword} = req.query;
    if(keyword){
        //search
    }
    res.render("search",{pageTitle:"Search"});
}

export const registerView = async (req,res) =>{
    const {id} = req.params;
    const video = await Video.findById(id);

    if(!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views +1;
    await video.save();
    return res.sendStatus(200);
}