window.onload = () => {
    const button = document.createElement("button")
    button.id = "decodeBtn"
    button.textContent = "DECODIFICAR"
    button.addEventListener("click", buttonClicked)
    document.querySelector(".ytp-chrome-controls .ytp-right-controls").prepend(button)
}

function buttonClicked() {
    const button = document.querySelector("#decodeBtn")
    button.classList.toggle("decoded")
    const canvas = document.querySelector("#canvas")
    if(!canvas){
        decode()
    } else{
        canvas.classList.toggle("hidden")
    }
}

function decode() {
    var videoContainer = document.getElementsByClassName("html5-video-container")[0];
    var video = document.getElementsByTagName("video")[0];

    var cHeigth = video.clientHeight;
    var cWidth = video.clientWidth;
    var vHeigth = video.videoHeight;
    var vWidth = video.videoWidth;

    var canvas;
    GetCanvas();

    var back = document.createElement('canvas');
    var backcontext = back.getContext('2d');

    video.onplay = onPlay;
    video.onpause = onPause;
    video.onresize = ReSizeCanvas;

    var ctx = canvas.getContext('2d');
    var drawImgRect1;
    var drawImgRect2;
    var drawImgRect3;
    var drawImgRect4;
    var idata;
    var data;

    var videoInterval;
    ReSizeCanvas();
    onPlay()
    
    function update(){
        backcontext.drawImage(video, 0, 0, cWidth, cHeigth)
        idata = backcontext.getImageData(0,0,cWidth,cHeigth);
        data = idata.data;
        const sizeBy2 = data.length / 2;
        for(var i = 0; i < sizeBy2; i+=4) {
            [data[i], data[i + sizeBy2]] = [data[i + sizeBy2], data[i]];
            [data[i + 1], data[i + 1 + sizeBy2]] = [data[i + 1 + sizeBy2], data[i + 1]];
            [data[i + 2], data[i + 2 + sizeBy2]] = [data[i + 2 + sizeBy2], data[i + 2]];
        }
        idata.data = data;
        ctx.putImageData(idata,0,0);
    }


    function onPlay() {
        console.log('play')
        ReSizeCanvas();
        clearInterval(videoInterval)
        videoInterval = setInterval(update, 1000 / 30.0)
    }

    function onPause() {
        console.log('pause')
        clearInterval(videoInterval)

        ReSizeCanvas();
    }

    function GetCanvas() {
        canvas = document.createElement('canvas');
        canvas.id = "canvas";
        canvas.width = cWidth;
        canvas.height = cHeigth;
        videoContainer.appendChild(canvas);
        canvas.style.zIndex = 10;
        canvas.style.position = "relative";
        canvas.style.left = video.style.left;
    }

    function ReSizeCanvas() {
        canvas.width = cWidth = video.clientWidth;
        canvas.height = cHeigth = video.clientHeight;
        vHeigth = video.videoHeight;
        vWidth = video.videoWidth;
        back.width = cWidth;
        back.height = cHeigth;
        canvas.style.left = video.style.left;

        console.log(cWidth, cHeigth, vWidth, vHeigth)
    }
}