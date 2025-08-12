import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { fontWeight, colors } from '@/styles/index';
import { textV1Logo } from '@/assets/logo';
import { Button } from '@/components/common/button/Button';
import { useFormField } from '@/hooks/useFormField';
import { FormInput } from '@/components/auth/AuthInput';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const adminIdField = useFormField({
    validations: [{ validate: (v) => v.trim() !== '', message: '* 아이디를 입력해주세요.' }],
  });

  const passwordField = useFormField({
    validations: [{ validate: (v) => v.trim() !== '', message: '* 비밀번호를 입력해주세요.' }],
  });

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled = useMemo(() => {
    return (
      adminIdField.value.trim() === '' ||
      passwordField.value.trim() === '' ||
      adminIdField.errorMessage !== '' ||
      passwordField.errorMessage !== ''
    );
  }, [
    adminIdField.value,
    adminIdField.errorMessage,
    passwordField.value,
    passwordField.errorMessage,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await login({
        adminId: adminIdField.value,
        password: passwordField.value,
      });
      setIsError(false);
      navigate('/dictionary');
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Title>모든 질문의 시작과 끝,</Title>
      <LogoTextImage src={textV1Logo} alt="로고" />
      <Form onSubmit={handleSubmit}>
        <FormInput
          id="login-id"
          label="아이디"
          placeholder="아이디를 입력하세요."
          value={adminIdField.value}
          onChange={adminIdField.onChange}
          onBlur={adminIdField.onBlur}
          error={adminIdField.errorMessage}
        />
        <FormInput
          id="login-pw"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요."
          value={passwordField.value}
          onChange={passwordField.onChange}
          onBlur={passwordField.onBlur}
          error={passwordField.errorMessage}
          hasMarginBottom={false}
        />
        <Spacer />
        {isError && <LoginErrorMessage />}
        <Button size="large" type="submit" disabled={isDisabled} isLoading={isLoading}>
          로그인
        </Button>
      </Form>
    </Card>
  );
}

function LoginErrorMessage() {
  return (
    <ErrorMessage>
      * 아이디 또는 비밀번호가 틀렸습니다. <br />
      아이디와 비밀번호를 정확하게 입력해주세요.
    </ErrorMessage>
  );
}

const Card = styled.div`
  width: 520px;
  height: 752px;
  background: ${colors.White};
  border-radius: 4px;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  color: ${colors.Black};
  font-size: 20px;
  font-weight: ${fontWeight.SemiBold};
  margin-bottom: 32px;
  text-align: center;
`;

const LogoTextImage = styled.img`
  width: 200px;
  height: 56px;
  margin-bottom: 88px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ErrorMessage = styled.div`
  width: 370px;
  color: ${colors.MainRed};
  font-size: 12px;
  text-align: right;
  margin-bottom: 16px;
  padding: 8px;
`;

const Spacer = styled.div`
  height: 0;
  margin-bottom: 16px;
`;
