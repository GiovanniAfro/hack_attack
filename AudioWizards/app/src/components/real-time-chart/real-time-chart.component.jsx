import React from 'react';
import { BarChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

import { RealTimeChartContainer } from './real-time-chart.style';

const RealTimeChart = ({ data, negativeData}) => {
  //console.log('Chart data:', data); // Debugging line

  return (
    <RealTimeChartContainer>
      <BarChart
        style={{ height: 90 }}
        data={data}
        contentInset={{ top: 30, bottom: 0, left: 80, right: 80 }}
        curve={shape.curveNatural}
        svg={{ fill: 'rgba(255, 255, 255, 1)' }}
        spacingInner={0.3}
      ></BarChart>
      <BarChart
        style={{ height: 90 }}
        data={negativeData}
        contentInset={{ top: 0, bottom: 30, left: 80, right: 80 }}
        curve={shape.curveNatural}
        svg={{ fill: 'rgba(255, 255, 255, 1)' }}
        spacingInner={0.3}
      ></BarChart>
    </RealTimeChartContainer>
  );
};

export default RealTimeChart;
