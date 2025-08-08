import styled from 'styled-components';
import { fontWeight, colors } from '@/styles/index';
import { LoginForm } from '@/components/auth/LoginForm';
import { symbolLogo } from '@/assets/logo/index';
import { useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    logout();

    const handleResize = () => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollLeft = wrapperRef.current.scrollWidth;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [logout]);

  return (
    <>
      <PageWrapper ref={wrapperRef}>
        <LogoWrapper>
          <LogoImage src={symbolLogo} alt="로고" />
          <LogoText>
            <TextLine>Find,</TextLine>
            <TextLine>Link,</TextLine>
            <TextLine>Organize,</TextLine>
            <TextLine>Work</TextLine>
          </LogoText>
        </LogoWrapper>
        <LoginForm />
      </PageWrapper>
    </>
  );
}

const PageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  background: ${colors.Dark_hover};
  overflow-x: auto;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 0;
  padding-left: 110px;
  padding-right: 110px;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
`;

const LogoImage = styled.img`
  width: 160px;
  height: 115px;
  margin-bottom: 16px;
`;

const LogoText = styled.h2`
  color: ${colors.White};
  font-size: 60px;
  font-weight: ${fontWeight.ExtraBold};
  text-align: center;
  line-height: 1;
`;

const TextLine = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;
