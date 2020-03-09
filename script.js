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

    const URL_Player1 = config.URL_Player1 || ""
    const URL_Player2 = config.URL_Player2 || ""
    const URLS_player3 = config.URLS_player3 || []
    const tempoDeInicioP3 = config.tempoDeInicioP3 || []

    var rect1, rect2, rect3, rect4;

    var soundIndex;

    const mainVideo = getMainVideo();
    var videoA, videoB;
    var video3 = [];
    var playerA, playerB;
    var player3 = [];
    var iframe1, iframe2;

    if (mainVideo.currentTime < 60 * 1 + 30)
        mainVideo.currentTime = 0;

    var container = document.querySelector("#container")

    var cHeigth = mainVideo.clientHeight;
    var cWidth = mainVideo.clientWidth;
    var vHeigth = mainVideo.videoHeight;
    var vWidth = mainVideo.videoWidth;
    var v1Heigth = mainVideo.videoHeight;
    var v1Width = mainVideo.videoWidth;
    var v2Heigth = mainVideo.videoHeight;
    var v2Width = mainVideo.videoWidth;

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    soundIndex = GetSoundIndex();

    var canvas = GetCanvas("canvas", 10);
    var ctx1 = canvas.getContext('2d');

    mainVideo.addEventListener('play', Update, 0);
    mainVideo.onplay = play;
    mainVideo.onpause = pause;
    mainVideo.onvolumechange = volumeChange;
    mainVideo.waiting = waiting;
    mainVideo.onseeked = seeked;

    var m = 0.002;

    window.onYouTubeIframeAPIReady = function () {
        console.log("Window onYouTubeIframeAPIReady")
        playerA = GetPlayer(URL_Player1, Player1_READY, 144, 360, ResiC);
        playerB = GetPlayer(URL_Player2, Player2_READY, 144, 360, ResiC);
        getVideoA();
        getVideoB();
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


    function getMainVideo() {
        const video = document.getElementsByTagName("video")[0];
        video.muted = true;
        return video
    }

    function getVideoA() {
        iframe1 = document.getElementById(URL_Player1);
        iframe1.onload = function () {
            videoA = (iframe1.contentDocument || iframe1.contentWindow.document).getElementsByTagName("video")[0];
            if (videoA) console.log("Obtained: videoA"); else console.log("Failed: videoA");
            videoA.waiting = waiting;
            v1Heigth = videoA.videoHeight;
            v1Width = videoA.videoWidth;
            ResiC();
            videoA.onseeked = function () { if (videoA && videoB) DrawCanvas(); };
            videoA.muted = true;
            playerA.playVideo();
        }
    }

    function getVideoB() {
        iframe2 = document.getElementById(URL_Player2);
        iframe2.onload = function () {
            videoB = (iframe2.contentDocument || iframe2.contentWindow.document).getElementsByTagName("video")[0];
            if (videoB) console.log("Obtained: videoB"); else console.log("Failed: videoB");
            videoB.waiting = waiting;
            v2Heigth = videoB.videoHeight;
            v2Width = videoB.videoWidth;
            ResiC();
            videoB.onseeked = function () { if (videoA && videoB) DrawCanvas(); };
            videoB.muted = true;
            playerB.playVideo();
        }
    }

    function GetVideo3(i, lowPlayBackRate) {
        var iframe = document.getElementById(player3[i].getIframe().id);
        iframe.onload = function () {
            video3[i] = (iframe.contentDocument || iframe.contentWindow.document).getElementsByTagName("video")[0];
            if (video3[i]) console.log("Obtained: video3[" + i + "]"); else console.log("Failed: video3[" + i + "]");
            video3[i].index = i;
            video3[i].waiting = onwaitingPlayer3;
            if (lowPlayBackRate)
                video3[i].playbackRate = 0.07;
        }
    }

    function Player1_READY() {
        console.log("Player 1 Ready");
        playerA.playVideo();
    }

    function Player2_READY() {
        console.log("Player 2 Ready");
        playerB.playVideo();
    }

    function GetCanvas(id, zIndex=0) {
        const canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.width = cWidth;
        canvas.height = cHeigth;
        mainVideo.parentElement.appendChild(canvas);
        canvas.style.zIndex = zIndex;
        canvas.style.position = "relative";
        canvas.style.left = mainVideo.style.left;
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
        ctx1.drawImage(videoB, rect1[0], rect1[1], rect1[2], rect1[3], rect1[4], rect1[5], rect1[6], rect1[7]);
        ctx1.drawImage(videoA, rect2[0], rect2[1], rect2[2], rect2[3], rect2[4], rect2[5], rect2[6], rect2[7]);
        ctx1.drawImage(videoB, rect3[0], rect3[1], rect3[2], rect3[3], rect3[4], rect3[5], rect3[6], rect3[7]);
        ctx1.drawImage(videoA, rect4[0], rect4[1], rect4[2], rect4[3], rect4[4], rect4[5], rect4[6], rect4[7]);
    }

    function ResiC() {
        canvas.style.top = mainVideo.style.top;
        canvas.style.left = container.clientWidth / 2 - canvas.clientWidth / 2 + "px";
        canvas.width = cWidth = mainVideo.clientWidth;
        canvas.height = cHeigth = mainVideo.clientHeight;
        vHeigth = mainVideo.videoHeight;
        vWidth = mainVideo.videoWidth;
        if (videoA) {
            v1Heigth = videoA.videoHeight; v1Width = videoA.videoWidth;
        }
        if (videoB) {
            v2Heigth = videoB.videoHeight; v2Width = videoB.videoWidth;
        }
        rect1 = [0, 0, Math.ceil(v2Width / 2), Math.ceil(v2Heigth / 2), Math.floor(cWidth / 2), Math.floor(cHeigth / 2), Math.ceil(cWidth / 2), Math.ceil(cHeigth / 2)];
        rect2 = [Math.ceil(v1Width / 2), 0, Math.floor(v1Width / 2), Math.ceil(v1Heigth / 2), 0, Math.floor(cHeigth / 2), Math.floor(cWidth / 2), Math.ceil(cHeigth / 2)];
        rect3 = [0, Math.ceil(v2Heigth / 2), Math.ceil(v2Width / 2), Math.floor(v2Heigth / 2), Math.floor(cWidth / 2), 0, Math.ceil(cWidth / 2), Math.floor(cHeigth / 2)];
        rect4 = [Math.ceil(v1Width / 2), Math.ceil(v1Heigth / 2), Math.floor(v1Width / 2), Math.floor(v1Heigth / 2), 0, 0, Math.floor(cWidth / 2), Math.floor(cHeigth / 2)];
    }

    function Update() {
        if (!(mainVideo.paused || mainVideo.ended)) {
            DrawCanvas();
            if (Math.abs(mainVideo.currentTime - playerA.getCurrentTime()) > m) {
                if (mainVideo.currentTime - playerA.getCurrentTime() > 0) {
                    videoA.playbackRate = mainVideo.playbackRate + Math.min(15, mainVideo.currentTime - playerA.getCurrentTime());
                } else {
                    videoA.playbackRate = mainVideo.playbackRate + Math.max(-0.93, mainVideo.currentTime - playerA.getCurrentTime());
                }
            } else {
                videoA.playbackRate = mainVideo.playbackRate;
            }
            if (Math.abs(mainVideo.currentTime - playerB.getCurrentTime()) > m) {

                if (mainVideo.currentTime - playerB.getCurrentTime() > 0) {
                    videoB.playbackRate = mainVideo.playbackRate + Math.min(15, mainVideo.currentTime - playerB.getCurrentTime());
                } else {
                    videoB.playbackRate = mainVideo.playbackRate + Math.max(-0.93, mainVideo.currentTime - playerB.getCurrentTime());
                }
            } else {
                videoB.playbackRate = mainVideo.playbackRate;
            }
            try {
                if (Math.abs((mainVideo.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime()) > m) {
                    if ((mainVideo.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime() > 0) {
                        try {
                            video3[soundIndex].playbackRate = mainVideo.playbackRate + Math.min(15, (mainVideo.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime());
                        } catch (erro) { }
                    } else {
                        try {
                            video3[soundIndex].playbackRate = mainVideo.playbackRate + Math.max(-0.93, (mainVideo.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime());
                        } catch (erro) { }
                    }
                } else {
                    try {
                        video3[soundIndex].playbackRate = mainVideo.playbackRate;
                    } catch (erro) { }
                }
            } catch (error) { }
            try {
                if (mainVideo.currentTime >= tempoDeInicioP3[soundIndex + 1]) {
                    if (mainVideo.currentTime < tempoDeInicioP3[soundIndex + 2] || soundIndex + 1 == tempoDeInicioP3.length - 1) {
                        DeleteCurrentSound();
                        soundIndex = GetSoundIndex();
                        ChangeToNextSound();
                    }
                }
            } catch (error) { }
            if (mainVideo.clientWidth != cWidth) {
                mainVideo.style.left = -5000 + "px";
                ResiC();
            }
            if (mainVideo.videoHeight != vHeigth || videoB.videoHeight != v2Heigth || videoA.videoHeight != v1Heigth) {
                ResiC();
            }
            setTimeout(Update, 1000 / 30.0);
        }
    }

    function play() {
        if (playerA.getPlayerState() != YT.PlayerState.BUFFERING && playerB.getPlayerState() != YT.PlayerState.BUFFERING && player3[soundIndex].getPlayerState() != YT.PlayerState.BUFFERING) {
            playerA.playVideo();
            playerB.playVideo();
            if (player3[soundIndex]) {
                player3[soundIndex].playVideo();
                player3[soundIndex].setVolume(mainVideo.volume * 100);
            }
        } else {
            mainVideo.pause();
            playerA.pauseVideo();
            playerB.pauseVideo();
            if (player3[soundIndex])
                player3[soundIndex].pauseVideo();
        }

    }

    function pause() {
        mainVideo.pause();
        mainVideo.muted = true;
        if (playerA) {
            playerA.pauseVideo();
            playerA.seekTo(mainVideo.currentTime, true);
        }
        if (playerB) {
            playerB.pauseVideo();
            playerB.seekTo(mainVideo.currentTime, true);
        }
        if (player3[soundIndex]) {
            player3[soundIndex].pauseVideo();
            player3[soundIndex].seekTo(mainVideo.currentTime - tempoDeInicioP3[soundIndex], true);
            player3[soundIndex].setVolume(mainVideo.volume * 100);
        }
        if (videoA)
            videoA.muted = true;
        if (videoB)
            videoB.muted = true;
        setTimeout(ResiC, 1000);
        setTimeout(function () { if (videoA && videoB) DrawCanvas(); }, 1000);
    }

    function volumeChange() {
        if (player3[soundIndex]) {
            mainVideo.muted = true;
            videoA.muted = true;
            videoB.muted = true;
            player3[soundIndex].setVolume(mainVideo.volume * 100);
        }
    }

    function waiting() {
        pause();
    }
    function onwaitingPlayer3() {
        if (this.index == soundIndex && !this.dontPauseOnonwaiting) {
            pause();
        }
    }

    function seeked() {
        console.log("seeked: " + GetSoundIndex() + " " + soundIndex);
        pause();

        var newIndex = GetSoundIndex();
        if (newIndex != soundIndex) {

            DeleteUselessSounds(deleteAllSounds = true);
            console.log("newIndex != soundIndex: soundIndex == " + soundIndex + " " + "newIndex == " + newIndex);
            soundIndex = newIndex;

            GetTwoSounds();
        }

        ResiC();
        if (videoA && videoB)
            DrawCanvas();

        console.log("seeked END");
    }

    function GetSoundIndex() {
        for (let i = 0; i < tempoDeInicioP3.length - 1; i++) {
            if (mainVideo.currentTime >= tempoDeInicioP3[i] && mainVideo.currentTime < tempoDeInicioP3[i + 1]) {
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
        video3[soundIndex].playbackRate = mainVideo.playbackRate;
        player3[soundIndex].setVolume(mainVideo.volume * 100);
        video3[soundIndex].dontPauseOnonwaiting = true;
        player3[soundIndex].seekTo(mainVideo.currentTime - tempoDeInicioP3[soundIndex], true);
        player3[soundIndex + 1] = GetPlayer(URLS_player3[soundIndex + 1], function () { player3[soundIndex + 1].playVideo(); player3[soundIndex + 1].setVolume(0); }, 144, 360);
        GetVideo3(soundIndex + 1, true);
        play();
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