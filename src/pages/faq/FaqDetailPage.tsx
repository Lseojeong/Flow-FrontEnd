import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useDebounce, DEBOUNCE_DELAY } from '@/hooks/useDebounce';

import SideBar from '@/components/common/layout/SideBar';
import StatusSummary from '@/components/common/status/StatusSummary';
import { StatusBadge } from '@/components/common/status/StatusBadge';
import Divider from '@/components/common/divider/Divider';
import FileSearch from '@/components/common/file-search/FileSearch';
import { Popup } from '@/components/common/popup/Popup';
import FaqUploadModal from '@/components/modal/upload-modal/FaqUploadModal';
import FaqEditModal from '@/components/modal/upload-edit-modal/FaqEditModal';
import { FileDetailPanel } from '@/pages/history/FileDetailPanel';
import { TableLayout, TableHeader, TableRow, ScrollableCell } from '@/components/common/table';
import { Tooltip } from '@/components/flow-setting/tooltip/Tooltip';

import { DepartmentTagList } from '@/components/common/department/DepartmentTagList';
import type { Department } from '@/components/common/department/Department.types';

import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { colors, fontWeight } from '@/styles/index';
import { StatusItemData } from '@/components/common/status/Status.types';
import { DownloadIcon, EditIcon, DeleteIcon } from '@/assets/icons/common';
import { InformationIcon } from '@/assets/icons/settings';
import { Button } from '@/components/common/button/Button';

import { getFaqCategoryById } from '@/apis/faq/api';
import type { FaqCategory } from '@/apis/faq/types';

import type { DictFile } from '@/pages/mock/dictMock';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

const TABLE_COLUMNS = [
  { label: '번호', width: '72px', align: 'left' as const },
  { label: '파일명', width: '318px', align: 'left' as const },
  { label: '학습 상태', width: '110px', align: 'left' as const },
  { label: '관리자', width: '150px', align: 'left' as const },
  { label: '등록일', width: '149px', align: 'left' as const },
  { label: '수정일', width: '148px', align: 'left' as const },
  { label: '파일 다운로드', width: '120px', align: 'center' as const },
  { label: ' ', width: '95px', align: 'left' as const },
];

const CELL_WIDTHS = {
  NUMBER: '72px',
  FILENAME: '318px',
  STATUS: '110px',
  MANAGER: '150px',
  REGISTERED_AT: '149px',
  UPDATED_AT: '148px',
  DOWNLOAD: '120px',
  ACTIONS: '95px',
} as const;

interface EditTargetFile {
  title: string;
  version: string;
}

export default function FaqDetailPage() {
  const { faqId = '' } = useParams();

  const [category, setCategory] = useState<FaqCategory | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [targetFileName, setTargetFileName] = useState<string>('');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTargetFile, setEditTargetFile] = useState<EditTargetFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<DictFile | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getFaqCategoryById(faqId);
        const data = (res.data?.result ?? res.data) as FaqCategory;
        if (!mounted) return;
        setCategory({
          ...data,
          lastModifiedDate: data.lastModifiedDate ?? (data.lastModifier ?? '').slice(0, 10),
        });
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [faqId]);

  const departmentsForTag = useMemo<Department[]>(() => {
    const list = category?.departmentList ?? [];
    return list.map((name) => ({
      departmentId: name,
      departmentName: name,
    }));
  }, [category?.departmentList]);

  // 파일 리스트는 아직 API 미연결이라 빈 배열 유지
  const files: DictFile[] = [];
  const debouncedSearchKeyword = useDebounce(searchKeyword, DEBOUNCE_DELAY);
  const filteredFiles = useMemo(() => {
    const kw = debouncedSearchKeyword.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(kw));
  }, [files, debouncedSearchKeyword]);

  if (loading) return <NoData>로딩 중…</NoData>;
  if (!category) return <NoData>데이터가 없습니다.</NoData>;

  const statusItems: StatusItemData[] = [
    { type: 'Completed', count: category.status?.completed ?? 0 },
    { type: 'Processing', count: category.status?.processing ?? 0 },
    { type: 'Fail', count: category.status?.fail ?? 0 },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };
  const handleFileClick = (file: DictFile) => setSelectedFile(file);
  const handleEditFile = (file: DictFile) => {
    setEditTargetFile({ title: file.name, version: file.version });
    setIsEditModalOpen(true);
  };
  const handleDeleteFile = (fileName: string) => {
    setTargetFileName(fileName);
    setIsDeletePopupOpen(true);
  };
  const handleDeleteConfirm = () => {
    setIsDeletePopupOpen(false);
    (window as { showToast?: (_m: string) => void }).showToast?.(
      `${targetFileName} 파일이 삭제되었습니다.`
    );
  };
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditTargetFile(null);
  };
  const handleEditModalSubmit = () => {
    (window as { showToast?: (_m: string) => void }).showToast?.('파일이 수정되었습니다.');
    setIsEditModalOpen(false);
    setEditTargetFile(null);
  };
  const handleUploadModalSubmit = () => {
    (window as { showToast?: (_m: string) => void }).showToast?.('파일이 등록되었습니다.');
    setIsCsvModalOpen(false);
  };
  const handleFileDetailClose = () => setSelectedFile(null);

  const renderFileRow = (file: DictFile, index: number) => (
    <TableRow key={`file-${file.id}`}>
      <td style={{ width: CELL_WIDTHS.NUMBER, minWidth: CELL_WIDTHS.NUMBER, textAlign: 'center' }}>
        {index + 1}
      </td>
      <ScrollableCell width={CELL_WIDTHS.FILENAME} align="left">
        <StyledLink onClick={() => handleFileClick(file)}>{file.name}</StyledLink>
      </ScrollableCell>
      <td style={{ width: CELL_WIDTHS.STATUS, minWidth: CELL_WIDTHS.STATUS, textAlign: 'left' }}>
        <StatusWrapper>
          <StatusBadge status={file.status}>{file.status}</StatusBadge>
        </StatusWrapper>
      </td>
      <td style={{ width: CELL_WIDTHS.MANAGER, minWidth: CELL_WIDTHS.MANAGER, textAlign: 'left' }}>
        {file.manager}
      </td>
      <td
        style={{
          width: CELL_WIDTHS.REGISTERED_AT,
          minWidth: CELL_WIDTHS.REGISTERED_AT,
          textAlign: 'left',
        }}
      >
        {file.registeredAt}
      </td>
      <td
        style={{
          width: CELL_WIDTHS.UPDATED_AT,
          minWidth: CELL_WIDTHS.UPDATED_AT,
          textAlign: 'left',
        }}
      >
        {file.updatedAt}
      </td>
      <td
        style={{ width: CELL_WIDTHS.DOWNLOAD, minWidth: CELL_WIDTHS.DOWNLOAD, textAlign: 'center' }}
      >
        <DownloadIconWrapper>
          <DownloadIcon />
        </DownloadIconWrapper>
      </td>
      <td
        style={{ width: CELL_WIDTHS.ACTIONS, minWidth: CELL_WIDTHS.ACTIONS, textAlign: 'center' }}
      >
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
  );

  const renderEmptyState = () => (
    <EmptyRow>
      <EmptyCell colSpan={8}>
        <EmptyMessage>파일을 등록해주세요.</EmptyMessage>
      </EmptyCell>
    </EmptyRow>
  );

  const renderFileList = () =>
    (searchKeyword.trim() ? filteredFiles : files).length === 0
      ? renderEmptyState()
      : (searchKeyword.trim() ? filteredFiles : files).map((f, i) => renderFileRow(f, i));

  return (
    <PageWrapper>
      <SideBarWrapper>
        <SideBar
          logoSymbol={symbolTextLogo}
          menuItems={menuItems}
          activeMenuId="faq"
          onMenuClick={() => {}}
        />
      </SideBarWrapper>

      <Content>
        <ContentWrapper>
          <HeaderSection>
            <PageTitle>{category.name}</PageTitle>
            <DescriptionRow>
              <Description>{category.description ?? '-'}</Description>
              <Button onClick={() => setIsCsvModalOpen(true)} size="small" variant="primary">
                + 데이터 등록
              </Button>
            </DescriptionRow>
          </HeaderSection>

          <Divider />

          <InfoBox>
            <InfoItemColumn>
              <LabelContainer>
                <Label>파일 현황:</Label>
                <Tooltip
                  content="업로드한 파일의 상태를 종합한 내용입니다."
                  description={
                    <>
                      Completed는 학습 및 등록 완료,
                      <br />
                      Processing은 파일 처리 중,
                      <br />
                      Fail은 학습 실패를 의미합니다.
                    </>
                  }
                >
                  <InfoIcon>
                    <InformationIcon />
                  </InfoIcon>
                </Tooltip>
              </LabelContainer>
              <Value>
                <StatusSummary items={statusItems} />
              </Value>
            </InfoItemColumn>

            <InfoItemColumn>
              <Label>등록일:</Label>
              <Value>{(category.createdAt ?? '').slice(0, 10) || '-'}</Value>
            </InfoItemColumn>

            <InfoItemColumn>
              <Label>최종 수정일:</Label>
              <Value>{(category.lastModifiedDate ?? '').slice(0, 10) || '-'}</Value>
            </InfoItemColumn>

            <InfoItemColumn>
              <Label>최종 수정자:</Label>
              <Value>{category.lastModifier ?? category.lastEditor ?? '-'}</Value>
            </InfoItemColumn>

            <InfoItemColumn style={{ flexBasis: '100%', marginTop: '28px' }}>
              <Label>포함 부서:</Label>
              <Value>
                <DepartmentTagList departments={departmentsForTag} />
              </Value>
            </InfoItemColumn>
          </InfoBox>

          <FileSectionHeader>
            <SectionTitle>파일 관리</SectionTitle>
            <FileSearch value={searchKeyword} onChange={handleSearchChange} />
          </FileSectionHeader>

          <TableWrapper>
            <TableHeaderSection>
              <TableLayout>
                <thead>
                  <TableHeader columns={TABLE_COLUMNS} />
                </thead>
              </TableLayout>
            </TableHeaderSection>
            <TableScrollWrapper>
              <TableLayout>
                <tbody>{renderFileList()}</tbody>
              </TableLayout>
            </TableScrollWrapper>
          </TableWrapper>
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

      <FaqUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSubmit={handleUploadModalSubmit}
      />

      {editTargetFile && (
        <FaqEditModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onSubmit={handleEditModalSubmit}
          originalFileName={editTargetFile.title}
          originalVersion={editTargetFile.version}
        />
      )}

      {selectedFile && (
        <FileDetailPanel
          file={{
            ...selectedFile,
            fileName: selectedFile.name,
            fileUrl: selectedFile.fileUrl ?? '',
            timestamp: selectedFile.updatedAt,
            id: String(selectedFile.id),
          }}
          onClose={handleFileDetailClose}
        />
      )}
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

const InfoBox = styled.div`
  padding: 12px 24px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 40px;
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
  color: ${colors.Light_active};

  &:hover {
    color: ${colors.Normal};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const InfoItemColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  white-space: nowrap;
  flex: 1 1 0;
`;

const Label = styled.div`
  font-weight: ${fontWeight.Medium};
  font-size: 16px;
  color: ${colors.Black};
  margin-bottom: 16px;
`;

const LabelContainer = styled.div`
  display: flex;
  gap: 4px;
  justify-content: flex-start;
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

const TableScrollWrapper = styled.div`
  max-height: 380px;
  overflow-y: auto;
  border-radius: 8px;
  background: ${colors.White};
`;

const TableHeaderSection = styled.div`
  background-color: ${colors.Normal};
  color: white;
  thead {
    tr {
      th {
        position: sticky;
        top: 0;
        background-color: ${colors.Normal};
        z-index: 2;
      }
    }
  }
`;

const TableWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
`;
