import styled from 'styled-components/native';
import { View } from 'react-native';

export const YAxisChartContainer = styled(View)`
  height: 200px;
  flex-direction: row;
  padding: 0 ${({ theme }) => theme.space[3]};
`;