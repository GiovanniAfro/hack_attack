import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground, View } from 'react-native';

import NoiseLevel00 from '../../assets/backgrounds/noise-lv-00.jpg';
import NoiseLevel01 from '../../assets/backgrounds/noise-lv-01.jpg';
import NoiseLevel02 from '../../assets/backgrounds/noise-lv-02.jpg';

import { ProgressContext } from '../features/progress-provider.feature';

const spriteImages = {
  Noise_00: NoiseLevel00,
  Noise_01: NoiseLevel01,
  Noise_02: NoiseLevel02,
};

const noiseLevelThreshold = {
  Noise_00: 0,
  Noise_01: 70,
  Noise_03: 100,
};

const samplesToConsider = 1000;

const HomeBackground = () => {
  const { progress, hasProgressLoaded } = useContext(ProgressContext);
  const [backgroundSprite, setBackgroundSprite] = useState('Noise_00');

  useEffect(() => {
    if (hasProgressLoaded && progress.metrics.length > samplesToConsider) {
      const recentSamples = progress.metrics.slice(-samplesToConsider);
      const averageSoundLevel =
        recentSamples.reduce((acc, curr) => acc + curr, 0) / samplesToConsider;

      if (
        averageSoundLevel > noiseLevelThreshold.Noise_02 &&
        backgroundSprite !== 'Noise_02'
      ) {
        setBackgroundSprite('Noise_02');
      } else if (
        averageSoundLevel > noiseLevelThreshold.Noise_01 &&
        backgroundSprite !== 'Noise_01'
      ) {
        setBackgroundSprite('Noise_01');
      } else if (
        averageSoundLevel <= noiseLevelThreshold.Noise_01 &&
        backgroundSprite !== 'Noise_00'
      ) {
        setBackgroundSprite('Noise_00');
      }
    }
  }, [progress, hasProgressLoaded]);

  return (
    <>
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: -1,
        }}
      />
      <ImageBackground
        source={spriteImages[backgroundSprite]}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -2,
        }}
      />
    </>
  );
};

export default HomeBackground;
