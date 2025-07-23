import styled from 'styled-components';
import { fontWeight, colors } from '@/styles/index';
import { textV1Logo } from '@/assets/logo';
import { AuthButton } from '@/components/common/button/AuthButton';
import { useFormField } from '@/hooks/useFormField';
import { FormInput } from '@/components/auth/AuthInput';

export function LoginForm() {
  const idField = useFormField({
    validations: [{ validate: (v) => v.trim() !== '', message: '* 아이디를 입력해주세요.' }],
  });

  const pwField = useFormField({
    validations: [{ validate: (v) => v.trim() !== '', message: '* 비밀번호를 입력해주세요.' }],
  });

  const isDisabled =
    idField.value.trim() === '' ||
    pwField.value.trim() === '' ||
    idField.errorMessage !== '' ||
    pwField.errorMessage !== '';

  return (
    <Card>
      <Title>모든 질문의 시작과 끝,</Title>
      <LogoTextImage src={textV1Logo} alt="로고" />
      <Form>
        <FormInput
          id="login-id"
          label="아이디"
          placeholder="아이디를 입력하세요."
          value={idField.value}
          onChange={idField.onChange}
          onBlur={idField.onBlur}
          error={idField.errorMessage}
        />
        <FormInput
          id="login-pw"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요."
          value={pwField.value}
          onChange={pwField.onChange}
          onBlur={pwField.onBlur}
          error={pwField.errorMessage}
          hasMarginBottom={false}
        />
        <Spacer />
        <LoginErrorMessage />
        <AuthButton disabled={isDisabled}>로그인</AuthButton>
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
  font-size: 10px;
  text-align: right;
`;

const Spacer = styled.div`
  height: 0;
  margin-bottom: 16px;
`;
