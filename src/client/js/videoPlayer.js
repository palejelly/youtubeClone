
const video  = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue=0.5;
video.volume = volumeValue;


const handlePlayClick= (e) =>{
    if(video.paused){
        video.play();
    }
    else{
        video.pause();
    }
    playBtnIcon.className = video.paused? "fas fa-play" : "fas fa-pause";
}

const handleMute= (e) =>{
    if(video.muted){
        video.muted = false;
    }
    else{
        video.muted = true;
    }
    muteBtn.innerText=video.muted? "Unmute":"Mute";
    volumeRange.value = video.muted? 0 : 0.5;

}

const handleVolumeChange= (event) =>{
    const {target:{value}} = event;
    if(video.muted){
        video.muted= value;
        muteBtn.innerText="Mute";
    }
    volumeValue= value;
    video.volume = value;
}
const formatTime = (seconds) => (new Date(seconds*1000)).toISOString().substr(14,5);


const handleLoadedMetadata = () =>{
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}


const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimeLineChange = (event) =>{
    const {target:{value}} = event;
    video.currentTime = value;
}


const handleFullscreen = (event) =>{
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        fullScreenBtn.innerText = "Enter Full Screen";
        document.exitFullscreen();
    }
    else{
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen";
    }
}

let mouseMoveStopped;
let mouseLeaveTimeout;
const handleMouseMove = () => {
    if(mouseLeaveTimeout){
        clearTimeout(mouseLeaveTimeout);
        mouseLeaveTimeout = null;
    }
    videoControls.classList.add("showing")
    if(!mouseMoveStopped){
        clearTimeout(mouseMoveStopped);
        mouseMoveStopped =null;
    }
    mouseMoveStopped = setTimeout(()=>{videoControls.classList.remove("showing");}, 3000);

}

const handleMouseLeave= ()=> {
    mouseLeaveTimeout = setTimeout(()=>{
        videoControls.classList.remove("showing");
    },3000);

}


playBtn.addEventListener("click",handlePlayClick);
muteBtn.addEventListener("click",handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.readyState ? handleLoadedMetadata() : video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate",handleTimeUpdate);
timeline.addEventListener("input",handleTimeLineChange)
fullScreenBtn.addEventListener("click",handleFullscreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave",handleMouseLeave);
