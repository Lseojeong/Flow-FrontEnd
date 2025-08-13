import styled from 'styled-components';
import { fontWeight, colors } from '@/styles/index';

export const VersionText = ({ latestVersion }: { latestVersion: string }) => {
  return <CurrentVersionText>현재 버전: {latestVersion}</CurrentVersionText>;
};

const CurrentVersionText = styled.span`
  font-size: 12px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
`;
