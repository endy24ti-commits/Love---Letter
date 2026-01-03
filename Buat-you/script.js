let audioContext;
let analyser;

async function startMic() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mic = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    mic.connect(analyser);

    detectBlow();
}

function detectBlow() {
    const data = new Uint8Array(analyser.fftSize);

    function check() {
        analyser.getByteTimeDomainData(data);
        let sum = 0;

        for (let i = 0; i < data.length; i++) {
            let val = (data[i] - 128) / 128;
            sum += val * val;
        }

        let volume = Math.sqrt(sum / data.length);

        if (volume > 0.1) {
            blowOut();
            return;
        }
        requestAnimationFrame(check);
    }
    check();
}

function blowOut() {
    document.getElementById("candle").src = "assets/candle-off.png";
    document.getElementById("fireworks").style.display = "block";
}
