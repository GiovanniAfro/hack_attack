import styled from 'styled-components/native';
import { View, Image, TouchableOpacity } from 'react-native';

export const EarContainer = styled(TouchableOpacity)`
  position: relative;
  display: flex;
  flex: 1;
  padding-top: ${({ theme }) => theme.space[4]};
  justify-content: flex-start;
  align-items: center;
`;

export const EarMaskContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
`;

export const EarIcon = styled(Image)`
  position: relative;
  width: 280px;
  height: 450px;
`;

export const EarIconMask = styled(Image)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: -20px;
  left: -5px;
  overflow: hidden;
`;

export const BatIcon = styled(Image)`
  transform: translateX(-50px) rotate(5deg);
  width: 100px;
  height: 150px;
  position: absolute;
  bottom: 32%;
  left: 43%;
  z-index: 20;
`;
