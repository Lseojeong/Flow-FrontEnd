import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Toast } from './ToastPopup';
import { v4 as uuidv4 } from 'uuid';
import { ToastItem } from './ToastPopup.types';

/**
 * @example
 * 개발자모드에서 테스트용 전역 함수
 * showToast('테스트 메시지입니다!')
   showToast('두 번째 토스트입니다!')
   showToast('세 번째 토스트입니다!')
 */

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // 개발자 도구 테스트용 전역 함수
  React.useEffect(() => {
    (window as unknown as { showToast?: typeof showToast }).showToast = showToast;
    return () => {
      delete (window as unknown as { showToast?: typeof showToast }).showToast;
    };
  }, [showToast]);

  return (
    <>
      <Wrapper>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            duration={5000}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
  pointer-events: none;
`;
