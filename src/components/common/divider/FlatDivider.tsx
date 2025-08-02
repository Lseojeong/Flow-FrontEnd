import styled from 'styled-components';
import { colors } from '@/styles/index';

const FlatDivider = styled.hr`
  border: none;
  height: 1.5px;
  margin: 16px 0 24px;
  background-color: ${colors.Normal};
`;

export default FlatDivider;