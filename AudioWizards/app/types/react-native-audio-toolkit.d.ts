declare module 'react-native-audio-record' {
  type AudioRecordOptions = {
    sampleRate?: number;
    channels?: number;
    bitsPerSample?: number;
    audioSource?: number;
    wavFile?: string;
  };

  type AudioRecordModule = {
    init: (options: AudioRecordOptions) => void;
    start: () => void;
    stop: () => Promise<string>;
    on: (event: string, callback: (data: string) => void) => void;
    // Remove the off method if it doesn't exist
    // off: (event: string, callback: (data: string) => void) => void;
  };

  const AudioRecord: AudioRecordModule;

  export default AudioRecord;
}
