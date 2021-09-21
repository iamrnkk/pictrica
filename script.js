const recordBtn= document.getElementById("record");
const captureBtn= document.getElementById("capture");
const videoPlayer= document.querySelector("video");
const container= document.querySelector(".container");
const videoPlayerContainer= document.querySelector(".video-container");
const allFilters= document.querySelectorAll(".filter"); 
let filterColor;

let chunks= [];
let videoRecorder;

let isRecording= false;

captureBtn.addEventListener("click",function()
{
    captureBtn.classList.add("animate-capture");
    const canvas= document.createElement("canvas");
    canvas.width= videoPlayer.videoWidth;
    canvas.height= videoPlayer.videoHeight;

    const tool= canvas.getContext("2d");
    tool.drawImage(videoPlayer,0,0);
    if(filterColor!="")
    {
        tool.fillStyle=filterColor;
        tool.fillRect(0,0,canvas.width,canvas.height);
    }
    download(canvas.toDataURL(), "img.png");
    setTimeout(function(){captureBtn.classList.remove("animate-capture");},2000);
});

recordBtn.addEventListener("click", function()
{
    
    if(isRecording) 
    {
        videoPlayerContainer.removeChild(videoPlayerContainer.lastChild);
        recordBtn.classList.remove("recording");
        videoRecorder.stop();
        isRecording=false;
    }
    else
    {
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

for (const filter of allFilters) {
    filter.addEventListener("click", function(e)
    {
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
       chunks=[];
       
       const link = URL.createObjectURL(blob);
       download(link,"video.mp4");
    });
})
.catch(function(){
    console.log("user denied access!");
});


function download(link,name){
    const a=  document.createElement("a");
    a.href= link;
    a.download = name;
    a.click();
    a.remove();
}

function removeFilter()
{
    let previousFilter= document.querySelector(".filter-div");
    if(previousFilter) previousFilter.remove();
}