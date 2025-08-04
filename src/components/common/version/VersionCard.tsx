import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { colors, fontWeight } from '@/styles/index';
import { VersionSelectorProps, VersionType } from './VersionCard.types';

export const VersionSelector: React.FC<VersionSelectorProps> = ({ onSelect }) => {
  const [selectedVersionType, setSelectedVersionType] = useState<VersionType | null>(null);

  const currentVersion = '1.0.0';
  const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.').map(Number);

  const versionOptions = useMemo(
    () => ({
      patch: `${currentMajor}.${currentMinor}.${currentPatch + 1}`,
      minor: `${currentMajor}.${currentMinor + 1}.0`,
      major: `${currentMajor + 1}.0.0`,
    }),
    [currentMajor, currentMinor, currentPatch]
  );

  const handleVersionSelect = (versionType: VersionType) => {
    setSelectedVersionType(versionType);
    onSelect?.(versionOptions[versionType]);
  };

  return (
    <VersionSelectorContainer>
      <VersionTitle>Version</VersionTitle>
      <VersionButtonContainer>
        <VersionButton
          $selected={selectedVersionType === 'patch'}
          onClick={() => handleVersionSelect('patch')}
        >
          <VersionTypeLabel>Patch</VersionTypeLabel>
          <VersionNumber>{versionOptions.patch}</VersionNumber>
        </VersionButton>
        <VersionButton
          $selected={selectedVersionType === 'minor'}
          onClick={() => handleVersionSelect('minor')}
        >
          <VersionTypeLabel>Minor</VersionTypeLabel>
          <VersionNumber>{versionOptions.minor}</VersionNumber>
        </VersionButton>
        <VersionButton
          $selected={selectedVersionType === 'major'}
          onClick={() => handleVersionSelect('major')}
        >
          <VersionTypeLabel>Major</VersionTypeLabel>
          <VersionNumber>{versionOptions.major}</VersionNumber>
        </VersionButton>
      </VersionButtonContainer>
      <CurrentVersionText>현재 버전: {currentVersion}</CurrentVersionText>
    </VersionSelectorContainer>
  );
};

const VersionSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const VersionTitle = styled.h3`
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  margin-bottom: 12px;
`;

const VersionButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const VersionButton = styled.button<{ $selected: boolean }>`
  width: 72px;
  height: 60px;
  border: 1px solid ${({ $selected }) => ($selected ? '#1749B2' : '#D1D1D1')};
  background-color: ${({ $selected }) => ($selected ? '#EEF3FB' : '#fff')};
  color: ${colors.Normal};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover {
    border-color: ${colors.Normal};
  }
`;

const VersionTypeLabel = styled.span`
  font-size: 12px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
  margin-bottom: 12px;
`;

const VersionNumber = styled.span`
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
`;

const CurrentVersionText = styled.span`
  font-size: 12px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
`;
