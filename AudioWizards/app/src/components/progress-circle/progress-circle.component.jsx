import React from 'react';
import { ProgressCircle as ProgressCircleChart } from 'react-native-svg-charts';

import {
  ProgressCircleContainer,
  CentralImage,
} from './progress-circle.style';

const ProgressCircle = ({ progress, color, image, styles }) => {
  return (
    <ProgressCircleContainer>
      <ProgressCircleChart
        style={{ height: 150, width: 150, ...styles }}
        progress={progress}
        progressColor={color}
        strokeWidth={15}
      />
      <CentralImage source={image} />
    </ProgressCircleContainer>
  );
};

export default ProgressCircle;
