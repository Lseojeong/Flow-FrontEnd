import React, { useState } from 'react';
import styled from 'styled-components';
import { Popup } from '@/components/common/popup/Popup';
import { Button } from '@/components/common/button/Button';
import { colors, fontWeight } from '@/styles/index';

export const PopupPlayground: React.FC = () => {
  const [showDeleteFilePopup, setShowDeleteFilePopup] = useState(false);
  const [showDeleteCategoryPopup, setShowDeleteCategoryPopup] = useState(false);
  const [showDeleteDepartmentPopup, setShowDeleteDepartmentPopup] = useState(false);
  const [showCustomPopup, setShowCustomPopup] = useState(false);

  const handleConfirm = (type: string) => {
    alert(`${type} 완료되었습니다!`);
    // 모든 팝업 닫기
    setShowDeleteFilePopup(false);
    setShowDeleteCategoryPopup(false);
    setShowDeleteDepartmentPopup(false);
    setShowCustomPopup(false);
  };

  return (
    <Container>
      <Title>Popup 컴포넌트 테스트</Title>

      <Section>
        <SectionTitle>📄 파일 삭제 팝업</SectionTitle>
        <TestCase>
          <Button variant="dark" size="medium" onClick={() => setShowDeleteFilePopup(true)}>
            파일 삭제 팝업 열기
          </Button>
          <Info>
            • 기본 파일 삭제 팝업
            <br />• 제목: {`"파일 삭제"`}
            <br />
            • 통합된 메시지 (줄바꿈 포함)
            <br />• 버튼: 취소 / 삭제
          </Info>
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>📁 카테고리 삭제 팝업</SectionTitle>
        <TestCase>
          <Button variant="dark" size="medium" onClick={() => setShowDeleteCategoryPopup(true)}>
            카테고리 삭제 팝업 열기
          </Button>
          <Info>
            • 카테고리 삭제 팝업
            <br />• 제목: {`"카테고리 삭제"`}
            <br />
            • 통합된 메시지 (줄바꿈 포함)
            <br />• 하위 파일 삭제 경고 포함
          </Info>
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>🏢 관리자 부서 삭제 팝업</SectionTitle>
        <TestCase>
          <Button variant="dark" size="medium" onClick={() => setShowDeleteDepartmentPopup(true)}>
            관리자 부서 삭제 팝업 열기
          </Button>
          <Info>
            • 관리자 부서 삭제 팝업
            <br />• 제목: {`"관리자 부서 삭제"`}
            <br />
            • * 표시된 경고 메시지 2개
            <br />• 연결된 카테고리/사용자 수정 필요
          </Info>
        </TestCase>
      </Section>

      <Section>
        <SectionTitle>✅ 완료 알림 팝업</SectionTitle>
        <TestCase>
          <Button variant="primary" size="medium" onClick={() => setShowCustomPopup(true)}>
            완료 알림 팝업 열기
          </Button>
          <Info>
            • 삭제 완료 알림 팝업
            <br />• 제목: {`"관리자 부서 삭제"`}
            <br />• 메시지: {`"삭제가 완료되었습니다."`}
            <br />• 확인 버튼만 표시 (경고 메시지 없음)
          </Info>
        </TestCase>
      </Section>

      {/* 팝업들 */}
      <Popup
        isOpen={showDeleteFilePopup}
        title="파일 삭제"
        message="document.pdf 파일을 삭제하시겠습니까?
삭제한 파일은 복구할 수 없습니다."
        onClose={() => setShowDeleteFilePopup(false)}
        onDelete={() => handleConfirm('파일 삭제')}
      />

      <Popup
        isOpen={showDeleteCategoryPopup}
        title="카테고리 삭제"
        message="카테고리를 삭제하시겠습니까?
        카테고리와 포함된 모든 파일이 함께 삭제됩니다."
        onClose={() => setShowDeleteCategoryPopup(false)}
        onDelete={() => handleConfirm('카테고리 삭제')}
      />

      <Popup
        isOpen={showDeleteDepartmentPopup}
        title="관리자 부서 삭제"
        message="정말로 관리자 부서를 삭제하시겠습니까?"
        warningMessages={['연결된 카테고리를 수정하거나 삭제하세요']}
        onClose={() => setShowDeleteDepartmentPopup(false)}
        onDelete={() => handleConfirm('관리자 부서 삭제')}
      />

      <Popup
        isOpen={showCustomPopup}
        title="관리자 부서 삭제"
        message="삭제가 완료되었습니다."
        isAlert={true}
        alertButtonText="확인"
        onClose={() => setShowCustomPopup(false)}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: ${fontWeight.Bold};
  color: ${colors.Normal};
  margin-bottom: 40px;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 40px;
  padding: 24px;
  border: 1px solid ${colors.BoxStroke};
  border-radius: 8px;
  background-color: ${colors.background};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
  margin-bottom: 16px;
`;

const TestCase = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Info = styled.div`
  flex: 1;
  font-size: 14px;
  color: ${colors.BoxText};
  line-height: 1.6;
  padding: 12px 16px;
  background-color: ${colors.Light};
  border-radius: 6px;
  border-left: 3px solid ${colors.Normal};
`;
