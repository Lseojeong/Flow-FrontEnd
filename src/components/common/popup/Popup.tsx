import React, { useEffect } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { Props } from './Popup.types';
import { Button } from '@/components/common/button/Button';
import { Loading } from '@/components/common/loading/Loading';

export const Popup: React.FC<Props> = (props) => {
  const { isOpen, title, message, onClose } = props;

  const defaultTitle = title || (props.isAlert ? '알림' : '파일 삭제');
  const defaultMessage =
    message || (props.isAlert ? '작업이 완료되었습니다.' : '정말로 삭제하시겠습니까?');
  // ESC 키로 팝업 닫기
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // 배경 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ContentWrapper>
          <Title>{defaultTitle}</Title>
          <Divider />
          <Content>
            <Message>{defaultMessage}</Message>
            {!props.isAlert && props.warningMessages && props.warningMessages.length > 0 && (
              <WarningContainer>
                {props.warningMessages.map((warning: string, index: number) => (
                  <WarningMessage key={index}>*{warning}</WarningMessage>
                ))}
              </WarningContainer>
            )}
          </Content>
          <ButtonContainer>
            {props.isAlert ? (
              <Button variant="primary" size="medium" onClick={onClose}>
                {props.alertButtonText || '확인'}
              </Button>
            ) : (
              <>
                <Button variant="dark" size="medium" onClick={onClose}>
                  {props.cancelText || '취소'}
                </Button>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={props.onDelete}
                  disabled={props.disabled}
                >
                  {props.disabled ? (
                    <Loading size={12} color="white" />
                  ) : (
                    props.confirmText || '삭제'
                  )}
                </Button>
              </>
            )}
          </ButtonContainer>
        </ContentWrapper>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 4px;
  width: 524px;
  height: 232px;
  padding: 32px;
  border: 2px solid ${colors.Normal};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
  text-align: center;
  margin: 0 0 8px 0;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  width: 100%;
  background-color: ${colors.Normal};
  margin: 0 0 24px 0;
`;

const Content = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Message = styled.p`
  font-size: 16px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
  margin: 0 0 8px 0;
  line-height: 1.5;
  text-align: center;
  white-space: pre-line;
`;

const WarningContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
`;

const WarningMessage = styled.p`
  font-size: 14px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.MainRed};
  margin: 0;
  line-height: 1.4;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;
