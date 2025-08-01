import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { TestChatProps } from './FlowSetting.types';
import { Button } from '@/components/common/button/Button';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export const TestChat: React.FC<TestChatProps> = ({ onTestRun, loading = false }) => {
  const [testQuestion, setTestQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleTestRun = async () => {
    if (!testQuestion.trim()) return;

    const question = testQuestion;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      isLoading: true,
    };

    setMessages([userMessage, loadingMessage]);
    setTestQuestion('');

    const result = await onTestRun?.(question);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === loadingMessage.id
          ? { ...msg, content: result || '테스트 결과가 없습니다.', isLoading: false }
          : msg
      )
    );
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTestQuestion(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const currentValue = event.currentTarget.value;
      if (currentValue.trim()) {
        setTestQuestion(currentValue);
        setTimeout(() => {
          handleTestRun();
        }, 0);
      }
    }
  };

  return (
    <Container>
      <Title>테스트</Title>
      <TestInputContainer>
        <TestInput
          type="text"
          value={testQuestion}
          onChange={handleQuestionChange}
          onKeyDown={handleKeyDown}
          placeholder="질문을 입력해주세요(ex. Flow는 무슨 뜻이야?)"
        />
        <TestButton
          variant="primary"
          size="medium"
          onClick={handleTestRun}
          disabled={!testQuestion.trim()}
          isLoading={loading}
        >
          테스트 실행
        </TestButton>
      </TestInputContainer>

      <ChatContainer>
        <ChatBox>
          {messages.length > 0 ? (
            messages.map((message) => (
              <ChatMessageWrapper key={message.id} $isUser={message.type === 'user'}>
                {message.type === 'user' ? (
                  <UserMessage>
                    <UserBubble>{message.content}</UserBubble>
                  </UserMessage>
                ) : (
                  <AssistantMessage>
                    <MessageBubble>
                      <MessageContent>
                        {message.isLoading ? '응답을 생성 중입니다...' : message.content}
                      </MessageContent>
                    </MessageBubble>
                  </AssistantMessage>
                )}
              </ChatMessageWrapper>
            ))
          ) : (
            <EmptyChatText>질문을 입력하고 테스트를 실행해보세요</EmptyChatText>
          )}
        </ChatBox>
      </ChatContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${colors.Light};
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 40px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Black};
  margin: 0;
`;

const TestInputContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const TestInput = styled.input`
  flex: 1;
  height: 32px;
  padding: 0 16px;
  border: 1px solid ${colors.BoxStroke};
  border-radius: 4px;
  font-size: 14px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.Black};
  background-color: white;
  outline: none;
  text-align: center;

  &::placeholder {
    color: ${colors.BoxText};
  }

  &:focus {
    border-color: ${colors.Normal};
  }
`;

const TestButton = styled(Button)`
  white-space: nowrap;
  min-width: 100px;
`;

const ChatContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  overflow-y: auto;
  background: ${colors.background};
  border: 1px solid ${colors.BoxStroke};
  border-radius: 8px;
  padding: 16px;
  gap: 12px;
`;

const ChatMessageWrapper = styled.div<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  width: 100%;
`;

const UserMessage = styled.div`
  display: flex;
  justify-content: flex-end;
  max-width: 70%;
`;

const UserBubble = styled.div`
  background: ${colors.Light};
  border-radius: 4px;
  padding: 12px 16px;
  color: ${colors.Black};
  font-size: 14px;
  font-weight: ${fontWeight.Regular};
  line-height: 1.5;
`;

const AssistantMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 70%;
`;

const MessageBubble = styled.div`
  flex: 1;
  background: ${colors.Normal};
  border-radius: 4px;
  padding: 12px 16px;
  color: white;
`;

const MessageContent = styled.div`
  font-size: 14px;
  font-weight: ${fontWeight.Regular};
  line-height: 1.6;
  color: white;
  white-space: pre-wrap;
`;

const EmptyChatText = styled.div`
  font-size: 14px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
