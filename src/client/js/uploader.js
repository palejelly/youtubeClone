import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";


// detects the file change and encode and extract while user doing other things. 
// There needs to be a progress bar


const videoInput = document.getElementById("video");
const thumbInput = document.getElementById("thumb");

// maybe it's better to add 'submit' button. 
// or make hidden input. 
videoInput.addEventListener(
    "change",
    async (e) => {
        console.log("video file changed");

        console.log(e.target.files[0]);
        const ffmpeg = createFFmpeg({log:true});
        await ffmpeg.load();

      
        let videoFile = URL.createObjectURL(e.target.files[0])
        console.log(videoFile)

        ffmpeg.FS("writeFile", "original.MOV", await fetchFile(videoFile));

        // await ffmpeg.run("-i","original.MOV","-r","30","converted.webm");
        await ffmpeg.run("-i", "original.MOV","-ss", "00:00:01","-frames:v","1", "thumbnail.jpg");
        

        // const mp4File = ffmpeg.FS("readFile","converted.mp4");
        const thumbFile = ffmpeg.FS("readFile","thumbnail.jpg");

        // const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
        const thumbBlob = new Blob([thumbFile.buffer],{type:"image/jpg"});
    
        // let file = new File([mp4Blob],"converted.mp4",{type:"video/mp4", lastModified: new Date().getTime()});
        let thumbBlobFile = new File([thumbBlob],"thumbnail(auto-generated).jpg",{type:"image/jpeg", lastModified: new Date().getTime()});
        let container = new DataTransfer();
        container.items.add(thumbBlobFile);

        thumbInput.files = container.files;
        
        // how to change file in the input. 
        // https://jsfiddle.net/Kartearis/35cjqtg6/3/
        
    });



