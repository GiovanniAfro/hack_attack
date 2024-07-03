import styled from 'styled-components/native';
import { View } from 'react-native';

export const ShopContainer = styled(View)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
  height: 100%;
`;