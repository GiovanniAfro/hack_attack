class LoudnessProcessor extends AudioWorkletProcessor {
	constructor() {
	  super();
	  this.threshold = 0.5; // Lower threshold for testing
	}
  
	process(inputs, outputs, parameters) {
	  if (inputs.length > 0 && inputs[0].length > 0) {
		const input = inputs[0];
		const channelData = input[0];
		let sum = 0;
		for (let i = 0; i < channelData.length; i++) {
		  sum += channelData[i] * channelData[i];
		}
		const rms = Math.sqrt(sum / channelData.length);
  
		if (rms > this.threshold) {
		  this.port.postMessage({ message: 'Loud sound detected!' });
		}
	  }
	  return true;
	}
  }
  
  registerProcessor('loudness-processor', LoudnessProcessor);
  