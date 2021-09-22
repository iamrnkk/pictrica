const recordBtn= document.getElementById("record");
const captureBtn= document.getElementById("capture");
const videoPlayer= document.querySelector("video");
const container= document.querySelector(".container");
const videoPlayerContainer= document.querySelector(".video-container");
const allFilters= document.querySelectorAll(".filter");
const zoomIn= document.getElementById("zoom-in");
const zoomOut= document.getElementById("zoom-out");
const galleryBtn= document.getElementById("gallery-btn");


let currZoom=1;
zoomIn.addEventListener("click", function(){
    if(isRecording) return;
    currZoom= currZoom+0.1;
    if(currZoom>3) currZoom=3;
    videoPlayer.style.transform= `scale(${currZoom})`;
});

zoomOut.addEventListener("click", function(){
    if(isRecording) return;
    currZoom-=0.1
    if(currZoom<1) currZoom=1;
    videoPlayer.style.transform= `scale(${currZoom})`;
});

let chunks= [];
let videoRecorder;

let isRecording= false;

recordBtn.addEventListener("click", function()
{
    
    if(isRecording) 
    {
        zoomIn.classList.remove("not-allowed");
        zoomOut.classList.remove("not-allowed");
        videoPlayerContainer.removeChild(videoPlayerContainer.lastChild);
        recordBtn.classList.remove("recording");
        videoRecorder.stop();
        isRecording=false;
    }
    else
    {
        zoomIn.classList.add("not-allowed");
        zoomOut.classList.add("not-allowed");
        currZoom=1;
        videoPlayer.style.transform= `scale(${currZoom})`;
        removeFilter();
        filterColor="";
        let recordingOnContainer= document.createElement("div");
        recordingOnContainer.classList.add("recording-on-container");
            
        let recordingOn= document.createElement("div");
        recordingOn.classList.add("recording-on");
        let h3= document.createElement("h3");
    
        recordingOnContainer.appendChild(recordingOn);
        recordingOnContainer.appendChild(h3);
        h3.innerText="REC";
        videoPlayerContainer.appendChild(recordingOnContainer);
        
        recordBtn.classList.add("recording");
        videoRecorder.start();
        isRecording=true;
    }

});

let filterColor="";

captureBtn.addEventListener("click",function()
{
    captureBtn.classList.add("animate-capture");
    
    const canvas= document.createElement("canvas");
    canvas.width= videoPlayer.videoWidth;
    canvas.height= videoPlayer.videoHeight;

    const tool= canvas.getContext("2d");

    tool.translate(canvas.width / 2,canvas.height / 2);
    tool.scale(currZoom,currZoom);
    console.log(currZoom);
    tool.translate(-canvas.width / 2,-canvas.height / 2);
    tool.drawImage(videoPlayer,0,0);
    if(filterColor!="")
    {
        tool.fillStyle=filterColor;
        tool.fillRect(0,0,canvas.width,canvas.height);
    }
    saveMedia(canvas.toDataURL());
    setTimeout(function(){captureBtn.classList.remove("animate-capture");},2000);
});


for (const filter of allFilters) {
    filter.addEventListener("click", function(e)
    {
        if(isRecording) return;
        removeFilter();
        let color= e.currentTarget.style.backgroundColor;
        filterColor=color;
        
        let filterDiv= document.createElement("div");
        filterDiv.classList.add("filter-div");
        filterDiv.style.backgroundColor= color;
        filterDiv.style.backgroundBlendMode= "color-burn";
        videoPlayerContainer.append(filterDiv);

    })
}

galleryBtn.addEventListener("click", function () {
   location.assign("gallery.html"); 
});

const promiseToUseCamera= navigator.mediaDevices.getUserMedia({video:true,audio:true});

promiseToUseCamera
.then(function(mediaStream){
    videoPlayer.srcObject= mediaStream;
    videoRecorder =new MediaRecorder(mediaStream);

    videoRecorder.addEventListener("dataavailable", function(e){
        chunks.push(e.data);
    });

    videoRecorder.addEventListener("stop",function() {
       const blob = new Blob(chunks , {type: "video/mp4"});
       saveMedia(blob);
       chunks=[];
       
    });
})
.catch(function(){
    console.log("user denied access!");
});


function removeFilter()
{
    let previousFilter= document.querySelector(".filter-div");
    if(previousFilter) previousFilter.remove();
}