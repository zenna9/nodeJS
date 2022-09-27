const socket = io();

const myFace = document.getElementById("myFace");
console.log(myFace);
let myStream;

async function getMedia(){
    try{
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video:{ width: 1280, height: 720 }
        });
        console.log(myStream);
        const forEveryone = document.querySelector("#forEveryone")
        forEveryone.innerHTML = myStream
    }catch(e){
        const forEveryone = document.querySelector("#forEveryone")
        forEveryone.innerHTML = e
        console.log(e);
    }
}
getMedia();
