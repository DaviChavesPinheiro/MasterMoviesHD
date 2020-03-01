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

    var drawImgRect1, drawImgRect2, drawImgRect3, drawImgRect4;

    var canvas;
    GetCanvas();

    var _back = document.createElement('canvas');
    var backcontext = _back.getContext('2d');

    video.onplay = onPlay;
    video.onpause = onPause;
    video.onresize = ReSizeCanvas;

    var ctx = canvas.getContext('2d');
    var idata;
    var data;

    var videoInterval;
    ReSizeCanvas();
    onPlay()
    
    function update(){
        ctx.drawImage(video, drawImgRect1[0], drawImgRect1[1], drawImgRect1[2], drawImgRect1[3], drawImgRect1[4], drawImgRect1[5], drawImgRect1[6], drawImgRect1[7]);
        ctx.drawImage(video, drawImgRect2[0], drawImgRect2[1], drawImgRect2[2], drawImgRect2[3], drawImgRect2[4], drawImgRect2[5], drawImgRect2[6], drawImgRect2[7]);
        ctx.drawImage(video, drawImgRect3[0], drawImgRect3[1], drawImgRect3[2], drawImgRect3[3], drawImgRect3[4], drawImgRect3[5], drawImgRect3[6], drawImgRect3[7]);
        ctx.drawImage(video, drawImgRect4[0], drawImgRect4[1], drawImgRect4[2], drawImgRect4[3], drawImgRect4[4], drawImgRect4[5], drawImgRect4[6], drawImgRect4[7]);
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
        _back.width = cWidth;
        _back.height = cHeigth;
        canvas.style.left = video.style.left;

        console.log(cWidth, cHeigth, vWidth, vHeigth)
        drawImgRect1 = [0, 0, Math.ceil(vWidth / 2),  Math.ceil(vHeigth / 2), Math.floor(cWidth / 2 ), Math.floor(cHeigth / 2), Math.ceil(cWidth / 2), Math.ceil(cHeigth / 2)];
        drawImgRect2 = [Math.ceil(vWidth / 2), 0, Math.floor(vWidth / 2), Math.ceil(vHeigth / 2), 0, Math.floor(cHeigth / 2) , Math.floor(cWidth / 2), Math.ceil(cHeigth / 2)];
        drawImgRect3 = [0, Math.ceil(vHeigth / 2), Math.ceil(vWidth / 2), Math.floor(vHeigth / 2), Math.floor(cWidth / 2), 0 , Math.ceil(cWidth / 2), Math.floor(cHeigth / 2)];
        drawImgRect4 = [Math.ceil(vWidth / 2), Math.ceil(vHeigth / 2), Math.floor(vWidth / 2), Math.floor(vHeigth / 2), 0, 0, Math.floor(cWidth / 2), Math.floor(cHeigth / 2)];
        
        update()
    }
}