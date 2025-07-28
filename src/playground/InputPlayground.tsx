import React, { useState } from 'react';
import styled from 'styled-components';
import { CategoryInput } from '@/components/common/category-input/CategoryInput';
import { DescriptionInput } from '@/components/common/description-input/DescriptionInput';
import { UploadInput } from '@/components/common/file-upload/FileUpload';
import { colors, fontWeight } from '@/styles/index';

const InputPlayground: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCsvFile, setSelectedCsvFile] = useState<File | null>(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);

  const handleCsvFileSelect = (file: File) => {
    setSelectedCsvFile(file);
    console.log('선택된 CSV 파일:', file);
  };

  const handlePdfFileSelect = (file: File) => {
    setSelectedPdfFile(file);
    console.log('선택된 PDF 파일:', file);
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
        <SectionTitle>📝 DescriptionInput 테스트</SectionTitle>
        <TestCase>
          <DescriptionInput />
          <Info>
            • 기본: 50글자 제한, &quot;설명&quot; 라벨
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
        <SectionTitle>📋 히스토리 설명 테스트</SectionTitle>
        <TestCase>
          <DescriptionInput
            label="히스토리 설명"
            placeholder="히스토리 설명을 작성해주세요."
            maxLength={30}
            errorMessage="히스토리 설명을 입력해주세요."
          />
          <Info>
            • 커스텀: 30글자 제한, &quot;히스토리 설명&quot; 라벨
            <br />
            • 24글자부터 주황색, 30글자 진한 주황색
            <br />
            • 전용 placeholder 및 에러 메시지
            <br />• 같은 컴포넌트, 다른 설정으로 재사용
          </Info>
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>📊 CSV FileUpload 테스트</SectionTitle>
        <TestCase>
          <UploadInput fileType="csv" onFileSelect={handleCsvFileSelect} />
          {selectedCsvFile && (
            <Info>
              선택된 CSV 파일: {`"${selectedCsvFile.name}"`} | 크기:{' '}
              {(selectedCsvFile.size / 1024).toFixed(2)}KB | 타입:{' '}
              {selectedCsvFile.type || 'text/csv'}
            </Info>
          )}
          {!selectedCsvFile && (
            <Info>
              • CSV 파일만 업로드 가능
              <br />
              • 최대 20MB 제한
              <br />
              • 에러 발생 시 상단에 메시지 표시
              <br />• 정상 파일 선택 시 파일명 표시 및 파란색 외곽선
            </Info>
          )}
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>📄 PDF FileUpload 테스트</SectionTitle>
        <TestCase>
          <UploadInput fileType="pdf" onFileSelect={handlePdfFileSelect} />
          {selectedPdfFile && (
            <Info>
              선택된 PDF 파일: {`"${selectedPdfFile.name}"`} | 크기:{' '}
              {(selectedPdfFile.size / 1024).toFixed(2)}KB | 타입:{' '}
              {selectedPdfFile.type || 'application/pdf'}
            </Info>
          )}
          {!selectedPdfFile && (
            <Info>
              • PDF 파일만 업로드 가능
              <br />
              • 최대 20MB 제한
              <br />
              • 에러 발생 시 상단에 메시지 표시
              <br />• 정상 파일 선택 시 파일명 표시 및 파란색 외곽선
            </Info>
          )}
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>🔗 세 컴포넌트 함께 사용</SectionTitle>
        <TestCase>
          <FormWrapper>
            <CategoryInput value={inputValue} onChange={setInputValue} />
            <DescriptionInput />
            <UploadInput fileType="csv" onFileSelect={handleCsvFileSelect} />
            <UploadInput fileType="pdf" onFileSelect={handlePdfFileSelect} />
          </FormWrapper>
          <Info>
            실제 폼에서 사용하는 예시: 카테고리명, 설명, CSV 파일, PDF 파일 업로드를 함께 입력
          </Info>
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
