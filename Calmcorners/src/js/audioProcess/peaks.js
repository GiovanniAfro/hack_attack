async function processAudioFile(path) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioFile = await fetch(path);
	const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);    const channelData = audioBuffer.getChannelData(0); // Assuming mono audio, use channelData[i] for multi-channel
    const peak = findPeak(channelData);
    const peakDb = 20 * Math.log10(peak);
	console.log(`Highest Peak: ${peakDb.toFixed(2)} dB`);
}

function findPeak(data) {
    let peak = 0;
    for (let i = 0; i < data.length; i++) {
        if (Math.abs(data[i]) > peak) {
            peak = Math.abs(data[i]);
        }
    }
    return peak;
}