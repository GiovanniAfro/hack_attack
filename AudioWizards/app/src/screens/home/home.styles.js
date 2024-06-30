import styled from 'styled-components/native';
import { View, Image } from 'react-native';

export const EarContainer = styled(View)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
  height: 100%;
`;

export const EarIcon = styled(Image)`
  width: 50px;
  height: 50px;
`;