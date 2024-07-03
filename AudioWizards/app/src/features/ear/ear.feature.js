import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Animated } from 'react-native';
import { EarContainer, EarIcon } from './ear.style';
import { ProgressContext } from '../../features/progress-provider.feature';

import EarDefault from '@assets/icons/ears/ear-default.png';
import EarHappy from '@assets/icons/ears/ear-happy.png';
import EarAnnoyed from '@assets/icons/ears/ear-annoyed.png';
import EarFearful from '@assets/icons/ears/ear-fearful.png';
import EarDead from '@assets/icons/ears/ear-dead.png';

const spriteImages = {
  Default: EarDefault,
  Happy: EarHappy,
  Annoyed: EarAnnoyed,
  Fearful: EarFearful,
  Dead: EarDead,
};

const noiseLevelThreshold = {
  Default: 0,
  Happy: 50,
  Annoyed: 70,
  Fearful: 90,
  Dead: 105,
};

const samplesToConsider = 1000;

const Ear = ({ navigation }) => {
  const { progress, hasProgressLoaded, updateParams } =
    useContext(ProgressContext);
  const [earSprite, setEarSprite] = useState('Default');
  const pendingEmotionUpdate = useRef(null);

  // Animated values for trembling and rotation
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const rotationAnimation = useRef(new Animated.Value(0)).current;

  const updateEmotionsStats = useCallback(
    (emotion) => {
      const updatedEmotionsStats = {
        ...progress.emotionsStats,
        [emotion]: (progress.emotionsStats[emotion] || 0) + 1,
      };
      pendingEmotionUpdate.current = updatedEmotionsStats;
    },
    [progress.emotionsStats]
  );

  useEffect(() => {
    if (pendingEmotionUpdate.current) {
      updateParams({ emotionsStats: pendingEmotionUpdate.current });
      pendingEmotionUpdate.current = null;
    }
  }, [updateParams]);

  useEffect(() => {
    if (hasProgressLoaded && progress.metrics.length > samplesToConsider) {
      const recentSamples = progress.metrics.slice(-samplesToConsider);
      const averageSoundLevel =
        recentSamples.reduce((acc, curr) => acc + curr, 0) / samplesToConsider;

      setEarSprite((prevSprite) => {
        let newSprite = prevSprite;

        if (averageSoundLevel > noiseLevelThreshold.Dead) {
          newSprite = 'Dead';
        } else if (averageSoundLevel > noiseLevelThreshold.Fearful) {
          newSprite = 'Fearful';
        } else if (averageSoundLevel > noiseLevelThreshold.Annoyed) {
          newSprite = 'Annoyed';
        } else if (averageSoundLevel > noiseLevelThreshold.Happy) {
          newSprite = 'Happy';
        } else {
          newSprite = 'Default';
        }

        if (newSprite !== prevSprite) {
          if (newSprite === 'Dead') {
            updateEmotionsStats('dead');
          } else if (newSprite === 'Fearful') {
            updateEmotionsStats('fearful');
          } else if (newSprite === 'Annoyed') {
            updateEmotionsStats('annoyed');
          } else if (newSprite === 'Happy') {
            updateEmotionsStats('happy');
          }
        }

        return newSprite;
      });

      // Calculate shaking intensity using a logarithmic scale
      let shakeIntensity = 0;
      let rotationIntensity = 0;
      if (averageSoundLevel > noiseLevelThreshold.Dead) {
        shakeIntensity = 20;
        rotationIntensity = 10;
      } else if (averageSoundLevel > noiseLevelThreshold.Fearful) {
        shakeIntensity = 10;
        rotationIntensity = 5;
      } else if (averageSoundLevel > noiseLevelThreshold.Annoyed) {
        shakeIntensity = 5;
        rotationIntensity = 2;
      } else if (averageSoundLevel > noiseLevelThreshold.Happy) {
        shakeIntensity = 2;
        rotationIntensity = 1;
      } else {
        shakeIntensity = 0;
        rotationIntensity = 0;
      }



      // Reset shakeAnimation and rotationAnimation values
      shakeAnimation.setValue(0);
      rotationAnimation.setValue(0);

      // Trigger shaking and rotation animation based on sound level
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(shakeAnimation, {
              toValue: shakeIntensity,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(rotationAnimation, {
              toValue: rotationIntensity,
              duration: 50,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(shakeAnimation, {
              toValue: -shakeIntensity,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(rotationAnimation, {
              toValue: -rotationIntensity,
              duration: 50,
              useNativeDriver: true,
            }),
          ]),
        ]),
        {
          iterations: -1,
        }
      ).start();
    }
  }, [progress.metrics, hasProgressLoaded, updateEmotionsStats]);

  if (!hasProgressLoaded) {
    return null;
  }

  const rotation = rotationAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-1deg', '1deg'],
  });

  return (
    <EarContainer onPress={() => {
      navigation.navigate('Cave');
    }}>
      <Animated.View
        style={{
          transform: [{ translateX: shakeAnimation }, { rotate: rotation }],
        }}
      >
        <EarIcon source={spriteImages[earSprite]} />
      </Animated.View>
    </EarContainer>
  );
};

export default Ear;