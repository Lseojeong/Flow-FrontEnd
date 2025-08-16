import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useDebounce, DEBOUNCE_DELAY } from '@/hooks/useDebounce';

import SideBar from '@/components/common/layout/SideBar';
import StatusSummary from '@/components/common/status/StatusSummary';
import { StatusBadge } from '@/components/common/status/StatusBadge';
import Divider from '@/components/common/divider/Divider';
import FileSearch from '@/components/common/file-search/FileSearch';
import { Popup } from '@/components/common/popup/Popup';
import { DictUploadModal } from '@/components/modal/upload-modal/DictUploadModal';
import DictEditModal from '@/components/modal/upload-edit-modal/DictEditModal';
import { FileDetailPanel } from '@/pages/history/FileDetailPanel';
import { TableLayout, TableHeader, TableRow, ScrollableCell } from '@/components/common/table';
import { Tooltip } from '@/components/flow-setting/tooltip/Tooltip';
import { symbolTextLogo } from '@/assets/logo';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { colors, fontWeight } from '@/styles/index';
import { StatusItemData } from '@/components/common/status/Status.types';
import { DownloadIcon, EditIcon, DeleteIcon } from '@/assets/icons/common';
import { InformationIcon } from '@/assets/icons/settings';
import { Button } from '@/components/common/button/Button';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDictCategoryById } from '@/apis/dictcategory/api';
import type { DictCategoryFile, FileItem } from '@/apis/dictcategory_detail/types';
import type { DictCategory } from '@/apis/dictcategory/types';
import { formatDateTime } from '@/utils/formatDateTime';
import {
  getDictCategoryFiles,
  deleteDictCategoryFile,
  searchDictCategoryFiles,
} from '@/apis/dictcategory_detail/api';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

const TABLE_COLUMNS = [
  { label: '번호', width: '80px', align: 'left' as const },
  { label: '파일명', width: '300px', align: 'left' as const },
  { label: '학습 상태', width: '120px', align: 'left' as const },
  { label: '관리자', width: '150px', align: 'left' as const },
  { label: '등록일', width: '150px', align: 'left' as const },
  { label: '수정일', width: '150px', align: 'left' as const },
  { label: '파일 다운로드', width: '132px', align: 'center' as const },
  { label: ' ', width: '70px', align: 'left' as const },
];

const CELL_WIDTHS = {
  NUMBER: '80px',
  FILENAME: '300px',
  STATUS: '120px',
  MANAGER: '150px',
  REGISTERED_AT: '150px',
  UPDATED_AT: '150px',
  DOWNLOAD: '132px',
  ACTIONS: '70px',
} as const;

type EditTargetFile = {
  id: string;
  fileUrl: string;
  title: string;
  version: string;
  latestVersion: string;
};

export default function DictionaryDetailPage() {
  const params = useParams();
  const categoryId = (params.categoryId ?? params.dictionaryId ?? '') as string;
  const queryClient = useQueryClient();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetFileName, setTargetFileName] = useState<string>('');
  const [targetFileId, setTargetFileId] = useState<string>('');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTargetFile, setEditTargetFile] = useState<EditTargetFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const debouncedSearchKeyword = useDebounce(searchKeyword, DEBOUNCE_DELAY);

  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['dict-category', categoryId],
    queryFn: async () => {
      const res = await getDictCategoryById(categoryId);
      const data = (res.data?.result ?? res.data) as DictCategory;
      return {
        ...data,
        lastModifiedDate: data.lastModifiedDate ?? (data.updatedAt ?? '').slice(0, 10),
      };
    },
    enabled: !!categoryId,
  });

  const { data: paginatedFiles, observerRef } = useInfiniteScroll<
    FileItem & { timestamp: string },
    HTMLTableRowElement
  >({
    queryKey: ['dict-category-files', categoryId, debouncedSearchKeyword || ''],
    fetchFn: async (cursor) => {
      const hasKeyword = !!debouncedSearchKeyword.trim();

      const res = hasKeyword
        ? await searchDictCategoryFiles(categoryId, { keyword: debouncedSearchKeyword, cursor })
        : await getDictCategoryFiles(categoryId, cursor);

      const data = res.data;

      const list: (FileItem & { timestamp: string })[] = (data.result?.fileList ?? []).map(
        (f: DictCategoryFile) => ({
          id: f.fileId,
          name: f.fileName,
          fileName: f.fileName,
          status: f.status,
          manager: f.lastModifier ?? '-',
          lastModifierId: f.lastModifierId,
          lastModifierName: f.lastModifierName,
          registeredAt: formatDateTime(f.createdAt),
          updatedAt: formatDateTime(f.updatedAt),
          version: f.latestVersion ?? '-',
          fileUrl: f.fileUrl,
          timestamp: f.updatedAt,
        })
      );

      return {
        code: data.code,
        result: {
          historyList: list,
          pagination: {
            isLast: data.result?.pagination?.last ?? true,
          },
        },
      };
    },
  });

  if (isCategoryLoading || !categoryData) {
    return null;
  }

  const statusItems: StatusItemData[] = [
    { type: 'Completed', count: categoryData.status?.Completed ?? 0 },
    { type: 'Processing', count: categoryData.status?.Processing ?? 0 },
    { type: 'Fail', count: categoryData.status?.Fail ?? 0 },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
  };

  const handleEditFile = (file: FileItem) => {
    setEditTargetFile({
      id: file.id,
      fileUrl: file.fileUrl,
      title: file.name,
      version: file.version ?? '-',
      latestVersion: file.version ?? '1.0.0',
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteFile = (file: FileItem) => {
    setTargetFileName(file.name);
    setTargetFileId(file.id);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteDictCategoryFile(categoryId, targetFileId);
      (window as { showToast?: (_: string, _type?: 'success' | 'error') => void }).showToast?.(
        `${targetFileName} 파일이 삭제되었습니다.`,
        'success'
      );
      setIsDeletePopupOpen(false);
      setTargetFileName('');
      setTargetFileId('');
      // 파일 삭제 후 파일 목록 캐시를 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: ['dict-category-files', categoryId],
        exact: false,
      });
    } catch {
      (window as { showToast?: (_: string, _type?: 'success' | 'error') => void }).showToast?.(
        `${targetFileName} 파일 삭제 중 오류가 발생했습니다.`,
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditTargetFile(null);
  };

  const handleEditModalSubmit = (updatedFile?: FileItem) => {
    setIsEditModalOpen(false);
    setEditTargetFile(null);

    if (updatedFile) {
      // 파일 수정 후 파일 목록과 히스토리 캐시를 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: ['dict-category-files', categoryId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['file-history', updatedFile.id],
        exact: false,
      });
      // 캐시 무효화 후 약간의 지연을 두고 히스토리 모달을 오픈
      setTimeout(() => setSelectedFile(updatedFile), 100);
    } else {
      // 파일 목록 캐시를 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: ['dict-category-files', categoryId],
        exact: false,
      });
    }
  };

  const handleUploadModalSuccess = () => {
    // 파일 업로드 후 파일 목록 캐시를 무효화하여 새로고침
    queryClient.invalidateQueries({
      queryKey: ['dict-category-files', categoryId],
      exact: false,
    });
  };

  const handleFileDetailClose = () => {
    setSelectedFile(null);
  };

  const getCurrentFile = () => {
    if (!selectedFile) return null;
    // paginatedFiles에서 최신 데이터를 찾아서 히스토리 모달에 반영
    const currentFile = paginatedFiles.find((file) => file.id === selectedFile.id);
    return currentFile || selectedFile;
  };

  const renderFileRow = (file: FileItem, index: number, isLast?: boolean) => (
    <TableRow key={`file-${file.id}`} ref={isLast ? observerRef : undefined}>
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
        {file.lastModifierId
          ? `${file.lastModifierId}${file.lastModifierName ? ` (${file.lastModifierName})` : ''}`
          : '-'}
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
        <DownloadIconWrapper
          onClick={() => {
            const link = document.createElement('a');
            link.href = file.fileUrl;
            link.download = file.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
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
          <ActionButton onClick={() => handleDeleteFile(file)}>
            <DeleteIcon />
          </ActionButton>
        </ActionButtons>
      </td>
    </TableRow>
  );

  function renderEmptyState() {
    return (
      <EmptyRow>
        <EmptyCell colSpan={8}>
          <EmptyMessage>등록된 파일이 없습니다.</EmptyMessage>
        </EmptyCell>
      </EmptyRow>
    );
  }

  return (
    <PageWrapper>
      <SideBarWrapper>
        <SideBar
          logoSymbol={symbolTextLogo}
          menuItems={menuItems}
          activeMenuId="dictionary"
          onMenuClick={() => {}}
        />
      </SideBarWrapper>

      <Content>
        <ContentWrapper>
          <HeaderSection>
            <PageTitle>{categoryData.name}</PageTitle>
            <DescriptionRow>
              <Description>{categoryData.description ?? '-'}</Description>
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
              <Value>
                {categoryData.createdAt || categoryData.registeredDate
                  ? formatDateTime(categoryData.createdAt ?? categoryData.registeredDate).slice(
                      0,
                      10
                    )
                  : '-'}
              </Value>
            </InfoItemColumn>

            <InfoItemColumn>
              <Label>최종 수정일:</Label>
              <Value>
                {categoryData.createdAt || categoryData.registeredDate
                  ? formatDateTime(categoryData.createdAt ?? categoryData.registeredDate).slice(
                      0,
                      10
                    )
                  : '-'}
              </Value>
            </InfoItemColumn>

            <InfoItemColumn>
              <Label>최종 수정자:</Label>
              <Value>
                {categoryData.lastModifierId
                  ? `${categoryData.lastModifierId}${categoryData.lastModifierName ? ` (${categoryData.lastModifierName})` : ''}`
                  : '-'}
              </Value>
            </InfoItemColumn>
          </InfoBox>

          <FileSectionHeader>
            <SectionTitle>파일 관리</SectionTitle>
            <FileSearch value={searchKeyword} onChange={handleSearchChange} />
          </FileSectionHeader>

          <TableLayout>
            <thead>
              <TableHeader columns={TABLE_COLUMNS} />
            </thead>
            <TableScrollWrapper>
              <tbody>
                {!paginatedFiles || paginatedFiles.length === 0
                  ? renderEmptyState()
                  : paginatedFiles.map((file, index) =>
                      renderFileRow(file, index, index === paginatedFiles.length - 1)
                    )}
              </tbody>
            </TableScrollWrapper>
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
        disabled={isDeleting}
        confirmText={isDeleting ? '' : '삭제'}
      />

      <DictUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        categoryId={categoryId}
        onSuccess={handleUploadModalSuccess}
        latestVersion={'1.0.0'}
      />

      {editTargetFile && (
        <DictEditModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onSubmit={handleEditModalSubmit}
          categoryId={categoryId}
          fileId={editTargetFile.id}
          originalFileUrl={editTargetFile.fileUrl}
          originalFileName={editTargetFile.title}
          originalVersion={editTargetFile.version}
          latestVersion={editTargetFile.latestVersion}
        />
      )}

      {getCurrentFile() && (
        <FileDetailPanel
          key={`${getCurrentFile()!.id}-${getCurrentFile()!.updatedAt}`}
          file={getCurrentFile()!}
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

const LabelContainer = styled.div`
  display: flex;
  gap: 4px;
  justify-content: flex-start;
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

const EmptyRow = styled.tr`
  height: calc(100vh - 620px);
`;

const EmptyCell = styled.td<{ colSpan: number }>`
  padding: 0;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  text-align: center;
  color: ${colors.BoxText};
  font-size: 14px;
  transform: translateX(500px);
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
