import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Toast } from './ToastPopup';
import { v4 as uuidv4 } from 'uuid';
import { ToastItem } from './ToastPopup.types';
import { Toast as ErrorToast } from './ErrorToastPopup';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [errorToasts, setErrorToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    const id = uuidv4();
    setErrorToasts((prev) => [...prev, { id, message }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const removeErrorToast = (id: string) => {
    setErrorToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  React.useEffect(() => {
    (
      window as unknown as { showToast?: typeof showToast; showErrorToast?: typeof showErrorToast }
    ).showToast = showToast;
    (
      window as unknown as { showToast?: typeof showToast; showErrorToast?: typeof showErrorToast }
    ).showErrorToast = showErrorToast;
    return () => {
      delete (
        window as unknown as {
          showToast?: typeof showToast;
          showErrorToast?: typeof showErrorToast;
        }
      ).showToast;
      delete (
        window as unknown as {
          showToast?: typeof showToast;
          showErrorToast?: typeof showErrorToast;
        }
      ).showErrorToast;
    };
  }, [showToast, showErrorToast]);

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
        {errorToasts.map((toast) => (
          <ErrorToast
            key={toast.id}
            message={toast.message}
            duration={5000}
            onClose={() => removeErrorToast(toast.id)}
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
