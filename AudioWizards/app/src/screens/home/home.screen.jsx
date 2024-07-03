// src/screens/home/home.screen.js
import React, { useEffect, useState, useRef, useContext } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';

import RealTimeChart from '@components/real-time-chart/real-time-chart.component';
import StaticBackground from '@components/static-background.component';
import Ear from '@features/ear/ear.feature';

import { ProgressContext } from '../../features/progress-provider.feature';
import HomeBackground from '@features/home-background.feature';

const Home = ({ navigation }) => {
  const { progress, hasProgressLoaded, updateMetrics } =
    useContext(ProgressContext);

  const DATA_LENGTH = 25;

  const [recording, setRecording] = useState(null);
  const [soundLevel, setSoundLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [data, setData] = useState([0]);
  const [negativeData, setNegativeData] = useState([0]);

  const dataRef = useRef([0]); // Use ref to keep track of the data array without re-rendering

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Microphone access needed to record audio.'
        );
        return;
      }

      startRecording();
    })();

    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      if (recording) {
        stopRecording();
      }

      const recordingInstance = new Audio.Recording();
      await recordingInstance.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 1000,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.caf',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 1000,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        isMeteringEnabled: true,
      });
      await recordingInstance.startAsync();
      setRecording(recordingInstance);
      setIsRecording(true);
      console.log('Recording started');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      recordingInstance.setOnRecordingStatusUpdate((update) => {
        if (update) {
          const normalizedSoundLevel = normalizeMetering(update.metering);
          setSoundLevel(normalizedSoundLevel);
          updateChartData(normalizedSoundLevel);
        }
      });
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const normalizeMetering = (meteringValue) => {
    const normalizedValue = meteringValue + 120;
    if (normalizedValue < 0) return 0;
    return normalizedValue;
  };

  const updateChartData = (value) => {
    dataRef.current = [...dataRef.current, value];
    if (dataRef.current.length > DATA_LENGTH) {
      dataRef.current.shift();
    }

    setData([...dataRef.current]);
    setNegativeData([...dataRef.current.map((val) => -val)]);
  };

  useEffect(() => {
    if (hasProgressLoaded) {
      updateMetrics(dataRef.current);
    }
  }, [data]);

  if (!hasProgressLoaded) {
    return null;
  }

  return (
    <>
      <HomeBackground />
      <RealTimeChart data={data} negativeData={negativeData} />
      <Ear soundLevel={soundLevel} navigation={navigation} />
    </>
  );
};

export default Home;
