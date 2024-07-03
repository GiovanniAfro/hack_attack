import styled from 'styled-components/native';
import { ScrollView, View, Text } from 'react-native';

export const StatsContainer = styled(ScrollView)`
  display: flex;
  flex: 1;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
  height: 100%;
`;

export const SectionTitle = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.h3};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fonts.headingBold};
  margin: ${({ theme }) => theme.space[3]} 0;
`;

export const EmotionsContainer = styled(View)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;