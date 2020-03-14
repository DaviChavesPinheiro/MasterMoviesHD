window.onload = () => {
    createDecodeElement()

    createStatusElement()

    createPanelElement()

}

function createDecodeElement(){
    const d = document.createElement("button")
    d.id = "decode"
    d.classList.add("mm")
    d.classList.add("button")
    d.textContent = "DECODIFICAR"
    d.addEventListener("click", decode)
    document.querySelector(".ytp-chrome-controls .ytp-right-controls").prepend(d)
}

function createStatusElement(){
    const s = document.createElement("button")
    s.id = "status"
    s.classList.add("mm")
    s.classList.add("button")
    s.classList.add("hidden")
    s.textContent = "STATUS"
    s.addEventListener("click", status)
    document.querySelector(".ytp-chrome-controls .ytp-left-controls").append(s)
}

function createPanelElement(){
    const p = document.createElement("div")
    p.id = "panel"
    p.classList.add("mm")
    p.classList.add("panel")
    p.classList.add("hidden")
    document.querySelector("#movie_player").append(p)
}



function decode() {
    const d = document.querySelector("#decode")
    const s = document.querySelector("#status")
    const c = document.querySelector("#canvas")
    const p = document.querySelector("#panel")

    if(!d.classList.contains("decoded")){ //VAI CODIFICAR
        if (!c) {
            decodeVideo()
        }

        d.classList.add("decoded")
        s.classList.remove("hidden")
        if(c)
            c.classList.remove("hidden")
    } else {                                  //DESLIGA A CODIFICACAO
        d.classList.remove("decoded")
        s.classList.add("hidden")
        c.classList.add("hidden")
        p.classList.add("hidden")
    }
}

function status() {
    const p = document.querySelector("#panel")
    p.classList.toggle("hidden")
}   

function decodeVideo() {
    const config = getConfig()
    if(!config) return

    const URL_Player1 = config.URL_Player1 || ""
    const URL_Player2 = config.URL_Player2 || ""
    const URLS_player3 = config.URLS_player3 || []
    const tempoDeInicioP3 = config.tempoDeInicioP3 || []

    let rect1, rect2, rect3, rect4;

    let soundIndex;

    const mainVideo = getMainVideo();
    let videoA, videoB;
    let video3 = [];
    let playerA, playerB;
    let player3 = [];

    if (mainVideo.currentTime < 60 * 1 + 30)
        mainVideo.currentTime = 0;

    let container = document.querySelector("#container")

    let cHeigth = mainVideo.clientHeight;
    let cWidth = mainVideo.clientWidth;
    let vHeigth = mainVideo.videoHeight;
    let vWidth = mainVideo.videoWidth;
    let vAHeigth = mainVideo.videoHeight;
    let vAWidth = mainVideo.videoWidth;
    let vBHeigth = mainVideo.videoHeight;
    let vBWidth = mainVideo.videoWidth;

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    soundIndex = GetSoundIndex();

    const canvas = GetCanvas("canvas", 10);
    const ctx1 = canvas.getContext('2d');

    mainVideo.addEventListener('play', update, 0);
    mainVideo.onplay = play;
    mainVideo.onpause = pause;
    mainVideo.onvolumechange = volumeChange;
    mainVideo.waiting = waiting;
    mainVideo.onseeked = seeked;

    const m = 0.002;

    document.addEventListener("fullscreenchange", function () {
        setTimeout(ResizeCanvas, 1000);
    }, false);

    document.addEventListener("msfullscreenchange", function () {
        setTimeout(ResizeCanvas, 1000);
    }, false);

    document.addEventListener("mozfullscreenchange", function () {
        setTimeout(ResizeCanvas, 1000);
    }, false);

    document.addEventListener("webkitfullscreenchange", function () {
        setTimeout(ResizeCanvas, 1000);
    }, false);


    window.onYouTubeIframeAPIReady = function () {
        console.log("Window onYouTubeIframeAPIReady")

        playerA = GetPlayer(URL_Player1, PlayerAReady, 144, 360, ResizeCanvas);
        playerB = GetPlayer(URL_Player2, PlayerBReady, 144, 360, ResizeCanvas);

        getVideo(URL_Player1).then(video => {
            videoA = video
            videoA.waiting = waiting;
            vAHeigth = videoA.videoHeight;
            vAWidth = videoA.videoWidth;
            videoA.onseeked = function () { if (videoA && videoB) DrawCanvas(); };
            videoA.muted = true;
            playerA.playVideo();
            videoA.style.visibility = "hidden"
        }).catch(console.error)

        getVideo(URL_Player2).then(video => {
            videoB = video
            videoB.waiting = waiting;
            vBHeigth = videoB.videoHeight;
            vBWidth = videoB.videoWidth;
            videoB.onseeked = function () { if (videoA && videoB) DrawCanvas(); };
            videoB.muted = true;
            playerB.playVideo();
            videoB.style.visibility = "hidden"
        }).catch(console.error)

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
        video.style.visibility = "hidden"
        return video
    }


    function getVideo(url) {
        return new Promise((resolve, reject) => {
            const iframe = document.getElementById(url);
            iframe.onload = function () {
                video = (iframe.contentDocument || iframe.contentWindow.document).getElementsByTagName("video")[0];
                if (video){
                    resolve(video)
                } else {
                    throw new Error("VideoA não encontrado.");
                }
            }
        })
    }

    function GetVideo3(i, lowPlayBackRate) {
        const iframe = document.getElementById(player3[i].getIframe().id);
        iframe.onload = function () {
            video3[i] = (iframe.contentDocument || iframe.contentWindow.document).getElementsByTagName("video")[0];
            if (video3[i]) console.log("Obtained: video3[" + i + "]"); else console.log("Failed: video3[" + i + "]");
            video3[i].index = i;
            video3[i].waiting = onwaitingPlayer3;
            if (lowPlayBackRate)
                video3[i].playbackRate = 0.07;
        }
    }

    function PlayerAReady() {
        console.log("Player 1 Ready");
        playerA.playVideo();
    }

    function PlayerBReady() {
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
        return canvas;
    }

    function CreateNewDiv(id) {
        const div = document.createElement("div");
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

    function ResizeCanvas() {
        canvas.width = cWidth = mainVideo.clientWidth;
        canvas.height = cHeigth = mainVideo.clientHeight;
        vHeigth = mainVideo.videoHeight;
        vWidth = mainVideo.videoWidth;
        if (videoA) {
            vAHeigth = videoA.videoHeight; vAWidth = videoA.videoWidth;
        }
        if (videoB) {
            vBHeigth = videoB.videoHeight; vBWidth = videoB.videoWidth;
        }
        rect1 = [0, 0, Math.ceil(vBWidth / 2), Math.ceil(vBHeigth / 2), Math.floor(cWidth / 2), Math.floor(cHeigth / 2), Math.ceil(cWidth / 2), Math.ceil(cHeigth / 2)];
        rect2 = [Math.ceil(vAWidth / 2), 0, Math.floor(vAWidth / 2), Math.ceil(vAHeigth / 2), 0, Math.floor(cHeigth / 2), Math.floor(cWidth / 2), Math.ceil(cHeigth / 2)];
        rect3 = [0, Math.ceil(vBHeigth / 2), Math.ceil(vBWidth / 2), Math.floor(vBHeigth / 2), Math.floor(cWidth / 2), 0, Math.ceil(cWidth / 2), Math.floor(cHeigth / 2)];
        rect4 = [Math.ceil(vAWidth / 2), Math.ceil(vAHeigth / 2), Math.floor(vAWidth / 2), Math.floor(vAHeigth / 2), 0, 0, Math.floor(cWidth / 2), Math.floor(cHeigth / 2)];
    }

    function update() {
        if (!(mainVideo.paused || mainVideo.ended)) {
            DrawCanvas();
            // if (Math.abs(mainVideo.currentTime - playerA.getCurrentTime()) > m) {
            //     if (mainVideo.currentTime - playerA.getCurrentTime() > 0) {
            //         videoA.playbackRate = mainVideo.playbackRate + Math.min(15, mainVideo.currentTime - playerA.getCurrentTime());
            //     } else {
            //         videoA.playbackRate = mainVideo.playbackRate + Math.max(-0.93, mainVideo.currentTime - playerA.getCurrentTime());
            //     }
            // } else {
            //     videoA.playbackRate = mainVideo.playbackRate;
            // }
            // if (Math.abs(mainVideo.currentTime - playerB.getCurrentTime()) > m) {

            //     if (mainVideo.currentTime - playerB.getCurrentTime() > 0) {
            //         videoB.playbackRate = mainVideo.playbackRate + Math.min(15, mainVideo.currentTime - playerB.getCurrentTime());
            //     } else {
            //         videoB.playbackRate = mainVideo.playbackRate + Math.max(-0.93, mainVideo.currentTime - playerB.getCurrentTime());
            //     }
            // } else {
            //     videoB.playbackRate = mainVideo.playbackRate;
            // }
            // try {
            //     if (Math.abs((mainVideo.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime()) > m) {
            //         if ((mainVideo.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime() > 0) {
            //             try {
            //                 video3[soundIndex].playbackRate = mainVideo.playbackRate + Math.min(15, (mainVideo.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime());
            //             } catch (erro) { }
            //         } else {
            //             try {
            //                 video3[soundIndex].playbackRate = mainVideo.playbackRate + Math.max(-0.93, (mainVideo.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime());
            //             } catch (erro) { }
            //         }
            //     } else {
            //         try {
            //             video3[soundIndex].playbackRate = mainVideo.playbackRate;
            //         } catch (erro) { }
            //     }
            // } catch (error) { }
            // try {
            //     if (mainVideo.currentTime >= tempoDeInicioP3[soundIndex + 1]) {
            //         if (mainVideo.currentTime < tempoDeInicioP3[soundIndex + 2] || soundIndex + 1 == tempoDeInicioP3.length - 1) {
            //             DeleteCurrentSound();
            //             soundIndex = GetSoundIndex();
            //             ChangeToNextSound();
            //         }
            //     }
            // } catch (error) { }
            // if (mainVideo.clientWidth != cWidth) {
            //     mainVideo.style.left = -5000 + "px";
            //     ResizeCanvas();
            // }
            // if (mainVideo.videoHeight != vHeigth || videoB.videoHeight != vBHeigth || videoA.videoHeight != vAHeigth) {
            //     ResizeCanvas();
            // }
            setTimeout(update, 1000 / 30.0);
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
        setTimeout(ResizeCanvas, 1000);
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

        const newIndex = GetSoundIndex();
        if (newIndex != soundIndex) {

            DeleteUselessSounds(deleteAllSounds = true);
            console.log("newIndex != soundIndex: soundIndex == " + soundIndex + " " + "newIndex == " + newIndex);
            soundIndex = newIndex;

            GetTwoSounds();
        }

        ResizeCanvas();
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
            const url = player3[soundIndex].getIframe().id;
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
        const iframe1 = document.getElementById(URL_Player1);
        const iframe2 = document.getElementById(URL_Player2);

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

    setInterval(function(){setPanelContent({URL_Player1,URL_Player2,URLS_player3,tempoDeInicioP3,mainVideo,videoA,videoB}), 1000})
}

function setPanelContent(data) {
    const p = document.querySelector("#panel")
    p.innerHTML = ""
    Object.entries(data).forEach(entrie => {
        p.innerHTML += `<p>${entrie[0]}: <span style="color: ${existsOrError(entrie[1]) == 'OK!' ? "lawngreen" : "red"};">${existsOrError(entrie[1])}</span></p>`

    })
}

function existsOrError(value, msg){
    if(!value) return "Error"
    if(Array.isArray(value) && value.length === 0) return "Error"
    if(typeof value === 'string' && !value.trim()) return "Error"
    return "OK!"
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