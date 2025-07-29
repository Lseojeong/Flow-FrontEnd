import styled from 'styled-components';
import { fontWeight, colors } from '@/styles/index';
import { textV1Logo } from '@/assets/logo/index';
import { Button } from '@/components/common/button/Button';
import { useFormField } from '@/hooks/useFormField';
import { FormInput } from '@/components/auth/AuthInput';
<<<<<<< HEAD
=======
import { useState } from 'react'; // 이미 되어 있다면 생략
>>>>>>> 5abfb6a (feat: #19 pr 리뷰 반영)

export function SigninForm() {
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

<<<<<<< HEAD
=======
  const [isIdFocused, setIsIdFocused] = useState(false);

>>>>>>> 5abfb6a (feat: #19 pr 리뷰 반영)
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
      <Form>
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
<<<<<<< HEAD
              placeholder="아이디를 입력하세요.(영어&숫자만 가능/최대 12자)"
              value={adminIdField.value}
              onChange={adminIdField.onChange}
              onBlur={adminIdField.onBlur}
=======
              placeholder={isIdFocused ? '' : '아이디를 입력하세요.(영어&숫자만 가능/최대 12자)'}
              value={adminIdField.value}
              onChange={adminIdField.onChange}
              onFocus={() => setIsIdFocused(true)}
              onBlur={() => {
                setIsIdFocused(false);
                adminIdField.onBlur(); // 기존 onBlur 호출 유지
              }}
>>>>>>> 5abfb6a (feat: #19 pr 리뷰 반영)
              maxLength={12}
              $isError={!!adminIdField.errorMessage}
            />
            {!!adminIdField.errorMessage && <IdErrorText>{adminIdField.errorMessage}</IdErrorText>}
          </IdInputWrapper>
          <DuplicateCheckButton
            disabled={!adminIdField.isValid || adminIdField.value.trim() === ''}
          >
            중복 확인
          </DuplicateCheckButton>
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
        <Button size="large" disabled={isDisabled}>
          완료
        </Button>
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

const DuplicateCheckButton = styled.button`
  height: 52px;
  padding: 0 16px;
  background: ${colors.Normal};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background: ${colors.Normal_active};
  }

  &:disabled {
    background: rgba(15, 66, 157, 0.5);
    cursor: not-allowed;
  }
`;
