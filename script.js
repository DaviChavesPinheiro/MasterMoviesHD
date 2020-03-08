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
    const config = getConfig()
    if(!config) return

    var URL_Player1 = config.URL_Player1 || ""
    var URL_Player2 = config.URL_Player2 || ""
    var URLS_player3 = config.URLS_player3 || []
    var tempoDeInicioP3 = config.tempoDeInicioP3 || []

    var rect1;
    var rect2;
    var rect3;
    var rect4;

    var soundIndex;

    var video0;
    var video1;
    var video2;
    var video3 = [];
    var player1;
    var player2;
    var player3 = [];
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

    soundIndex = GetSoundIndex();

    var canvas1 = GetCanvas("canvas1", 10, video0.style.left.replace("px", ""));
    var canvas2 = GetCanvas("canvas2", -10, -5000);
    var ctx1 = canvas1.getContext('2d');
    var ctx2 = canvas2.getContext('2d');

    // video0.style.left = -5000 + "px";
    // video0.controls = false;

    video0.addEventListener('play', Update, 0);
    video0.onplay = PLAY;
    video0.onpause = PAUSE;
    video0.onvolumechange = OnVolumeChange;
    video0.onwaiting = Waiting;
    video0.onseeked = Seeked;

    var m = 0.002;

    window.onYouTubeIframeAPIReady = function () {
        console.log("Window onYouTubeIframeAPIReady")
        player1 = GetPlayer(URL_Player1, Player1_READY, 144, 360, ResiC);
        player2 = GetPlayer(URL_Player2, Player2_READY, 144, 360, ResiC);
        GetVideo1();
        GetVideo2();
        GetTwoSounds();
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

    function GetVideo3(i, lowPlayBackRate) {
        var iframe = document.getElementById(player3[i].getIframe().id);
        iframe.onload = function () {
            video3[i] = (iframe.contentDocument || iframe.contentWindow.document).getElementsByTagName("video")[0];
            if (video3[i]) console.log("Obtained: video3[" + i + "]"); else console.log("Failed: video3[" + i + "]");
            video3[i].index = i;
            video3[i].onwaiting = WaitingPlayer3;
            if (lowPlayBackRate)
                video3[i].playbackRate = 0.07;
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
            try {
                if (Math.abs((video0.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime()) > m) {
                    if ((video0.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime() > 0) {
                        try {
                            video3[soundIndex].playbackRate = video0.playbackRate + Math.min(15, (video0.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime());
                        } catch (erro) { }
                    } else {
                        try {
                            video3[soundIndex].playbackRate = video0.playbackRate + Math.max(-0.93, (video0.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime());
                        } catch (erro) { }
                    }
                } else {
                    try {
                        video3[soundIndex].playbackRate = video0.playbackRate;
                    } catch (erro) { }
                }
            } catch (error) { }
            try {
                if (video0.currentTime >= tempoDeInicioP3[soundIndex + 1]) {
                    if (video0.currentTime < tempoDeInicioP3[soundIndex + 2] || soundIndex + 1 == tempoDeInicioP3.length - 1) {
                        DeleteCurrentSound();
                        soundIndex = GetSoundIndex();
                        ChangeToNextSound();
                    }
                }
            } catch (error) { }
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
        if (player1.getPlayerState() != YT.PlayerState.BUFFERING && player2.getPlayerState() != YT.PlayerState.BUFFERING && player3[soundIndex].getPlayerState() != YT.PlayerState.BUFFERING) {
            player1.playVideo();
            player2.playVideo();
            if (player3[soundIndex]) {
                player3[soundIndex].playVideo();
                player3[soundIndex].setVolume(video0.volume * 100);
            }
        } else {
            video0.pause();
            player1.pauseVideo();
            player2.pauseVideo();
            if (player3[soundIndex])
                player3[soundIndex].pauseVideo();
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
        if (player3[soundIndex]) {
            player3[soundIndex].pauseVideo();
            player3[soundIndex].seekTo(video0.currentTime - tempoDeInicioP3[soundIndex], true);
            player3[soundIndex].setVolume(video0.volume * 100);
        }
        if (video1)
            video1.muted = true;
        if (video2)
            video2.muted = true;
        setTimeout(ResiC, 1000);
        setTimeout(function () { if (video1 && video2) DrawCanvas(); }, 1000);
    }

    function OnVolumeChange() {
        if (player3[soundIndex]) {
            video0.muted = true;
            video1.muted = true;
            video2.muted = true;
            player3[soundIndex].setVolume(video0.volume * 100);
        }
    }

    function Waiting() {
        PAUSE();
    }
    function WaitingPlayer3() {
        if (this.index == soundIndex && !this.dontPauseOnWaiting) {
            PAUSE();
        }
    }

    function Seeked() {
        console.log("Seeked: " + GetSoundIndex() + " " + soundIndex);
        PAUSE();

        var newIndex = GetSoundIndex();
        if (newIndex != soundIndex) {

            DeleteUselessSounds(deleteAllSounds = true);
            console.log("newIndex != soundIndex: soundIndex == " + soundIndex + " " + "newIndex == " + newIndex);
            soundIndex = newIndex;

            GetTwoSounds();
        }

        ResiC();
        if (video1 && video2)
            DrawCanvas();

        console.log("Seeked END");
    }

    function GetSoundIndex() {
        for (var i = 0; i < tempoDeInicioP3.length - 1; i++) {
            if (video0.currentTime >= tempoDeInicioP3[i] && video0.currentTime < tempoDeInicioP3[i + 1]) {
                return i;
            }
        }
        return tempoDeInicioP3.length - 1;
    }

    function DeleteCurrentSound() {
        if (player3[soundIndex]) {
            var url = player3[soundIndex].getIframe().id;
            document.body.removeChild(document.getElementById(url));
            player3[soundIndex] = null;
        }
    }

    function GetTwoSounds() {
        player3[soundIndex] = GetPlayer(URLS_player3[soundIndex], function () { player3[soundIndex].playVideo(); player3[soundIndex].setVolume(0); }, 144, 360);
        player3[soundIndex + 1] = GetPlayer(URLS_player3[soundIndex + 1], function () { player3[soundIndex + 1].playVideo(); player3[soundIndex + 1].setVolume(0); }, 144, 360);
        GetVideo3(soundIndex);
        GetVideo3(soundIndex + 1, true);
        console.log("GetTwoSounds");
    }

    function ChangeToNextSound() {
        video3[soundIndex].playbackRate = video0.playbackRate;
        player3[soundIndex].setVolume(video0.volume * 100);
        video3[soundIndex].dontPauseOnWaiting = true;
        player3[soundIndex].seekTo(video0.currentTime - tempoDeInicioP3[soundIndex], true);
        player3[soundIndex + 1] = GetPlayer(URLS_player3[soundIndex + 1], function () { player3[soundIndex + 1].playVideo(); player3[soundIndex + 1].setVolume(0); }, 144, 360);
        GetVideo3(soundIndex + 1, true);
        PLAY();
    }

    function DeleteUselessSounds(deleteAllSounds) {
        try {
            for (var i = 0; i < tempoDeInicioP3.length; i++) {
                if (i != soundIndex && i != soundIndex + 1 || deleteAllSounds) {
                    if (player3[i] != null) {
                        var url = player3[i].getIframe().id;
                        try {
                            document.body.removeChild(document.getElementById(url));
                            player3[i] = null;
                        } catch (error) { }
                    }
                }
            }
        } catch (error) { }

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
}

function getConfig(){
    const description = document.querySelector("#description").textContent
    if(!description) return ""
    const config = description.split('[[[')[1].split("]]]")[0]
    try {
        return JSON.parse(config)
    } catch (error) {
        console.log("ERROR: Informações de configuração não encontradas na descrição.")
        return ""
    } 
}