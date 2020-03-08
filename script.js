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
    if (!canvas) {
        decode()
    } else {
        canvas.classList.toggle("hidden")
    }
}

function decode() {
    var URL_Player1 = "KSw37-FGRXY";
    var URL_Player2 = "YcVaIl2u3Fc";
    // var URLS_player3 = ["i9RJXgYBwWw", "gbuiF1Mfaqs", "Eix4yK52tnk", "Z2u-vjReuxA", "0PhlC81gLL4", "ehabhAQdkD4", "ZXh3-MPPjZE", "rwY2eLY0X-c", "exj9fH3Gm-c", "ShpJvAO5AAE", "dX3rWRXFj2I", "eOVM2AhfWaY", "SuJEWt7PC7Y", "0BqUYg2q1_8", "gEb8kE4xs3Q", "-mnpLci8JDY", "bkZV8qVS86A", "jxf4fToKMlg", "F6xc6WSocJ0", "9q98rLTsdGw", "3fSaxNNJIt8", "ye2RkbJCK4Y", "cphHXGA90BI", "kxEjiGn6Hvk", "8IFyclCUa2I", "pj-6-Vis8Bc", "3Uww_vi_b18", "RMG9LzMCefc", "yn6D5pfIwtQ", "sbxoHZA8nGQ", "1hTSl21Z7bo"];
    // var tempoDeInicioP3 = [60 * 5 * 0, 60 * 5 * 1, 60 * 5 * 2, 60 * 5 * 3, 60 * 5 * 4, 60 * 5 * 5, 60 * 5 * 6, 60 * 5 * 7, 60 * 5 * 8, 60 * 5 * 9, 60 * 5 * 10, 60 * 5 * 11, 60 * 5 * 12, 60 * 5 * 13, 60 * 5 * 14, 60 * 5 * 15, 60 * 5 * 16, 60 * 5 * 17, 60 * 5 * 18, 60 * 5 * 19, 60 * 5 * 20, 60 * 5 * 21, 60 * 5 * 22, 60 * 5 * 23, 60 * 5 * 24, 60 * 5 * 25, 60 * 5 * 26, 60 * 5 * 27, 60 * 5 * 28, 60 * 5 * 29, 60 * 5 * 30];
    
    var rect1;
    var rect2;
    var rect3;
    var rect4;

    var video0;
    var video1;
    var video2;
    var player1;
    var player2;
    var iframe1, iframe2;
    GetVideo0();

    if (video0.currentTime < 60 * 1 + 30)
        video0.currentTime = 0;

    var container = video0.parentElement.parentElement.parentElement;

    var cHeigth = video0.clientHeight;
    var cWidth = video0.clientWidth;
    var vHeigth = video0.videoHeight;
    var vWidth = video0.videoWidth;
    var v1Heigth = video0.videoHeight;
    var v1Width = video0.videoWidth;
    var v2Heigth = video0.videoHeight;
    var v2Width = video0.videoWidth;

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var canvas1 = GetCanvas("canvas1", 10, video0.style.left.replace("px", ""));
    var canvas2 = GetCanvas("canvas2", -10, -5000);
    var ctx1 = canvas1.getContext('2d');
    var ctx2 = canvas2.getContext('2d');

    // video0.style.left = -5000 + "px";
    // video0.controls = false;

    video0.addEventListener('play', Update, 0);
    video0.onplay = PLAY;
    video0.onpause = PAUSE;
    // video0.onvolumechange = OnVolumeChange;
    video0.onwaiting = Waiting;
    video0.onseeked = Seeked;

    var m = 0.002;

    window.onYouTubeIframeAPIReady = function () {
        console.log("Window onYouTubeIframeAPIReady")
        player1 = GetPlayer(URL_Player1, Player1_READY, 144, 360, ResiC);
        player2 = GetPlayer(URL_Player2, Player2_READY, 144, 360, ResiC);
        GetVideo1();
        GetVideo2();
    }


    function GetPlayer(id, onReadyFunction, heightP = cHeigth, widthP = cWidth, onPlayerPlaybackQualityChange) {
        CreateNewDiv(id);
        return new YT.Player(id, {
            height: heightP,
            width: widthP,
            videoId: id,
            playerVars: { 'controls': 1, 'related': 0, 'keyboard': 0, 'showinfo': 0, 'autoplay': 1 },
            events: {
                'onReady': onReadyFunction,
                'onPlaybackQualityChange': onPlayerPlaybackQualityChange
            }
        });
    }


    function GetVideo0() {
        video0 = document.getElementsByTagName("video")[0];
        video0.muted = true;
    }

    function GetVideo1() {
        iframe1 = document.getElementById(URL_Player1);
        iframe1.onload = function () {
            video1 = (iframe1.contentDocument || iframe1.contentWindow.document).getElementsByTagName("video")[0];
            if (video1) console.log("Obtained: video1"); else console.log("Failed: video1");
            video1.onwaiting = Waiting;
            v1Heigth = video1.videoHeight;
            v1Width = video1.videoWidth;
            ResiC();
            video1.onseeked = function () { if (video1 && video2) DrawCanvas(); };
            video1.muted = true;
            player1.playVideo();
        }
    }

    function GetVideo2() {
        iframe2 = document.getElementById(URL_Player2);
        iframe2.onload = function () {
            video2 = (iframe2.contentDocument || iframe2.contentWindow.document).getElementsByTagName("video")[0];
            if (video2) console.log("Obtained: video2"); else console.log("Failed: video2");
            video2.onwaiting = Waiting;
            v2Heigth = video2.videoHeight;
            v2Width = video2.videoWidth;
            ResiC();
            video2.onseeked = function () { if (video1 && video2) DrawCanvas(); };
            video2.muted = true;
            player2.playVideo();
        }
    }

    function Player1_READY() {
        console.log("Player 1 Ready");
        player1.playVideo();
    }

    function Player2_READY() {
        console.log("Player 2 Ready");
        player2.playVideo();
    }

    function GetCanvas(id, zPosition, xPosition) {
        var canvas;
        canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.width = cWidth;
        canvas.height = cHeigth;
        video0.parentElement.appendChild(canvas);
        canvas.style.zIndex = zPosition;
        canvas.style.position = "relative";
        canvas.style.left = xPosition + "px";
        return canvas;
    }

    function CreateNewDiv(id) {
        var div;
        div = document.createElement("div");
        div.id = id;
        div.style.zIndex = -10;
        div.style.position = "absolute";
        div.style.marginTop = 0 + 'px';
        div.style.left = -5000 + "px";
        document.body.appendChild(div);
    }


    function DrawCanvas() {
        ctx2.drawImage(video2, rect1[0], rect1[1], rect1[2], rect1[3], rect1[4], rect1[5], rect1[6], rect1[7]);
        ctx2.drawImage(video1, rect2[0], rect2[1], rect2[2], rect2[3], rect2[4], rect2[5], rect2[6], rect2[7]);
        ctx2.drawImage(video2, rect3[0], rect3[1], rect3[2], rect3[3], rect3[4], rect3[5], rect3[6], rect3[7]);
        ctx2.drawImage(video1, rect4[0], rect4[1], rect4[2], rect4[3], rect4[4], rect4[5], rect4[6], rect4[7]);
        ctx1.drawImage(canvas2, 0, 0, canvas2.clientWidth, canvas2.clientHeight, 0, 0, canvas1.clientWidth, canvas1.clientHeight);
    }

    function ResiC() {
        canvas1.style.top = video0.style.top;
        canvas1.style.left = container.clientWidth / 2 - canvas1.clientWidth / 2 + "px";
        canvas2.width = canvas1.width = cWidth = video0.clientWidth;
        canvas2.height = canvas1.height = cHeigth = video0.clientHeight;
        vHeigth = video0.videoHeight;
        vWidth = video0.videoWidth;
        if (video1) {
            v1Heigth = video1.videoHeight; v1Width = video1.videoWidth;
        }
        if (video2) {
            v2Heigth = video2.videoHeight; v2Width = video2.videoWidth;
        }
        rect1 = [0, 0, Math.ceil(v2Width / 2), Math.ceil(v2Heigth / 2), Math.floor(cWidth / 2), Math.floor(cHeigth / 2), Math.ceil(cWidth / 2), Math.ceil(cHeigth / 2)];
        rect2 = [Math.ceil(v1Width / 2), 0, Math.floor(v1Width / 2), Math.ceil(v1Heigth / 2), 0, Math.floor(cHeigth / 2), Math.floor(cWidth / 2), Math.ceil(cHeigth / 2)];
        rect3 = [0, Math.ceil(v2Heigth / 2), Math.ceil(v2Width / 2), Math.floor(v2Heigth / 2), Math.floor(cWidth / 2), 0, Math.ceil(cWidth / 2), Math.floor(cHeigth / 2)];
        rect4 = [Math.ceil(v1Width / 2), Math.ceil(v1Heigth / 2), Math.floor(v1Width / 2), Math.floor(v1Heigth / 2), 0, 0, Math.floor(cWidth / 2), Math.floor(cHeigth / 2)];
    }

    function Update() {
        if (!(video0.paused || video0.ended)) {
            DrawCanvas();
            if (Math.abs(video0.currentTime - player1.getCurrentTime()) > m) {
                if (video0.currentTime - player1.getCurrentTime() > 0) {
                    video1.playbackRate = video0.playbackRate + Math.min(15, video0.currentTime - player1.getCurrentTime());
                } else {
                    video1.playbackRate = video0.playbackRate + Math.max(-0.93, video0.currentTime - player1.getCurrentTime());
                }
            } else {
                video1.playbackRate = video0.playbackRate;
            }
            if (Math.abs(video0.currentTime - player2.getCurrentTime()) > m) {

                if (video0.currentTime - player2.getCurrentTime() > 0) {
                    video2.playbackRate = video0.playbackRate + Math.min(15, video0.currentTime - player2.getCurrentTime());
                } else {
                    video2.playbackRate = video0.playbackRate + Math.max(-0.93, video0.currentTime - player2.getCurrentTime());
                }
            } else {
                video2.playbackRate = video0.playbackRate;
            }
            
            if (video0.clientWidth != cWidth) {
                video0.style.left = -5000 + "px";
                ResiC();
            }
            if (video0.videoHeight != vHeigth || video2.videoHeight != v2Heigth || video1.videoHeight != v1Heigth) {
                ResiC();
            }
            setTimeout(Update, 1000 / 30.0);
        }
    }

    function PLAY() {
        if (player1.getPlayerState() != YT.PlayerState.BUFFERING && player2.getPlayerState() != YT.PlayerState.BUFFERING) {
            player1.playVideo();
            player2.playVideo();
        } else {
            video0.pause();
            player1.pauseVideo();
            player2.pauseVideo();
        }

    }

    function PAUSE() {
        video0.pause();
        video0.muted = true;
        if (player1) {
            player1.pauseVideo();
            player1.seekTo(video0.currentTime, true);
        }
        if (player2) {
            player2.pauseVideo();
            player2.seekTo(video0.currentTime, true);
        }
        if (video1)
            video1.muted = true;
        if (video2)
            video2.muted = true;
        setTimeout(ResiC, 1000);
        setTimeout(function () { if (video1 && video2) DrawCanvas(); }, 1000);
    }

    function Waiting() {
        PAUSE();
    }

    function Seeked() {
        PAUSE();

        ResiC();
        if (video1 && video2)
            DrawCanvas();

        console.log("Seeked END");
    }

    document.addEventListener("fullscreenchange", function () {
        setTimeout(ResiC, 1000);
    }, false);

    document.addEventListener("msfullscreenchange", function () {
        setTimeout(ResiC, 1000);
    }, false);

    document.addEventListener("mozfullscreenchange", function () {
        setTimeout(ResiC, 1000);
    }, false);

    document.addEventListener("webkitfullscreenchange", function () {
        setTimeout(ResiC, 1000);
    }, false);

    document.getElementsByClassName("ytp-button ytp-settings-button")[0].onclick = function () {
        setTimeout(function () {
            document.getElementsByClassName("ytp-menuitem")[document.getElementsByClassName("ytp-menuitem").length - 1].onclick = function () {
                setTimeout(function () {
                    for (var i = 0; i < document.getElementsByClassName("ytp-menuitem-label").length; i++) {
                        document.getElementsByClassName("ytp-menuitem-label")[i].index = i;
                        document.getElementsByClassName("ytp-menuitem-label")[i].onclick = function () { setTimeout(ChangeQuality(this.index), 300); };
                    }
                }, 400);
            };
        }, 400);
    };

    function ChangeQuality(i) {
        var iframe1 = document.getElementById(URL_Player1);
        var iframe2 = document.getElementById(URL_Player2);

        (iframe1.contentDocument || iframe1.contentWindow.document).getElementsByClassName("ytp-button ytp-settings-button")[0].click();
        (iframe1.contentDocument || iframe1.contentWindow.document).getElementsByClassName("ytp-menuitem")[(iframe1.contentDocument || iframe1.contentWindow.document).getElementsByClassName("ytp-menuitem").length - 1].click();

        setTimeout(function () {
            (iframe1.contentDocument || iframe1.contentWindow.document).getElementsByClassName("ytp-menuitem-label")[i].click();
        }, 400);
        setTimeout(function () {
            (iframe2.contentDocument || iframe2.contentWindow.document).getElementsByClassName("ytp-button ytp-settings-button")[0].click();
            (iframe2.contentDocument || iframe2.contentWindow.document).getElementsByClassName("ytp-menuitem")[(iframe2.contentDocument || iframe2.contentWindow.document).getElementsByClassName("ytp-menuitem").length - 1].click();

            setTimeout(function () {
                (iframe2.contentDocument || iframe2.contentWindow.document).getElementsByClassName("ytp-menuitem-label")[i].click();
            }, 400);
        }, 500);
    }



    // var videoContainer = document.getElementsByClassName("html5-video-container")[0];
    // var video = document.getElementsByTagName("video")[0];

    // var cHeigth = video.clientHeight;
    // var cWidth = video.clientWidth;
    // var vHeigth = video.videoHeight;
    // var vWidth = video.videoWidth;

    // var drawImgRect1, drawImgRect2, drawImgRect3, drawImgRect4;

    // var canvas;
    // GetCanvas();

    // var _back = document.createElement('canvas');
    // var backcontext = _back.getContext('2d');

    // video.onplay = onPlay;
    // video.onpause = onPause;
    // video.onresize = ReSizeCanvas;

    // var ctx = canvas.getContext('2d');
    // var idata;
    // var data;

    // var videoInterval;
    // ReSizeCanvas();
    // onPlay()

    // function update(){
    //     ctx.drawImage(video, drawImgRect1[0], drawImgRect1[1], drawImgRect1[2], drawImgRect1[3], drawImgRect1[4], drawImgRect1[5], drawImgRect1[6], drawImgRect1[7]);
    //     ctx.drawImage(video, drawImgRect2[0], drawImgRect2[1], drawImgRect2[2], drawImgRect2[3], drawImgRect2[4], drawImgRect2[5], drawImgRect2[6], drawImgRect2[7]);
    //     ctx.drawImage(video, drawImgRect3[0], drawImgRect3[1], drawImgRect3[2], drawImgRect3[3], drawImgRect3[4], drawImgRect3[5], drawImgRect3[6], drawImgRect3[7]);
    //     ctx.drawImage(video, drawImgRect4[0], drawImgRect4[1], drawImgRect4[2], drawImgRect4[3], drawImgRect4[4], drawImgRect4[5], drawImgRect4[6], drawImgRect4[7]);
    // }


    // function onPlay() {
    //     console.log('play')
    //     ReSizeCanvas();
    //     clearInterval(videoInterval)
    //     videoInterval = setInterval(update, 1000 / 30.0)
    // }

    // function onPause() {
    //     console.log('pause')
    //     clearInterval(videoInterval)

    //     ReSizeCanvas();
    // }

    // function GetCanvas() {
    //     canvas = document.createElement('canvas');
    //     canvas.id = "canvas";
    //     canvas.width = cWidth;
    //     canvas.height = cHeigth;
    //     videoContainer.appendChild(canvas);
    //     canvas.style.zIndex = 10;
    //     canvas.style.position = "relative";
    //     canvas.style.left = video.style.left;
    // }

    // function ReSizeCanvas() {
    //     canvas.width = cWidth = video.clientWidth;
    //     canvas.height = cHeigth = video.clientHeight;
    //     vHeigth = video.videoHeight;
    //     vWidth = video.videoWidth;
    //     _back.width = cWidth;
    //     _back.height = cHeigth;
    //     canvas.style.left = video.style.left;

    //     console.log(cWidth, cHeigth, vWidth, vHeigth)
    //     drawImgRect1 = [0, 0, Math.ceil(vWidth / 2),  Math.ceil(vHeigth / 2), Math.floor(cWidth / 2 ), Math.floor(cHeigth / 2), Math.ceil(cWidth / 2), Math.ceil(cHeigth / 2)];
    //     drawImgRect2 = [Math.ceil(vWidth / 2), 0, Math.floor(vWidth / 2), Math.ceil(vHeigth / 2), 0, Math.floor(cHeigth / 2) , Math.floor(cWidth / 2), Math.ceil(cHeigth / 2)];
    //     drawImgRect3 = [0, Math.ceil(vHeigth / 2), Math.ceil(vWidth / 2), Math.floor(vHeigth / 2), Math.floor(cWidth / 2), 0 , Math.ceil(cWidth / 2), Math.floor(cHeigth / 2)];
    //     drawImgRect4 = [Math.ceil(vWidth / 2), Math.ceil(vHeigth / 2), Math.floor(vWidth / 2), Math.floor(vHeigth / 2), 0, 0, Math.floor(cWidth / 2), Math.floor(cHeigth / 2)];

    //     update()
    // }
}