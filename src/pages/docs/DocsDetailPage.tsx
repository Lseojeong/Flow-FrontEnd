import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import SideBar from '@/components/common/layout/SideBar';
import StatusSummary from '@/components/common/status/StatusSummary';
import { StatusBadge } from '@/components/common/status/StatusBadge';
import Divider from '@/components/common/divider/Divider';
import FileSearch from '@/components/common/file-search/FileSearch';
import { Popup } from '@/components/common/popup/Popup';
import DocsUploadModal from '@/components/common/modal/DictUploadModal';
import DocsEditModal from '@/components/common/modal/DictEditModal';
import { FileDetailPanel } from '@/pages/history/FileDetailPanel';
import { TableLayout, TableHeader, TableRow, ScrollableCell } from '@/components/common/table';

import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { colors, fontWeight } from '@/styles/index';
import { StatusItemData } from '@/components/common/status/Status.types';
import { dictMockData, DictFile } from '@/pages/mock/dictMock';
import { DownloadIcon, EditIcon, DeleteIcon } from '@/assets/icons/common';
import { Button } from '@/components/common/button/Button';

interface EditTargetFile {
  title: string;
  version: string;
}

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function DocsDetailPage() {
  const { docId } = useParams();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [targetFileName, setTargetFileName] = useState<string>('');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTargetFile, setEditTargetFile] = useState<EditTargetFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<DictFile | null>(null);

  const detailData = dictMockData.find((item) => item.id.toString() === docId);

  if (!detailData) {
    return <NoData>데이터가 없습니다.</NoData>;
  }

  const statusItems: StatusItemData[] = [
    { type: 'Completed', count: detailData.status.completed },
    { type: 'Processing', count: detailData.status.processing },
    { type: 'Fail', count: detailData.status.fail },
  ];

  const filteredFiles = detailData.files.filter((file) =>
    file.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const columns = [
    { label: '번호', width: '48px', align: 'left' as const },
    { label: '파일명', width: '280px', align: 'left' as const },
    { label: '상태', width: '110px', align: 'left' as const },
    { label: '관리자', width: '140px', align: 'left' as const },
    { label: '등록일', width: '140px', align: 'left' as const },
    { label: '수정일', width: '140px', align: 'left' as const },
    { label: '파일 다운로드', width: '100px', align: 'left' as const },
    { label: ' ', width: '80px', align: 'left' as const },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleFileClick = (file: DictFile) => {
    setSelectedFile(file);
  };

  const handleEditFile = (file: DictFile) => {
    setEditTargetFile({
      title: file.name,
      version: file.version,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteFile = (fileName: string) => {
    setTargetFileName(fileName);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeletePopupOpen(false);
    if ((window as { showToast?: (_message: string) => void }).showToast) {
      (window as { showToast?: (_message: string) => void }).showToast!(
        `${targetFileName} 파일이 삭제되었습니다.`
      );
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditTargetFile(null);
  };

  const handleEditModalSubmit = (_data: {
    title: string;
    description: string;
    version: string;
  }) => {
    console.log('수정된 파일 데이터:', _data);
    setIsEditModalOpen(false);
    setEditTargetFile(null);
  };

  const handleUploadModalSubmit = (_data: {
    title: string;
    description: string;
    version: string;
  }) => {
    console.log('업로드된 PDF:', _data);
    setIsCsvModalOpen(false);
  };

  const handleFileDetailClose = () => {
    setSelectedFile(null);
  };

  return (
    <PageWrapper>
      <SideBarWrapper>
        <SideBar
          logoSymbol={symbolTextLogo}
          menuItems={menuItems}
          activeMenuId="docs"
          onMenuClick={() => {}}
        />
      </SideBarWrapper>

      <Content>
        <ContentWrapper>
          <HeaderSection>
            <PageTitle>{detailData.name}</PageTitle>
            <DescriptionRow>
              <Description>{detailData.description}</Description>
              <Button onClick={() => setIsCsvModalOpen(true)} size="small" variant="primary">
                + 데이터 등록
              </Button>
            </DescriptionRow>
          </HeaderSection>
          <Divider />

          <InfoBox>
            <InfoItemColumn>
              <Label>상태:</Label>
              <Value>
                <StatusSummary items={statusItems} />
              </Value>
            </InfoItemColumn>

            <InfoItemColumn>
              <Label>등록일:</Label>
              <Value>{detailData.registeredDate}</Value>
            </InfoItemColumn>

            <InfoItemColumn>
              <Label>최종 수정일:</Label>
              <Value>{detailData.lastModified}</Value>
            </InfoItemColumn>

            <InfoItemColumn>
              <Label>최종 수정자:</Label>
              <Value>{detailData.lastEditor}</Value>
            </InfoItemColumn>
          </InfoBox>

          <FileSectionHeader>
            <SectionTitle>파일 관리</SectionTitle>
            <FileSearch value={searchKeyword} onChange={handleSearchChange} />
          </FileSectionHeader>

          <TableLayout>
            <TableHeader columns={columns} />

            {filteredFiles.length === 0 ? (
              <EmptyRow>
                <EmptyCell colSpan={7}>
                  <EmptyMessage>파일을 등록해주세요.</EmptyMessage>
                </EmptyCell>
              </EmptyRow>
            ) : (
              filteredFiles.map((file, index) => (
                <TableRow key={file.id}>
                  <td style={{ width: '48px', textAlign: 'center' }}>{index + 1}</td>
                  <ScrollableCell maxWidth="280px" align="left">
                    <StyledLink onClick={() => handleFileClick(file)}>{file.name}</StyledLink>
                  </ScrollableCell>
                  <td style={{ width: '110px', textAlign: 'left' }}>
                    <StatusWrapper>
                      <StatusBadge status={file.status}>{file.status}</StatusBadge>
                    </StatusWrapper>
                  </td>
                  <td style={{ width: '140px', textAlign: 'left' }}>{file.manager}</td>
                  <td style={{ width: '140px', textAlign: 'left' }}>{file.registeredAt}</td>
                  <td style={{ width: '140px', textAlign: 'left' }}>{file.updatedAt}</td>
                  <td style={{ width: '100px', textAlign: 'center' }}>
                    <DownloadIconWrapper>
                      <DownloadIcon />
                    </DownloadIconWrapper>
                  </td>
                  <td style={{ width: '80px', textAlign: 'center' }}>
                    <ActionButtons>
                      <ActionButton onClick={() => handleEditFile(file)}>
                        <EditIcon />
                      </ActionButton>
                      <ActionButton onClick={() => handleDeleteFile(file.name)}>
                        <DeleteIcon />
                      </ActionButton>
                    </ActionButtons>
                  </td>
                </TableRow>
              ))
            )}
          </TableLayout>
        </ContentWrapper>
      </Content>

      <Popup
        isOpen={isDeletePopupOpen}
        title="파일 삭제"
        message={`${targetFileName} 파일을 삭제하시겠습니까?`}
        warningMessages={['삭제한 파일은 복구할 수 없습니다.']}
        onClose={() => setIsDeletePopupOpen(false)}
        onDelete={handleDeleteConfirm}
      />

      <DocsUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSubmit={handleUploadModalSubmit}
      />

      {editTargetFile && (
        <DocsEditModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onSubmit={handleEditModalSubmit}
          originalFileName={editTargetFile.title}
          originalVersion={editTargetFile.version}
        />
      )}

      {selectedFile && <FileDetailPanel file={selectedFile} onClose={handleFileDetailClose} />}
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

const InfoBox = styled.div`
  padding: 12px 24px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 40px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: 24px;
  flex: 1 1 0;
`;

const InfoItemColumn = styled(InfoItem)`
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const Label = styled.div`
  font-weight: ${fontWeight.Medium};
  font-size: 16px;
  color: ${colors.Black};
  margin-bottom: 16px;
`;

const Value = styled.div`
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.Normal};
`;

const FileSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: ${fontWeight.SemiBold};
  color: ${colors.Normal};
`;

const DownloadIconWrapper = styled.div`
  color: ${colors.BoxText};

  &:hover {
    svg {
      color: ${colors.Normal};
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;

  svg {
    color: ${colors.BoxText};
    transition: color 0.2s;
  }

  &:hover svg {
    color: ${colors.Normal};
  }
`;

const NoData = styled.div`
  margin-left: 280px;
  padding: 40px;
  font-size: 18px;
  color: #999;
`;

const EmptyRow = styled.tr`
  height: 200px;
`;

const EmptyCell = styled.td<{ colSpan: number }>`
  text-align: center;
  vertical-align: middle;
  color: ${colors.BoxText};
  font-size: 14px;
  padding: 80px 0;
`;

const EmptyMessage = styled.div`
  display: inline-block;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  height: 100%;
`;

const StyledLink = styled.div`
  color: inherit;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${colors.Normal};
  }
`;
