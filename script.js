const recordBtn= document.getElementById("record");
const captureBtn= document.getElementById("capture");
const videoPlayer= document.querySelector("video");
const container= document.querySelector(".container");
let chunks= [];
let videoRecorder;

let isRecording= false;
console.log(videoPlayer);
captureBtn.addEventListener("click",function()
{
    const canvas= document.createElement("canvas");
    canvas.width= videoPlayer.videoWidth;
    canvas.height= videoPlayer.videoHeight;

    const tool= canvas.getContext("2d");
    tool.drawImage(videoPlayer,0,0);
    download(canvas.toDataURL(), "img.png");
});

recordBtn.addEventListener("click", function()
{
    if(isRecording) 
    {
        videoRecorder.stop();
        isRecording=false;
    }
    else
    {
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