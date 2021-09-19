const recordBtn= document.getElementById("record");
const captureBtn= document.getElementById("capture");
const videoPlayer= document.querySelector("video");
const container= document.querySelector(".container");
const videoPlayerContainer= document.querySelector(".video-container");

let chunks= [];
let videoRecorder;

let isRecording= false;
console.log(videoPlayerContainer);
captureBtn.addEventListener("click",function()
{
    captureBtn.classList.add("animate-capture");
    const canvas= document.createElement("canvas");
    canvas.width= videoPlayer.videoWidth;
    canvas.height= videoPlayer.videoHeight;

    const tool= canvas.getContext("2d");
    tool.drawImage(videoPlayer,0,0);
    download(canvas.toDataURL(), "img.png");
    setTimeout(function(){captureBtn.classList.remove("animate-capture");},2000);
});

recordBtn.addEventListener("click", function()
{
    
    if(isRecording) 
    {
        //console.log(recordingOnContainer.parentNode);
        
        videoPlayerContainer.removeChild(videoPlayerContainer.lastChild);
        recordBtn.classList.remove("recording");
        videoRecorder.stop();
        isRecording=false;
    }
    else
    {
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