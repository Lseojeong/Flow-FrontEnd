import { createGlobalStyle } from 'styled-components';
import colors from './colors';
import fontWeights from './fontWeights';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Pretendard', sans-serif;
    color: ${colors.text.primary};
    background-color: ${colors.background};
    font-weight: ${fontWeights.Regular};
  }

  a {
    color: ${colors.Normal};
  }
`;

export default GlobalStyle;
