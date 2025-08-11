import React from 'react';
import styled from 'styled-components';
import { fontWeight, colors } from '@/styles/index';
import { textV1Logo } from '@/assets/logo/index';
import { Button } from '@/components/common/button/Button';
import { useFormField } from '@/hooks/useFormField';
import { FormInput } from '@/components/auth/AuthInput';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAdminSignup, checkAdminIdExists } from '@/apis/auth/api';

interface SigninFormProps {
  invitationToken: string;
}

export function SigninForm({ invitationToken }: SigninFormProps) {
  const navigate = useNavigate();

  const [isIdChecked, setIsIdChecked] = useState(false);
  const [checkError, setCheckError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const nameField = useFormField({
    validations: [
      { validate: (v) => v.trim() !== '', message: '* 닉네임을 입력해주세요.' },
      {
        validate: (v) => /^[가-힣]{1,4}$/.test(v),
        message: '* 올바른 한글 닉네임을 입력해주세요.(최대 4글자)',
      },
    ],
  });

  const adminIdField = useFormField({
    validations: [
      { validate: (v) => v.trim() !== '', message: '* 아이디를 입력해주세요.' },
      {
        validate: (v) => /^[a-zA-Z0-9]{1,12}$/.test(v),
        message: '* 영어와 숫자만 입력 가능하며 최대 12자까지 가능합니다.',
      },
    ],
  });

  const handleAdminIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    adminIdField.onChange(e);
    setIsIdChecked(false);
    setCheckError('');
  };

  const passwordField = useFormField({
    validations: [
      { validate: (v) => v.trim() !== '', message: '* 비밀번호를 입력해주세요.' },
      { validate: (v) => v.length >= 8, message: '* 최소 8자 이상이어야 합니다.' },
      {
        validate: (v) => /[a-zA-Z]/.test(v) && /[0-9]/.test(v),
        message: '* 영어와 숫자를 모두 포함해야 합니다.',
      },
    ],
  });

  const passwordCheckField = useFormField({
    validations: [{ validate: (v) => v.trim() !== '', message: '* 비밀번호를 입력해주세요.' }],
  });

  const handlePasswordCheckBlur = () => {
    passwordCheckField.onBlur();
  };
  const handleCheckId = async () => {
    try {
      const exists = await checkAdminIdExists(adminIdField.value);
      if (exists) {
        setIsIdChecked(false);
        setCheckError('* 이미 사용 중인 아이디입니다.');
      } else {
        setIsIdChecked(true);
        setCheckError('');
      }
    } catch {
      setIsIdChecked(false);
      setCheckError('* 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invitationToken) {
      setSubmitError('* 초대 토큰이 없습니다. 초대 링크를 다시 확인해주세요.');
      return;
    }

    if (!isIdChecked) {
      setCheckError('* 아이디 중복 확인이 필요합니다.');
      return;
    }

    try {
      await postAdminSignup({
        name: nameField.value,
        adminId: adminIdField.value,
        password: passwordField.value,
        passwordCheck: passwordCheckField.value,
        invitationToken,
      });
      navigate('/');
    } catch {
      setSubmitError(
        '* 회원가입에 실패했습니다. (초대 토큰이 유효하지 않거나 만료됐을 수 있습니다.)'
      );
    }
  };

  const getPasswordCheckErrorMessage = () => {
    if (passwordCheckField.value.trim() === '') {
      return passwordCheckField.errorMessage;
    }
    if (passwordCheckField.isBlurred && passwordCheckField.value !== passwordField.value) {
      return '* 비밀번호가 일치하지 않습니다.';
    }
    return '';
  };

  const isDisabled =
    nameField.value.trim() === '' ||
    adminIdField.value.trim() === '' ||
    passwordField.value.trim() === '' ||
    passwordCheckField.value.trim() === '' ||
    nameField.errorMessage !== '' ||
    adminIdField.errorMessage !== '' ||
    passwordField.errorMessage !== '' ||
    (passwordCheckField.isBlurred &&
      passwordCheckField.value.trim() !== '' &&
      passwordCheckField.value !== passwordField.value) ||
    !nameField.isBlurred ||
    !adminIdField.isBlurred ||
    !passwordField.isBlurred ||
    !passwordCheckField.isBlurred;

  return (
    <Card>
      <Title>모든 질문의 시작과 끝,</Title>
      <LogoTextImage src={textV1Logo} alt="로고" />
      <Form onSubmit={handleSubmit}>
        <FormInput
          id="login-nickname"
          label="닉네임"
          placeholder="닉네임을 입력해주세요.(최대 4글자/한글만 가능)"
          value={nameField.value}
          onChange={nameField.onChange}
          onBlur={nameField.onBlur}
          error={nameField.errorMessage}
        />
        <IdContainer>
          <IdInputWrapper>
            <IdInputLabel htmlFor="login-id">아이디</IdInputLabel>
            <IdInput
              id="login-id"
              type="text"
              placeholder="아이디를 입력하세요.(영어&숫자만 가능/최대 12자)"
              value={adminIdField.value}
              onChange={handleAdminIdChange}
              onBlur={adminIdField.onBlur}
              maxLength={12}
              $isError={!!adminIdField.errorMessage || !!checkError}
            />
            {!!adminIdField.errorMessage && <IdErrorText>{adminIdField.errorMessage}</IdErrorText>}
            {!adminIdField.errorMessage && checkError && <IdErrorText>{checkError}</IdErrorText>}
            {!adminIdField.errorMessage && !checkError && isIdChecked && (
              <IdSuccessText>사용 가능한 아이디입니다.</IdSuccessText>
            )}
          </IdInputWrapper>
          <ButtonContainer>
            <DuplicateCheckButton
              type="button"
              onClick={handleCheckId}
              disabled={!adminIdField.isValid || adminIdField.value.trim() === ''}
              $isChecked={isIdChecked}
            >
              {isIdChecked ? '확인 완료' : '중복 확인'}
            </DuplicateCheckButton>
          </ButtonContainer>
        </IdContainer>
        <FormInput
          id="login-pw"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요.(영어&숫자 포함 8자 이상/ 최대 32자)"
          value={passwordField.value}
          onChange={passwordField.onChange}
          onBlur={passwordField.onBlur}
          error={passwordField.errorMessage}
        />
        <FormInput
          id="login-pwcheck"
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 한 번 입력해주세요."
          value={passwordCheckField.value}
          onChange={passwordCheckField.onChange}
          onBlur={handlePasswordCheckBlur}
          error={getPasswordCheckErrorMessage()}
        />
        <Button size="large" type="submit" disabled={isDisabled}>
          완료
        </Button>
        {submitError && <ErrorText>{submitError}</ErrorText>}
      </Form>
    </Card>
  );
}

const Card = styled.div`
  width: 520px;
  height: 752px;
  background: white;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
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
  align-items: center;
  margin-bottom: 64px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const IdContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  width: 368px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const IdInputWrapper = styled.div`
  position: relative;
  width: 280px;
`;

const IdInputLabel = styled.label`
  font-size: 14px;
  color: ${colors.Black};
  font-weight: ${fontWeight.Regular};
  text-align: left;
  display: block;
  margin-bottom: 8px;
`;

const IdInput = styled.input<{ $isError?: boolean }>`
  width: 100%;
  height: 52px;
  padding: 12px;
  font-size: 12px;
  border: 1px solid ${({ $isError }) => ($isError ? colors.MainRed : colors.BoxStroke)};
  border-radius: 4px;
  text-align: center;
  background-color: ${colors.White};
  box-sizing: border-box;
  transition:
    border-color 0.2s,
    background-color 0.2s;

  &:hover {
    background-color: ${({ $isError }) => ($isError ? colors.GridLine : colors.Light)};
    border-color: ${({ $isError }) => ($isError ? colors.MainRed : colors.Normal)};
  }

  &:focus {
    border-color: ${({ $isError }) => ($isError ? colors.MainRed : colors.Normal)};
    outline: none;
  }
`;

const IdErrorText = styled.span`
  color: #ff4d4f;
  font-size: 10px;
  font-weight: ${fontWeight.Regular};
  position: absolute;
  right: 0;
  top: 0;
`;

const IdSuccessText = styled.span`
  color: ${colors.Normal};
  font-size: 10px;
  font-weight: ${fontWeight.Regular};
  position: absolute;
  right: 0;
  top: 0;
`;

const DuplicateCheckButton = styled.button<{ $isChecked?: boolean }>`
  height: 52px;
  padding: 0 16px;
  background: ${({ $isChecked }) => ($isChecked ? colors.Dark : colors.Normal)};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ $isChecked }) => ($isChecked ? colors.Dark_active : colors.Normal_active)};
  }

  &:disabled {
    background: rgba(15, 66, 157, 0.5);
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: ${colors.MainRed};
  font-size: 12px;
  margin-top: 12px;
`;
