import React, { useContext, useState, useEffect } from 'react';
import { View } from 'react-native';

import {
  EmotionsContainer,
  SectionTitle,
  StatsContainer,
} from './stats.styles';

import { ProgressContext } from '../../features/progress-provider.feature';
import ProgressCircle from '@components/progress-circle/progress-circle.component';
import YAxisChart from '@components/y-axis-chart/y-axis-chart.component';

import HappyBat from '../../../assets/icons/bats/bat-happy.png';
import FearfulBat from '../../../assets/icons/bats/bat-fearful.png';
import AnnoyedBat from '../../../assets/icons/bats/bat-annoyed.png';

const Stats = () => {
  const { progress, hasProgressLoaded } = useContext(ProgressContext);
  const [totalEmotions, setTotalEmotions] = useState(0);

  useEffect(() => {
    if (hasProgressLoaded) {
      const total = Object.values(progress.emotionsStats).reduce(
        (acc, curr) => acc + curr,
        0
      );
      setTotalEmotions(total);
    }
  }, [progress.emotionsStats, hasProgressLoaded]);

  const getNormalizedProgress = (emotionCount) => {
    return totalEmotions > 0 ? emotionCount / totalEmotions : 0;
  };

  if (!hasProgressLoaded) {
    return null;
  }

  return (
    <StatsContainer
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <SectionTitle>EMOTIONS</SectionTitle>
      <EmotionsContainer>
        <ProgressCircle
          progress={getNormalizedProgress(progress.emotionsStats.happy)}
          color='#000'
          image={HappyBat}
        />
        <ProgressCircle
          progress={getNormalizedProgress(progress.emotionsStats.fearful)}
          color='#000'
          image={FearfulBat}
        />
        <ProgressCircle
          progress={getNormalizedProgress(progress.emotionsStats.annoyed)}
          color='#000'
          image={AnnoyedBat}
        />
        <ProgressCircle
          progress={getNormalizedProgress(progress.emotionsStats.dead)}
          color='#000'
          image={HappyBat}
        />
      </EmotionsContainer>
      <View
        style={{
          height: 5,
          width: '90%',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      />
      <SectionTitle>NOISE METRICS</SectionTitle>
      <YAxisChart data={progress.metrics} color={'#000'} />
    </StatsContainer>
  );
};

export default Stats;
