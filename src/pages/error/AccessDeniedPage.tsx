import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { symbolLogo, textV2Logo } from '@/assets/logo';
import { colors, fontWeight } from '@/styles/index';

const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <LogoGroup>
        <LogoIcon src={symbolLogo} alt="Flow Icon" />
        <LogoText src={textV2Logo} alt="Flow Text" />
      </LogoGroup>
      <Message>접근 불가한 페이지 입니다.</Message>
      <BackButton onClick={() => navigate('/')}>홈으로 돌아가기</BackButton>
    </Wrapper>
  );
};

export default AccessDeniedPage;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: ${colors.Dark_hover};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const LogoIcon = styled.img`
  width: 180px;
  height: 140px;
  margin-bottom : 10px;
`;

const LogoText = styled.img`
  width: 160px;
  height: auto;
  margin-bottom : 30px;
`;

const Message = styled.p`
  color: ${colors.White};
  font-size: 18px;
  margin-bottom: 50px;
  font-weight: ${fontWeight.Medium}
  fonr-size : 24px
`;

const BackButton = styled.button`
  background-color: ${colors.background};
  color: ${colors.Normal_hover};
  width : 200px;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
  background: ${colors.Light};
  }
`;
