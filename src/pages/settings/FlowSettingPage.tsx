import { useState } from 'react';
import styled from 'styled-components';
import SideBar from '@/components/common/layout/SideBar';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/Divider';
import { Button } from '@/components/common/button/Button';
import { CopyIcon, InformationIcon } from '@/assets/icons/settings/index';
import { RangeSlider } from '@/components/flow-setting/RangeSlider';
import { Tooltip } from '@/components/flow-setting/Tooltip';
import { PromptInput } from '@/components/flow-setting/PromptInput';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function FlowSettingPage() {
  const [activeMenuId, setActiveMenuId] = useState<string>('flow-settings');
  const token = 'dafmeb.asdfbqoxoxxx--asdfasdfasdfnwk';

  const [temperature, setTemperature] = useState(0);
  const [maxTokens, setMaxTokens] = useState(128);
  const [topK, setTopK] = useState(3);
  const [topP, setTopP] = useState(0);
  const [prompt, setPrompt] = useState('');

  const handleTopKChange = (value: number) => {
    setTopK(value);
  };

  const handleTopPChange = (value: number) => {
    setTopP(value);
  };

  //TODO: Toast 팝업으로 변경
  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    alert('토큰이 클립보드에 복사되었습니다.');
  };

  return (
    <PageWrapper>
      <SideBarWrapper>
        <SideBar
          logoSymbol={symbolTextLogo}
          menuItems={menuItems}
          activeMenuId={activeMenuId}
          onMenuClick={setActiveMenuId}
        />
      </SideBarWrapper>
      <Content>
        <ContentWrapper>
          <HeaderSection>
            <PageTitle>Flow 설정</PageTitle>
            <DescriptionRow>
              <Description>관리자의 Flow와 설정을 할 수 있는 어드민입니다.</Description>
              <ButtonGroup>
                <Button variant="dark" size="medium">
                  되돌리기
                </Button>
                <Button variant="primary" size="medium">
                  적용하기
                </Button>
              </ButtonGroup>
            </DescriptionRow>
          </HeaderSection>
          <Divider />

          <TokenSection>
            <TokenTitle>토큰</TokenTitle>
            <TokenInputContainer>
              <TokenText>{token}</TokenText>
              <CopyButton onClick={handleCopyToken}>
                <CopyIcon />
              </CopyButton>
            </TokenInputContainer>
          </TokenSection>
          <Divider2 />

          <ParameterSection>
            <ParameterTitle>파라미터</ParameterTitle>

            <SliderGroup>
              <SliderItem>
                <LabelWithIcon>
                  <SliderLabel>temperature</SliderLabel>
                  <Tooltip
                    content="현재의 무작위성을 조절합니다."
                    description="1에 가까울 수록 더 다양한 단어가 다양하게 나옵니다."
                  >
                    <InfoIcon>
                      <InformationIcon />
                    </InfoIcon>
                  </Tooltip>
                </LabelWithIcon>
                <RangeSlider
                  min={0}
                  max={1}
                  value={temperature}
                  onChange={setTemperature}
                  showValue={true}
                />
              </SliderItem>

              <SliderItem>
                <LabelWithIcon>
                  <SliderLabel>max_tokens</SliderLabel>
                  <Tooltip
                    content="생성할 최대 토큰 수를 설정합니다."
                    description="값이 클수록 더 긴 텍스트가 생성됩니다."
                  >
                    <InfoIcon>
                      <InformationIcon />
                    </InfoIcon>
                  </Tooltip>
                </LabelWithIcon>
                <RangeSlider
                  min={128}
                  max={1024}
                  value={maxTokens}
                  onChange={setMaxTokens}
                  showValue={true}
                />
              </SliderItem>

              <SliderItem>
                <LabelWithIcon>
                  <SliderLabel>top_k</SliderLabel>
                  <Tooltip
                    content="가장 가능성이 높은 k개의 토큰만 고려합니다."
                    description="값이 작을수록 더 일관된 결과를 생성합니다."
                  >
                    <InfoIcon>
                      <InformationIcon />
                    </InfoIcon>
                  </Tooltip>
                </LabelWithIcon>
                <RangeSlider
                  min={3}
                  max={10}
                  value={topK}
                  onChange={handleTopKChange}
                  showValue={true}
                />
              </SliderItem>

              <SliderItem>
                <LabelWithIcon>
                  <SliderLabel>top_p</SliderLabel>
                  <Tooltip
                    content="누적 확률이 p가 될 때까지의 토큰들만 고려합니다."
                    description="값이 작을수록 더 집중된 결과를 생성합니다."
                  >
                    <InfoIcon>
                      <InformationIcon />
                    </InfoIcon>
                  </Tooltip>
                </LabelWithIcon>
                <RangeSlider
                  min={0}
                  max={1}
                  value={topP}
                  onChange={handleTopPChange}
                  showValue={true}
                />
              </SliderItem>
            </SliderGroup>
          </ParameterSection>

          <PromptSection>
            <PromptInput value={prompt} onChange={setPrompt} />
          </PromptSection>
        </ContentWrapper>
      </Content>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 1000px;
  overflow-x: auto;
`;

const SideBarWrapper = styled.div`
  flex-shrink: 0;
  width: 280px;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  min-width: 1230px;
  padding: 0 36px;
  background-color: ${colors.background};
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const PageTitle = styled.h1`
  font-size: 40px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
  margin-bottom: 12px;
  margin-top: 80px;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 16px;
`;

const DescriptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Description = styled.p`
  font-size: 16px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const TokenSection = styled.section`
  margin-top: 24px;
  margin-left: 24px;
  margin-right: 24px;
`;

const TokenTitle = styled.h2`
  font-size: 16px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Black};
  margin-bottom: 12px;
`;

const TokenInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TokenText = styled.span`
  font-size: 14px;
  word-break: break-all;
  user-select: text;
  color: ${colors.Normal};
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: none;
  outline: none;
  color: ${colors.BoxText};

  &:hover {
    color: ${colors.Normal};
  }

  &:focus {
    outline: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Divider2 = styled(Divider)`
  border: none;
  height: 1.5px;
  margin: 16px 24px 24px 24px;
  background: ${colors.GridLine};
`;

const PromptSection = styled.section`
  margin-top: 24px;
  margin-left: 24px;
  margin-right: 24px;
`;

const ParameterSection = styled.section`
  margin-top: 44px;
  margin-left: 24px;
  margin-right: 24px;
`;

const ParameterTitle = styled.h2`
  font-size: 16px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Black};
  margin-bottom: 12px;
`;

const SliderGroup = styled.div`
  display: grid;
  grid-template-columns: 360px 360px;
  gap: 16px 60px;
`;

const SliderItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LabelWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SliderLabel = styled.label`
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Black};
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${colors.Light_active};

  &:hover {
    color: ${colors.Normal};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
