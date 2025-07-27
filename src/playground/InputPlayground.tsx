import React, { useState } from 'react';
import styled from 'styled-components';
import { CategoryInput } from '@/components/common/category-input/CategoryInput';
import { CategoryDescription } from '@/components/common/category-description/CategoryDescription';
import { UploadInput } from '@/components/common/file-upload/FileUpload';
import { colors, fontWeight } from '@/styles/index';

const InputPlayground: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    console.log('선택된 파일:', file);
  };

  return (
    <Container>
      <Title>Input 컴포넌트 테스트</Title>

      <Section>
        <SectionTitle>🏷️ CategoryInput 테스트</SectionTitle>
        <TestCase>
          <CategoryInput value={inputValue} onChange={setInputValue} />
          <Info>
            현재 값: {`"${inputValue}"`} | 길이: {inputValue.length}/10
          </Info>
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>📝 CategoryDescription 테스트</SectionTitle>
        <TestCase>
          <CategoryDescription />
          <Info>
            • 50글자 제한 input 필드
            <br />
            • 우측에 실시간 글자수 카운터
            <br />
            • 40글자부터 주황색, 50글자 진한 주황색
            <br />
            • 빈 값일 때 에러 메시지 표시
            <br />• 텍스트 중앙 정렬
          </Info>
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>📁 FileUpload 테스트</SectionTitle>
        <TestCase>
          <UploadInput onFileSelect={handleFileSelect} />
          {selectedFile && (
            <Info>
              선택된 파일: {`"${selectedFile.name}"`} | 크기:{' '}
              {(selectedFile.size / 1024).toFixed(2)}KB | 타입: {selectedFile.type || 'text/csv'}
            </Info>
          )}
          {!selectedFile && (
            <Info>
              • CSV 파일만 업로드 가능
              <br />
              • 최대 20MB 제한
              <br />
              • 에러 발생 시 우측 상단에 메시지 표시
              <br />• 정상 파일 선택 시 파일명 표시
            </Info>
          )}
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>🔗 세 컴포넌트 함께 사용</SectionTitle>
        <TestCase>
          <FormWrapper>
            <CategoryInput value={inputValue} onChange={setInputValue} />
            <CategoryDescription />
            <UploadInput onFileSelect={handleFileSelect} />
          </FormWrapper>
          <Info>실제 폼에서 사용하는 예시: 카테고리명, 설명, 파일 업로드를 함께 입력</Info>
        </TestCase>
      </Section>
    </Container>
  );
};

export default InputPlayground;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Black};
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 3px solid ${colors.Normal};
  padding-bottom: 16px;
`;

const Section = styled.div`
  margin-bottom: 40px;
  background-color: ${colors.White};
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Black};
  margin-bottom: 24px;
  padding-left: 8px;
  border-left: 4px solid ${colors.Normal};
`;

const TestCase = styled.div`
  padding: 20px;
  border: 1px solid ${colors.BoxStroke};
  border-radius: 8px;
  background-color: #fafafa;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Info = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: ${colors.Light};
  border-radius: 6px;
  font-size: 13px;
  color: ${colors.Black};
  line-height: 1.6;
  border-left: 3px solid ${colors.Normal};
`;
