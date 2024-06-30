<!-- <template>
  <div class="audio-recorder">
    <b-button @click="startRecording" variant="danger" v-if="!isRecording">
      <span class="record-line"></span> Record
    </b-button>
    <b-button @click="stopRecording" variant="danger" v-else>
      <span class="record-line"></span> Stop
    </b-button>
    <b-button @click="playAudio" variant="primary" :disabled="!audioUrl" class="mt-3">
      <span class="record-line"></span> Play
    </b-button>
    <canvas ref="visualizer" class="visualizer"></canvas>
  </div>
</template>


<script>
export default {
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      audioChunks: [],
      audioUrl: null,
      audioContext: null,
      analyser: null,
      dataArray: null,
      bufferLength: null,
      animationId: null
    };
  },
  methods: {
    async startRecording() {
      this.isRecording = true;
      this.audioChunks = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      source.connect(analyser);
      analyser.fftSize = 2048;
      this.bufferLength = analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      this.analyser = analyser;
      this.audioContext = audioContext;

      this.drawVisualizer();

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = this.saveRecording;

      this.mediaRecorder.start();
    },
    stopRecording() {
      this.isRecording = false;
      this.mediaRecorder.stop();
      cancelAnimationFrame(this.animationId);
    },
    async saveRecording() {
      const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('file', blob);

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      this.audioUrl = data.audioUrl; // Assuming the server returns the URL of the saved audio file
    },
    playAudio() {
      const audio = new Audio(this.audioUrl);
      audio.play();
      audio.onplay = () => {
        const source = this.audioContext.createMediaElementSource(audio);
        source.connect(this.analyser);
        this.drawVisualizer();
      };
      audio.onended = () => {
        cancelAnimationFrame(this.animationId);
      };
    },
    drawVisualizer() {
      const canvas = this.$refs.visualizer;
      const canvasCtx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      const draw = () => {
        this.analyser.getByteTimeDomainData(this.dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, width, height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        const sliceWidth = (width * 1.0) / this.bufferLength;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
          const v = this.dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();

        this.animationId = requestAnimationFrame(draw);
      };

      draw();
    }
  }
};
</script>

<style>
.audio-recorder {
  text-align: center;
}

.record-line {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: red;
  margin-right: 8px;
  border-radius: 50%;
}

.visualizer {
  width: 100%;
  height: 150px;
  border: 1px solid #ddd;
  margin-top: 20px;
}
</style> -->






<template>
    <div class="audio-recorder">
      <b-button class="Record" @click="startRecording" variant="danger" v-if="!isRecording">
        <span class="record-line"></span> Record
      </b-button>
      <b-button class="Record" @click="stopRecording" variant="danger" v-else>
        <span class="record-line"></span> Stop
      </b-button>
      <b-button class="Play" @click="playAudio" variant="primary">
        <span class="record-line"></span> Play
      </b-button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { axiosInstance } from '../axios-config';
import { WaveFile } from 'wavefile';

// Reactive state
const isRecording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const audioUrl = ref(null);
const recordingData = ref(null);

// Start recording
const startRecording = async () => {
  isRecording.value = true;
  audioChunks.value = [];

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder.value = new MediaRecorder(stream, { mimeType: 'audio/webm' });

  mediaRecorder.value.ondataavailable = (event) => {
    audioChunks.value.push(event.data);
    console.log('Audio chunk available:', event.data);
  };

  mediaRecorder.value.onstop = async () => {
    console.log('Recording stopped, audio chunks:', audioChunks.value);
    await saveRecording();
  };

  mediaRecorder.value.start();
};

// Stop recording
const stopRecording = () => {
  isRecording.value = false;
  mediaRecorder.value.stop();
};

// Save recording
const saveRecording = async () => {

    if (audioChunks.value.length === 0) {
    console.error('No audio chunks recorded.');
    return;
  }

  const webmBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
  // Read the Blob as an ArrayBuffer
  const arrayBuffer = await webmBlob.arrayBuffer();

  // Decode the WebM audio data to PCM
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Convert PCM to WAV using WaveFile
  const wav = new WaveFile();
  wav.fromScratch(1, audioBuffer.sampleRate, '16', audioBuffer.getChannelData(0));

  // Create a new Blob from the WAV data
  const wavBlob = new Blob([wav.toBuffer()], { type: 'audio/wav' });

  console.log('WAV Blob created:', wavBlob);
  // Create a FormData object and append the WAV Blob
  const formData = new FormData();
  formData.append('file', wavBlob, 'recording.wav');

  try {
    const response = await axiosInstance.post('http://localhost:8000/process-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    recordingData.value = response.data;
    console.log(recordingData.value);
    audioUrl.value = recordingData.value.audioUrl; // Assuming the server returns the URL of the saved audio file
  } catch (error) {
    console.error(error);
  }
};

// Play audio
const playAudio = () => {
  const audio = new Audio(audioUrl.value);
  audio.play();
};

</script>


<style>
.audio-recorder {
	display: flex;
	flex-direction: column;
	text-align: center;
}

.Record, .Play {
	margin: 20px auto;
}


.record-line {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: red;
  margin-right: 8px;
  border-radius: 50%;
}
</style>
