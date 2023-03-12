import Video from "../models/Video"


export const trend = async (req,res) => {
    // Method 1 : callback
    // Video.find({},(error,videos) => {console.log(error);
    //     console.log(error);
    //     console.log(videos);    
    // });
    // Method 2: promise
    try{
        const videos = await Video.find({}).sort({createdAt:"asc"});

        return res.render("home",{pageTitle:"Home", videos});
    } catch(error){
        // console.log(error);
        return res.render("home",{pageTitle:"Home", videos:[]});
    }
};
export const watch = async (req,res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(video === null){
        return res.status(404).render("404",{pageTitle:"Video not found"});
    }
    return res.render("watch", {pageTitle: video.title, video});

};
export const getEdit = async (req,res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(video === null){
        return res.status(404).render("404",{pageTitle:"Video not found"});
    }

    return res.render("edit",{pageTitle:`Editt ${video.title}`,video});
};

export const postEdit = async (req,res) => {
    const {id} = req.params;
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
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req,res) =>{
    return res.render("upload",{pageTitle:`Upload`});
}

export const postUpload = async (req,res)=>{
    const {path:fileUrl} = req.file;
    const {title,description, hashtags} = req.body;
    try{
        await Video.create({
            title: title,
            description : description, 
            fileUrl,
            date: Date.now(),
            hashtags: Video.formatHashtags(hashtags),
            meta:{
                views: 0,
                rating: 0,
            },
        });
        return res.redirect("/");

    } catch(error){
        return res.status(400).render("upload",{pageTitle:`Upload`, errorMessage: error._message});
    }
}

export const deleteVideo= async (req,res)=>{
    const {id} = req.params;
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