import React, { useState } from 'react';
import styled from 'styled-components';
import { VersionSelector } from '@/components/common/version/VersionCard';

export const VersionPlayground: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  const handleVersionSelect = (nextVersion: string) => {
    setSelectedVersion(nextVersion);
  };

  return (
    <Container>
      <Title>Version Selector Playground</Title>

      <Section>
        <SectionTitle>기본 테스트</SectionTitle>
        <VersionSelector onSelect={handleVersionSelect} />
        {selectedVersion && <Result>선택된 버전: {selectedVersion}</Result>}
      </Section>
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 48px;
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
`;

const Result = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #f0f8ff;
  border: 1px solid #1749b2;
  border-radius: 4px;
  color: #1749b2;
  font-weight: 500;
`;
