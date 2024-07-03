import styled from 'styled-components/native';
import { View, Text, Image } from 'react-native';

export const ProgressCircleContainer = styled(View)`
  margin-top: ${({ theme }) => theme.space[4]};
`;

export const CentralImage = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50px, -145px);
`;