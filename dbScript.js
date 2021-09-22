let req= indexedDB.open("gallery",1);
let db;
req.addEventListener("success",function () {
    db= req.result;
    console.log("connection established!");
});

req.addEventListener("upgradeneeded",function () {
    db= req.result;
    db.createObjectStore("media",{keyPath: "id"});
});

req.addEventListener("error",function (error) {
    console.log(error);    
});

const galleryContainer= document.querySelector(".gallery-container");

function saveMedia(media) 
{

    if(!db) return;
    const data= {
        id: Date.now(),
        mediaData: media
    };

    const tx= db.transaction("media","readwrite");
    const mediaObjectStore= tx.objectStore("media");
    mediaObjectStore.add(data);
    
}

let mediaCount=0;
function viewMedia()
{

    if(!db) return;
    
    const tx= db.transaction("media","readonly");
    const mediaObjectStore= tx.objectStore("media");

    let req= mediaObjectStore.openCursor();

    req.addEventListener("success",function(){
        
        let cursor= req.result;
        if(cursor)
        {
            mediaCount+=1;
            const mediaCard = document.createElement("div");
            mediaCard.classList.add("media-card");
            mediaCard.innerHTML=`<div class="media-container"></div>
                                <div class="material-icons media-option download">download</div>
                                <div class="material-icons media-option delete" data-id="${cursor.value.id}">delete</div>`;
            galleryContainer.append(mediaCard);
            
            const mediaContainer = mediaCard.querySelector(".media-container");
            const downloadBtn= mediaCard.querySelector(".download");
            const deleteBtn= mediaCard.querySelector(".delete");


            deleteBtn.addEventListener("click",function(e){
                mediaCard.remove();
                const id=Number(e.currentTarget.getAttribute("data-id"));
                deleteMedia(id);
            })

            const data= cursor.value.mediaData;
            const type= typeof data;
            if( type === 'string')
            {
                const image= document.createElement("img");
                image.src= data;
                mediaContainer.append(image);

                downloadBtn.addEventListener("click",function(){ download(data, "image.png"); });
            }
            else
            { 
                const video= document.createElement("video");
                video.src= URL.createObjectURL(data);
                video.controls=true;
                video.muted=true;
                mediaContainer.append(video);
                downloadBtn.addEventListener("click",function(){ download(video.src, "video.mp4"); });
            }
            cursor.continue();
        }
        if(mediaCount==0)galleryContainer.innerHTML= `<div class="media-option" style="cursor: default">Oops! looks like there's no media present.</div>`;
    });

}

function deleteMedia(id) 
{
    const tx= db.transaction("media", "readwrite");
    const mediaObjectStore= tx.objectStore("media");
    mediaObjectStore.delete(id);
    mediaCount-=1;
    if(mediaCount==0)galleryContainer.innerHTML= `<div class="media-option" style="cursor: default">Oops! looks like there's no media present.</div>`;
}

function download(link,name){
    const a= document.createElement("a");
    a.href= link;
    a.download = name;
    a.click();
    a.remove();
}