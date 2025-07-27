import React, { useState } from 'react';
import styled from 'styled-components';
import { CommonButton } from '@/components/common/button/CommonButton';
import { colors } from '@/styles';

const ButtonPlayground: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    console.log('버튼 클릭됨!');
  };

  const handleAsyncClick = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log('비동기 작업 완료!');
  };

  return (
    <PlaygroundContainer>
      <PlaygroundHeader>
        <h1>CommonButton 컴포넌트 Playground</h1>
        <p>CommonButton의 다양한 variant, size, 상태를 테스트할 수 있는 페이지입니다.</p>
      </PlaygroundHeader>

      <Section>
        <SectionTitle>Variant 테스트</SectionTitle>
        <ButtonGroup>
          <CommonButton variant="primary" onClick={handleClick}>
            Primary 버튼
          </CommonButton>
          <CommonButton variant="dark" onClick={handleClick}>
            Dark 버튼
          </CommonButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>Size 테스트</SectionTitle>
        <ButtonGroup>
          <CommonButton size="small" onClick={handleClick}>
            Small 버튼
          </CommonButton>
          <CommonButton size="medium" onClick={handleClick}>
            Medium 버튼
          </CommonButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>Disabled 상태 테스트</SectionTitle>
        <ButtonGroup>
          <CommonButton disabled onClick={handleClick}>
            Disabled 버튼
          </CommonButton>
          <CommonButton variant="dark" disabled onClick={handleClick}>
            Disabled Dark 버튼
          </CommonButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>Full Width 테스트</SectionTitle>
        <FullWidthContainer>
          <CommonButton fullWidth onClick={handleClick}>
            Full Width 버튼
          </CommonButton>
        </FullWidthContainer>
      </Section>

      <Section>
        <SectionTitle>Icon 테스트</SectionTitle>
        <ButtonGroup>
          <CommonButton icon={<span>📁</span>} onClick={handleClick}>
            아이콘 버튼
          </CommonButton>
          <CommonButton variant="dark" icon={<span>⚙️</span>} onClick={handleClick}>
            설정 버튼
          </CommonButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>Loading 상태 테스트</SectionTitle>
        <ButtonGroup>
          <CommonButton disabled={isLoading} onClick={handleAsyncClick}>
            {isLoading ? '로딩 중...' : '비동기 작업'}
          </CommonButton>
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>모든 조합 테스트</SectionTitle>
        <ButtonGroup>
          <CommonButton variant="primary" size="small" icon={<span>➕</span>} onClick={handleClick}>
            Primary Small
          </CommonButton>
          <CommonButton variant="dark" size="medium" icon={<span>🔍</span>} onClick={handleClick}>
            Dark Medium
          </CommonButton>
        </ButtonGroup>
      </Section>
    </PlaygroundContainer>
  );
};

const PlaygroundContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PlaygroundHeader = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${colors.Black};
  }

  p {
    font-size: 14px;
    color: ${colors.BoxText};
    margin: 0;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${colors.Black};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const FullWidthContainer = styled.div`
  width: 100%;
`;

export default ButtonPlayground;
