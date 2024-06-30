
document.addEventListener("DOMContentLoaded", () => {
  const startMicrophoneButton = document.getElementById('startMicrophoneButton');
  const stopMicrophoneButton = document.getElementById('stopMicrophoneButton');
  const navbar = document.querySelector('.navbar');
  const mainContent = document.getElementById('mainContent');
  const mapContainer = document.getElementById('imageContainer');
  const formContainer = document.querySelector('.form-container');
  const loudNoiseList = document.getElementById('loudNoiseList');
  const logo = document.getElementById('logo');
//questi sono di polly
  const wallpaper = document.getElementById('wallpaper');

  setTimeout(function() {
    // Hide wallpaper and show main content
    wallpaper.style.display = 'none';
    navbar.classList.remove('start');
    mainContent.style.display = 'block';
  }, 2500); // Adjust timing as needed

  startMicrophoneButton.addEventListener("click", () => {
    navbar.classList.add('hidden');
    logo.classList.remove('hidden');
    logo.classList.add('visible'); // Nasconde la navbar
    mainContent.style.marginTop = '0'; // Rimuove il margine superiore
    stopMicrophoneButton.disabled = false;
    startMicrophoneButton.disabled = true;

    // Mostra la mappa, il form e la lista
    mapContainer.classList.remove('hidden');
    mapContainer.classList.add('visible');
    formContainer.classList.remove('hidden');
    formContainer.classList.add('visible');
    loudNoiseList.classList.remove('hidden');
    loudNoiseList.classList.add('visible');

  });

  stopMicrophoneButton.addEventListener("click", () => {
    navbar.classList.remove('hidden');
    logo.classList.add('hidden');
    logo.classList.remove('visible'); // Riporta la navbar
    mainContent.style.marginTop = '100vh'; // Reimposta il margine superiore
    startMicrophoneButton.disabled = false;
    stopMicrophoneButton.disabled = true;

    // Nasconde la mappa, il form e la lista
    mapContainer.classList.remove('visible');
    mapContainer.classList.add('hidden');
    formContainer.classList.remove('visible');
    formContainer.classList.add('hidden');
    loudNoiseList.classList.remove('visible');
    loudNoiseList.classList.add('hidden');
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const startMicrophoneButton = document.getElementById('startMicrophoneButton');
  const stopMicrophoneButton = document.getElementById('stopMicrophoneButton');
  const addMarkerForm = document.getElementById('addMarkerForm');
  const markerContainer = document.getElementById('markerContainer');
  const loudNoiseList = document.getElementById('loudNoiseList');
  const imageContainer = document.getElementById('imageContainer');
  const formContainer = document.querySelector('.form-container');

  // Verifica che tutti gli elementi siano stati trovati
  if (!startMicrophoneButton || !stopMicrophoneButton || !addMarkerForm || !markerContainer || !loudNoiseList || !imageContainer || !formContainer) {
    console.error('Uno o più elementi del DOM non sono stati trovati.');
    return;
  }

  // Array globale per memorizzare i marker
  let markers = [];

  async function uploadMarker(marker) {
    try {
      markers.push(marker); // Aggiungi il marker all'array globale
      console.log('Marker added:', marker);

      const { xPercent, yPercent } = calculateImageCoordinates(marker.latitude, marker.longitude);
      createRedDot(yPercent, xPercent);

      console.log('Marker uploaded successfully');
    } catch (error) {
      console.error('Failed to upload marker:', error);
    }
  }

  function calculateImageCoordinates(latitude, longitude) {
    const latA = 43.789967;
    const lngA = 11.228297;
    const latB = 43.763781;
    const lngB = 11.281727;

    const lat_ratio = (latitude - latA) / (latB - latA);
    const lng_ratio = (longitude - lngA) / (lngB - lngA);

    const xPercent = lat_ratio * 100;
    const yPercent = lng_ratio * 100;

    return { xPercent, yPercent };
  }

  function createRedDot(xPercent, yPercent) {
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.style.left = `${xPercent}%`;
    marker.style.top = `${yPercent}%`;
    markerContainer.appendChild(marker);
    console.log(`Red dot placed at (${xPercent}%, ${yPercent}%)`);
  }

  addMarkerForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Previene il comportamento predefinito del form

    const latitude = parseFloat(addMarkerForm.latitude.value);
    const longitude = parseFloat(addMarkerForm.longitude.value);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('Invalid latitude or longitude');
      return;
    }

    const marker = { latitude, longitude };
    uploadMarker(marker);

    addMarkerForm.reset();
  });

  let stream;
  let context;
  let source;
  let processor;
  let debounceTimeout = null;
  const debounceDelay = 5000;

  startMicrophoneButton.addEventListener("click", async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      context = new AudioContext();
      source = context.createMediaStreamSource(stream);

      await context.audioWorklet.addModule("processor.js");

      processor = new AudioWorkletNode(context, "loudness-processor");
      processor.port.postMessage({ threshold: 0.5 });//QUI CAMBIARE

      processor.port.onmessage = async (event) => {
        console.log("message recieved");
        if (event.data.message === 'Loud sound detected!' && !debounceTimeout) {
          console.log("Loud sound detected! Attempting to send notification...");

          let location = await getCurrentLocation();
          const { xPercent, yPercent } = calculateImageCoordinates(location.latitude, location.longitude);

          if (Notification.permission === "granted") {
            new Notification('Loud sound detected!', {
              body: `A loud sound was detected at ${location.latitude}, ${location.longitude}.`,
            });
            console.log("Notification sent");

            debounceTimeout = setTimeout(() => {
              debounceTimeout = null;
            }, debounceDelay);

            await uploadMarker({ latitude: location.latitude, longitude: location.longitude });
          } else {
            console.log("Notification permission not granted");
          }

          const currentTime = new Date().toLocaleTimeString();
          const listItem = document.createElement('li');
          listItem.textContent = `Loud sound detected at ${currentTime}. Location: ${location.latitude}, ${location.longitude}`;
          loudNoiseList.appendChild(listItem);
        } else {
          console.log("Ignoring duplicate or invalid message.");
        }
      };

      source.connect(processor).connect(context.destination);

      // Mostra gli elementi
      imageContainer.classList.add('visible');
      formContainer.classList.add('visible');
      loudNoiseList.classList.add('visible');

      stopMicrophoneButton.disabled = false;
      startMicrophoneButton.disabled = true;
      console.log("Your microphone audio is being used.");
    } catch (error) {
      console.error("Error accessing the microphone", error);
      console.log("An error occurred while accessing the microphone.");
    }
  });

  stopMicrophoneButton.addEventListener("click", () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (processor) {
      processor.disconnect();
    }
    if (source) {
      source.disconnect();
    }
    if (context) {
      context.close();
    }

    // Nascondi gli elementi
    imageContainer.classList.remove('visible');
    formContainer.classList.remove('visible');
    loudNoiseList.classList.remove('visible');

    stopMicrophoneButton.disabled = true;
    startMicrophoneButton.disabled = false;
    console.log("Your microphone audio is not used anymore.");
  });

  if (Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("Notification permission granted");
      } else {
        console.log("Notification permission not granted");
      }
    }).catch(error => {
      console.error("Error requesting notification permission:", error);
    });
  } else {
    console.log("Notification permission already granted");
  }
});

async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          console.error("Error getting geolocation:", error);
          resolve({ latitude: 'Unknown', longitude: 'Unknown' });
        }
      );
    } else {
      console.log("Geolocation not supported");
      resolve({ latitude: 'Not supported', longitude: 'Not supported' });
    }
  });
}
