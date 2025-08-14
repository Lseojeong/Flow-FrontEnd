import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import SideBar from '@/components/common/layout/SideBar';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { colors, fontWeight } from '@/styles/index';
import Divider from '@/components/common/divider/Divider';
import { Button } from '@/components/common/button/Button';
import { InformationIcon } from '@/assets/icons/settings/index';
import { ResetIcon } from '@/assets/icons/common/index';
import { Loading } from '@/components/common/loading/Loading';

import {
  Parameter,
  Tooltip,
  PromptInput,
  TestChat,
  SpaceidSelect,
} from '@/components/flow-setting/index';
import { useSpaceList } from '@/apis/spaceid/query';
import { useFlowSetting } from '@/apis/flow-setting/query';
import { useUpdateFlowSetting, useTestFlowSetting } from '@/apis/flow-setting/mutation';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function FlowSettingPage() {
  const [activeMenuId, setActiveMenuId] = useState<string>('flow-settings');
  const [selectedToken, setSelectedToken] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: spaceResponse, isLoading: isLoadingSpaces } = useSpaceList();

  const spaceOptions = useMemo(
    () =>
      spaceResponse?.result.spaceList.map((space) => ({
        value: space.spaceId.toString(),
        label: `${space.spaceName} (${space.spaceId})`,
      })) || [],
    [spaceResponse]
  );

  useEffect(() => {
    if (spaceOptions.length > 0 && !selectedToken) {
      setSelectedToken(spaceOptions[0].value);
    }
  }, [spaceOptions, selectedToken]);

  const { data: settingResponse, isLoading: isLoadingSettings } = useFlowSetting(
    selectedToken ? parseInt(selectedToken, 10) : 0
  );

  const updateFlowSettingMutation = useUpdateFlowSetting();
  const testFlowSettingMutation = useTestFlowSetting();

  const [temperature, setTemperature] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(256);
  const [topK, setTopK] = useState(5);
  const [topP, setTopP] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);

  useEffect(() => {
    if (settingResponse?.result) {
      const { temperature, maxToken, topK, topP, prompt } = settingResponse.result;
      setTemperature(temperature);
      setMaxTokens(maxToken);
      setTopK(topK);
      setTopP(topP);
      setPrompt(prompt);
    }
  }, [settingResponse]);

  const handleTopKChange = (value: number) => {
    setTopK(value);
  };

  const handleTopPChange = (value: number) => {
    setTopP(value);
  };

  const handleReset = () => {
    if (settingResponse?.result) {
      const { temperature, maxToken, topK, topP, prompt } = settingResponse.result;
      setTemperature(temperature);
      setMaxTokens(maxToken);
      setTopK(topK);
      setTopP(topP);
      setPrompt(prompt);
    }
  };

  const isParameterDefault = () => {
    if (!settingResponse?.result) return true;
    const {
      temperature: defaultTemp,
      maxToken: defaultMax,
      topK: defaultTopK,
      topP: defaultTopP,
    } = settingResponse.result;
    return (
      temperature === defaultTemp &&
      maxTokens === defaultMax &&
      topK === defaultTopK &&
      topP === defaultTopP
    );
  };

  const isPromptDefault = () => {
    if (!settingResponse?.result) return true;
    return prompt === settingResponse.result.prompt;
  };

  const handleApply = async () => {
    if (!selectedToken) return;

    try {
      await updateFlowSettingMutation.mutateAsync({
        spaceId: parseInt(selectedToken, 10),
        data: {
          temperature,
          maxToken: maxTokens,
          topK,
          topP,
          prompt,
        },
      });

      if ((window as { showToast?: (_message: string) => void }).showToast) {
        (window as { showToast?: (_message: string) => void }).showToast!(
          'Flow 설정이 성공적으로 업데이트되었습니다.'
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Flow 설정 업데이트에 실패했습니다.';
      if (typeof window !== 'undefined' && window.showErrorToast) {
        window.showErrorToast(errorMessage);
      }
    }
  };

  const isAllDefault = () => {
    return isParameterDefault() && isPromptDefault();
  };

  const handleTestRun = async (question: string): Promise<string> => {
    setIsTestLoading(true);
    try {
      const response = await testFlowSettingMutation.mutateAsync({
        temperature,
        maxToken: maxTokens,
        topK,
        topP,
        prompt,
        text: question,
      });

      if (response?.code === 'COMMON200') {
        return response.result.answer;
      } else {
        const errorMessage = response?.message || '알 수 없는 오류가 발생했습니다.';
        if (typeof window !== 'undefined' && window.showErrorToast) {
          window.showErrorToast(errorMessage);
        }
        return `테스트 실패: ${errorMessage}`;
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '테스트 실행 중 오류가 발생했습니다.';
      if (typeof window !== 'undefined' && window.showErrorToast) {
        window.showErrorToast(errorMessage);
      }
      return `테스트 실패: ${errorMessage}`;
    } finally {
      setIsTestLoading(false);
    }
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
              <Description>전역적인 Flow의 설정을 할 수 있는 어드민입니다.</Description>
            </DescriptionRow>
          </HeaderSection>
          <Divider />

          <SpaceidSelect
            value={selectedToken}
            onChange={setSelectedToken}
            options={spaceOptions}
            isLoading={isLoadingSpaces}
          >
            <Button
              variant="dark"
              size="medium"
              onClick={handleReset}
              disabled={isAllDefault() || isLoadingSettings}
            >
              초기화
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleApply}
              disabled={isAllDefault() || isLoadingSettings || updateFlowSettingMutation.isPending}
            >
              {updateFlowSettingMutation.isPending ? (
                <Loading size={14} color="white" />
              ) : (
                '적용하기'
              )}
            </Button>
          </SpaceidSelect>

          <ParameterSection>
            <ParameterHeader>
              <ParameterTitle>파라미터</ParameterTitle>
              <ParameterResetButton
                onClick={handleReset}
                disabled={isAllDefault() || isLoadingSettings}
              >
                <ResetIcon />
              </ParameterResetButton>
            </ParameterHeader>

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
                <Parameter
                  min={0}
                  max={1}
                  value={temperature}
                  onChange={isLoadingSettings ? undefined : setTemperature}
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
                <Parameter
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
                <Parameter
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
                <Parameter
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
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              defaultValue={settingResponse?.result?.prompt || ''}
              onReset={handleReset}
              isDefault={isPromptDefault()}
            />
          </PromptSection>

          <TestSection>
            <TestChat onTestRun={handleTestRun} loading={isTestLoading} />
          </TestSection>
          <Footer />
        </ContentWrapper>
      </Content>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 1158px;
  overflow-x: auto;
`;

const SideBarWrapper = styled.div`
  flex-shrink: 0;
  width: 280px;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  min-width: 1158px;
  padding: 0 36px;
  background-color: ${colors.background};
`;

const ContentWrapper = styled.div`
  max-width: 1158px;
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

const PromptSection = styled.section`
  margin-top: 24px;
`;

const TestSection = styled.section`
  margin-top: 24px;
`;

const ParameterSection = styled.section`
  margin-top: 44px;
`;

const ParameterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ParameterTitle = styled.h2`
  font-size: 16px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Dark_active};
`;

const ParameterResetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  color: ${colors.BoxText};

  &:hover:not(:disabled) {
    background: ${colors.background};
    color: ${colors.Normal};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 12px;
    height: 12px;
  }
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

const Footer = styled.footer`
  height: 40px;
`;
