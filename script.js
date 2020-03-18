window.onload = () => {
    createDecodeElement()
    createStatusElement()
    createPanelElement()
}
let ready = []
let isDecoded = false
const decodeElement = document.createElement("button")
const statusElement = document.createElement("button")
const panelElement = document.createElement("div")

function createDecodeElement(){
    decodeElement.id = "decode"
    decodeElement.classList.add("mm")
    decodeElement.classList.add("button")
    decodeElement.classList.add("undecoded")
    decodeElement.textContent = "DECODE"
    decodeElement.addEventListener("click", decode)
    document.querySelector(".ytp-chrome-controls .ytp-right-controls").prepend(decodeElement)
}

function createStatusElement(){
    statusElement.id = "status"
    statusElement.classList.add("mm")
    statusElement.classList.add("button")
    statusElement.classList.add("hidden")
    statusElement.textContent = "STATUS"
    statusElement.addEventListener("click", togglePanel)
    document.querySelector(".ytp-chrome-controls .ytp-left-controls").append(statusElement)
}

function createPanelElement(){
    panelElement.id = "panel"
    panelElement.classList.add("mm")
    panelElement.classList.add("panel")
    panelElement.classList.add("hidden")
    document.querySelector("#movie_player").append(panelElement)
}

function decode() {
    const canvas = document.querySelector("#canvas")

    if (decodeElement.classList.contains("undecoded")) { //Undecoded ------> Loading
        setLoadingState(canvas)
    } else if(decodeElement.classList.contains("loading")){//Please, wait.
        decodeElement.textContent = "DECODING... Wait"
    } else if(decodeElement.classList.contains("decoded")){//Decoded ------> Undecoded
        setUndecodedState(canvas)
    }
    isDecoded = true
}

function setLoadingState(canvas){
    decodeElement.classList.remove("undecoded")
    decodeElement.classList.add("loading")
    statusElement.classList.remove("hidden")
    if(canvas){canvas.classList.remove("hidden")}//todo pensar em trocar isso para o final do Loading...
    decodeElement.textContent = "DECODING..."

    if(!isDecoded){ //Caso seja a primeira vez, inicia a decodificao do video.
        decodeVideo()
    }

}
function setDecodedState(){
    decodeElement.classList.remove("loading")
    decodeElement.classList.add("decoded")
    decodeElement.textContent = "DECODED"
}
function setUndecodedState(canvas){
    decodeElement.classList.remove("decoded")
    decodeElement.classList.add("undecoded")
    statusElement.classList.add("hidden")
    decodeElement.textContent = "DECODE"
    panelElement.classList.add("hidden")

    if(canvas){canvas.classList.add("hidden")}
}

function togglePanel() {
    panelElement.classList.toggle("hidden")
}
// ************************************************************************************************************************************
// ************************************************************************************************************************************
// ************************************************************************************************************************************
// ************************************************************************************************************************************
function decodeVideo() {
    const config = getConfig()
    if(!config) return

    const URL_Player1 = config.URL_Player1
    const URL_Player2 = config.URL_Player2
    const URLS_player3 = config.URLS_player3
    const tempoDeInicioP3 = config.tempoDeInicioP3

    let rect1, rect2, rect3, rect4;

    const mainVideo = getMainVideo();
    if(!mainVideo) {
        console.log("VIDEO NÃO ENCONTRADO NESSA PÁGINA.")
        return
    }
    mainVideo.addEventListener('play', play);
    mainVideo.addEventListener('pause', pause);
    mainVideo.addEventListener('volumeChange', volumeChange);
    mainVideo.addEventListener('waiting', waiting);
    mainVideo.addEventListener('seeked', seeked);

    let videoA, videoB;
    let video3 = [];
    let playerA, playerB;
    let player3 = [];

    let intervalID

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

    let soundIndex = GetSoundIndex();

    const canvas = GetCanvas("canvas", 10);
    const ctx = canvas.getContext('2d');

    const m = 0.05;

    document.querySelector("#movie_player").addEventListener('resize', function(){ResizeCanvas()})
    document.querySelector("video").addEventListener('resize', function(){ResizeCanvas()})


    window.onYouTubeIframeAPIReady = function () {
        mainVideo.pause()

        playerA = GetPlayer(URL_Player1, PlayerAReady, 144, 360, ResizeCanvas);
        playerB = GetPlayer(URL_Player2, PlayerBReady, 144, 360, ResizeCanvas);

        // GET VIDEOA
        getVideo(URL_Player1).then(video => {
            videoA = video
            videoA.onwaiting = waiting;
            vAHeigth = videoA.videoHeight;
            vAWidth = videoA.videoWidth;
            videoA.onseeked = function () { if (videoA && videoB) DrawCanvas(); };
            videoA.muted = true;
            videoA.style.visibility = "hidden"
            videoA.addEventListener('resize', function(){
                ResizeCanvas()
            })
            videoA.addEventListener('pause', function(){
                if (videoA && videoB) DrawCanvas()
            })
            
            videoA.addEventListener('canplaythrough', function(){
                console.log("VideoA canplaythrough")
                setReadyElements("videoA")
            })
        }).catch(console.error)
        // GET VIDEOB
        getVideo(URL_Player2).then(video => {
            videoB = video
            videoB.onwaiting = waiting;
            vBHeigth = videoB.videoHeight;
            vBWidth = videoB.videoWidth;
            videoB.onseeked = function () { if (videoA && videoB) DrawCanvas(); };
            videoB.muted = true;
            videoB.style.visibility = "hidden"
            videoB.addEventListener('resize', function(){
                ResizeCanvas()
            })
            videoB.addEventListener('pause', function(){
                if (videoA && videoB) DrawCanvas()
            })
            videoB.addEventListener('canplaythrough', function(){
                console.log("VideoB canplaythrough")
                setReadyElements("videoB")
            })
        }).catch(console.error)

        GetTwoSounds()
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
        video.playbackRate = 1
        setReadyElements("mainVideo")
        return video
    }


    function getVideo(url) {
        return new Promise((resolve) => {
            const iframe = document.getElementById(url);
            iframe.onload = function () {
                video = (iframe.contentDocument || iframe.contentWindow.document).getElementsByTagName("video")[0];
                if (video){
                    resolve(video)
                } else {
                    throw new Error("Video " + url + "não encontrado.")
                }
            }
        })
    }

    function PlayerAReady() {
        console.log("PlayerA Ready");
        playerA.playVideo();
    }

    function PlayerBReady() {
        console.log("PlayerB Ready");
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
        ctx.drawImage(videoB, rect1[0], rect1[1], rect1[2], rect1[3], rect1[4], rect1[5], rect1[6], rect1[7]);
        ctx.drawImage(videoA, rect2[0], rect2[1], rect2[2], rect2[3], rect2[4], rect2[5], rect2[6], rect2[7]);
        ctx.drawImage(videoB, rect3[0], rect3[1], rect3[2], rect3[3], rect3[4], rect3[5], rect3[6], rect3[7]);
        ctx.drawImage(videoA, rect4[0], rect4[1], rect4[2], rect4[3], rect4[4], rect4[5], rect4[6], rect4[7]);
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
        if (!(mainVideo.paused | mainVideo.ended)) {
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
                        video3[soundIndex].playbackRate = mainVideo.playbackRate + Math.min(15, (mainVideo.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime());
                    } else {
                        video3[soundIndex].playbackRate = mainVideo.playbackRate + Math.max(-0.93, (mainVideo.currentTime - tempoDeInicioP3[soundIndex]) - player3[soundIndex].getCurrentTime());
                    }
                } else {
                    video3[soundIndex].playbackRate = mainVideo.playbackRate;
                }
            } catch (error) { }
        }
    }

    function play() {
        if (playerA && playerB && player3[soundIndex] && playerA.getPlayerState() != YT.PlayerState.BUFFERING && playerB.getPlayerState() != YT.PlayerState.BUFFERING && player3[soundIndex].getPlayerState() != YT.PlayerState.BUFFERING) {
            playerA.playVideo()
            playerB.playVideo()
            player3[soundIndex].playVideo()
            player3[soundIndex].setVolume(mainVideo.volume * 100)
            intervalID = setInterval(update, 1000 / 30.0)
        } else {
            pause()
        }

    }

    function pause() {
        console.log("Pause")

        if(mainVideo){
            mainVideo.pause();
            mainVideo.muted = true;
        }
        if (videoA) {
            playerA.pauseVideo();
            playerA.seekTo(mainVideo.currentTime, true);
            if (videoA){
                videoA.muted = true;
            }
        }
        if (videoB) {
            playerB.pauseVideo();
            playerB.seekTo(mainVideo.currentTime, true);
            if (videoB){   
                videoB.muted = true;
            }
        }
        if (video3[soundIndex]) {
            player3[soundIndex].pauseVideo();
            player3[soundIndex].seekTo(mainVideo.currentTime - tempoDeInicioP3[soundIndex], true);
            player3[soundIndex].setVolume(mainVideo.volume * 100); //todo remover? parece n servir para nada
        }
        
        clearInterval(intervalID) //Para o Lopping do Update
        //todo tentar transformar isso em eventos.
        setTimeout(ResizeCanvas, 1000);
        setTimeout(function () { if (videoA && videoB) DrawCanvas(); }, 1000);
    }

    function volumeChange() { //Seta o volume do audio para o volume do mainVideo e muta os outros videos.
        console.log("OnVolumeChange")
        if (player3[soundIndex] && mainVideo) {
            player3[soundIndex].setVolume(mainVideo.volume * 100);
        }
        if(mainVideo){
            mainVideo.muted = true;
        }
        if (videoA) {
            videoA.muted = true;
        }
        if (videoB) {
            videoB.muted = true;
        }
    }

    function waiting() {
        console.log("OnWaiting")
        pause();
    }
    function onwaitingPlayer3() {
        if (this.index == soundIndex && !this.dontPauseOnonwaiting) {
            pause();
        }
    }

    function seeked() {
        console.log("OnSeeked")
        pause();

        const newIndex = GetSoundIndex();
        if (newIndex != soundIndex) {

            DeleteUselessSounds(deleteAllSounds = true);
            console.log("newIndex != soundIndex: soundIndex == " + soundIndex + " " + "newIndex == " + newIndex);
            soundIndex = newIndex;

            GetTwoSounds();
        }

        ResizeCanvas();
        if (videoA && videoB) {
            DrawCanvas()
        }
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
        getVideo(URLS_player3[soundIndex]).then(video => {
            video3[soundIndex] = video
            video3[soundIndex].index = soundIndex
            video3[soundIndex].onwaiting = onwaitingPlayer3
            video3[soundIndex].addEventListener("ended", function(){
                console.log("audio", soundIndex, "terminado")
                if (mainVideo.currentTime < tempoDeInicioP3[soundIndex + 2] || soundIndex + 1 == tempoDeInicioP3.length - 1) {
                    DeleteCurrentSound()
                    soundIndex = GetSoundIndex()
                    ChangeToNextSound()
                }
            })
            video3[soundIndex].addEventListener('canplaythrough', function(){
                console.log("Audio",soundIndex, " canplaythrough")
                setReadyElements("video3")
            })
        })

        getVideo(URLS_player3[soundIndex + 1]).then(video => {
            video3[soundIndex + 1] = video
            video3[soundIndex + 1].index = soundIndex + 1
            video3[soundIndex + 1].onwaiting = onwaitingPlayer3
            video3[soundIndex + 1].addEventListener("ended", function(){
                console.log("audio", soundIndex + 1, "terminado")
                if (mainVideo.currentTime < tempoDeInicioP3[soundIndex + 2] || soundIndex + 1 == tempoDeInicioP3.length - 1) {
                    DeleteCurrentSound()
                    soundIndex = GetSoundIndex()
                    ChangeToNextSound()
                }
            })
            video3[soundIndex + 1].playbackRate = 0.07

            video3[soundIndex + 1].addEventListener('canplaythrough', function(){
                setTimeout(() => {
                    video3[soundIndex + 1].playbackRate = 1
                    video3[soundIndex + 1].pause()
                    console.log("video3[", soundIndex + 1, "] foi pausado. Esperando sua vez para despausar.")
                    console.log("Tempo de video:", video3[soundIndex + 1].currentTime)
                }, 2000);
                console.log("Audio",soundIndex + 1, " canplaythrough")
                setReadyElements("video3")
            })
        })
        
        console.log("GetTwoSounds");
    }

    function ChangeToNextSound() {
        video3[soundIndex].playbackRate = mainVideo.playbackRate;
        player3[soundIndex].setVolume(mainVideo.volume * 100);
        video3[soundIndex].dontPauseOnonwaiting = true;
        player3[soundIndex].seekTo(mainVideo.currentTime - tempoDeInicioP3[soundIndex], true);
        player3[soundIndex + 1] = GetPlayer(URLS_player3[soundIndex + 1], function () { player3[soundIndex + 1].playVideo(); player3[soundIndex + 1].setVolume(0); }, 144, 360);
        getVideo(URLS_player3[soundIndex + 1]).then(video => {
            video3[soundIndex + 1] = video
            video3[soundIndex + 1].index = soundIndex + 1
            video3[soundIndex + 1].onwaiting = onwaitingPlayer3
            video3[soundIndex + 1].addEventListener("ended", function(){
                console.log("audio", soundIndex + 1, "terminado")
                if (mainVideo.currentTime < tempoDeInicioP3[soundIndex + 2] || soundIndex + 1 == tempoDeInicioP3.length - 1) {
                    DeleteCurrentSound()
                    soundIndex = GetSoundIndex()
                    ChangeToNextSound()
                }
            })
            // video3[soundIndex + 1].playbackRate = 0.07

            video3[soundIndex + 1].addEventListener('canplaythrough', function(){
                setTimeout(() => {
                    video3[soundIndex + 1].playbackRate = 1
                    video3[soundIndex + 1].pause()
                    console.log("video3[", soundIndex + 1, "] foi pausado. Esperando sua vez para despausar.")
                    console.log("Tempo de video:", video3[soundIndex + 1].currentTime)
                }, 2000);
                console.log("Audio",soundIndex + 1, " canplaythrough")
                setReadyElements("video3")
            })
            
        })
        play()
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

    function setReadyElements(element){
        console.log("setReadyElements:", element)
        if(!ready.includes(element)){
            ready.push(element)
        }

        if(!decodeElement.classList.contains("decoded")){ //Se todos os elementos do importantElements ja estiverem prontos, setDecodedState(), caso !decoded.
            const importantElements = ["mainVideo", "videoA", "videoB", "video3"]
            if(importantElements.every(el => ready.includes(el))){
                console.log(ready)
                setDecodedState()
                pause()
            }
        }
    }


    setInterval(function(){setPanelContent({URL_Player1,URL_Player2,URLS_player3,tempoDeInicioP3,mainVideo,videoA,videoB}), 1000})
}

function setPanelContent(data) {
    const panelElement = document.querySelector("#panel")
    panelElement.innerHTML = ""
    let key, value
    Object.entries(data).forEach(entrie => {
        key = entrie[0]
        value = entrie[1]
        panelElement.innerHTML += `
        <panelElement>${entrie[0]}: <span style="color: ${exists(entrie[1]) ? "lawngreen" : "red"};">${exists(entrie[1])? "OK!" : "ERROR!"}</span></panelElement>
        `
    })
}

function exists(value){
    if(!value) return false
    if(Array.isArray(value) && value.length === 0) return false
    if(typeof value === 'string' && !value.trim()) return false
    return true
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