function playFileNoise() {
    const audioPlayerNoise = document.getElementById('audioPlayerNoise');
    const buttonNoise = document.getElementById('buttonNoise');

    if (buttonNoise.innerHTML === 'Stop') {
        audioPlayerNoise.pause();
        buttonNoise.innerHTML = 'Play';
        return;
    }

    buttonNoise.innerHTML = 'Stop';
    audioPlayerNoise.play().catch(function(error) {
        console.error('Error:', error);
        alert('Error: Unable to play the audio file.');
    });

    audioPlayerNoise.addEventListener('ended', function() {
        buttonNoise.innerHTML = 'Play';
    });

    audioPlayerNoise.addEventListener('timeupdate', function() {
        if (audioPlayerNoise.currentTime >= audioPlayerNoise.duration) {
            buttonNoise.innerHTML = 'Play';
        }
    });
}

function playFileClear() {
    const audioPlayerClear = document.getElementById('audioPlayerClear');
    const buttonClear = document.getElementById('buttonClear');

    if (buttonClear.innerHTML === 'Stop') {
        audioPlayerClear.pause();
        buttonClear.innerHTML = 'Play';
        return;
    }
    buttonClear.innerHTML = 'Stop';
    audioPlayerClear.play().catch(function(error) {
        console.error('Error:', error);
        alert('Error: Unable to play the audio file.');
    });

    audioPlayerClear.addEventListener('ended', function() {
        buttonCaudioPlayerClear.innerHTML = 'Play';
    });

    audioPlayerClear.addEventListener('timeupdate', function() {
        if (audioPlayerClear.currentTime >= audioPlayerClear.duration) {
            buttonCaudioPlayerClear.innerHTML = 'Play';
        }
    });
}