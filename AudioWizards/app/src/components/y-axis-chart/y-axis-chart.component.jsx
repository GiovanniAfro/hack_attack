import React from 'react';
import { YAxis, LineChart, Grid } from 'react-native-svg-charts';

import { YAxisChartContainer } from './y-axis-chart.style';

const YAxisChart = ({ data, color }) => {
  const contentInset = { top: 0, bottom: 20 };

  const latestDataSlice = data.slice(-100);
  
  return (
    <YAxisChartContainer>
      <YAxis
        data={latestDataSlice}
        contentInset={contentInset}
        svg={{
          fill: 'grey',
          fontSize: 10,
        }}
        numberOfTicks={10}
        formatLabel={(value) => `${value}dB`}
      />
      <LineChart
        style={{ flex: 1, marginLeft: 16 }}
        data={latestDataSlice}
        svg={{ stroke: color }}
        contentInset={contentInset}
      >
      </LineChart>
    </YAxisChartContainer>
  );
};

export default YAxisChart;
