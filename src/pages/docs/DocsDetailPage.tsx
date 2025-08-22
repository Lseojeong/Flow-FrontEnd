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

import DocsUploadModal from '@/components/modal/upload-modal/DocsUploadModal';
import DocsEditModal from '@/components/modal/upload-edit-modal/DocsEditModal';
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
import DepartmentTagList from '@/components/common/department/DepartmentTagList';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getDocsCategoryById } from '@/apis/docs/api';
import { Loading } from '@/components/common/loading/Loading';
import {
  getDocsCategoryFiles,
  deleteDocsCategoryFile,
  searchDocsCategoryFiles,
} from '@/apis/docs_detail/api';
import type { DocsFile, EditTargetFile } from '@/apis/docs_detail/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDate, formatDateTime } from '@/utils/index';

const MENU_ITEMS = [...commonMenuItems, ...settingsMenuItems];

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

const TOOLTIP_CONTENT = {
  title: '업로드한 파일의 상태를 종합한 내용입니다.',
  description: (
    <>
      Completed는 학습 및 등록 완료,
      <br />
      Processing은 파일 처리 중,
      <br />
      Fail은 학습 실패를 의미합니다.
    </>
  ),
};

interface FileDetailPanelProps {
  file: DocsFile;
  onClose: () => void;
}

const createFileListWithTimestamp = (files: DocsFile[]): (DocsFile & { timestamp: string })[] => {
  return files.map((item) => ({
    ...item,
    timestamp: item.updatedAt ?? item.createdAt ?? '',
  }));
};

const createApiResponse = (
  data: { code?: string; result?: { pagination?: { last?: boolean; nextCursor?: string } } },
  fileList: (DocsFile & { timestamp: string })[]
) => ({
  code: data.code ?? 'COMMON200',
  result: {
    historyList: fileList,
    pagination: {
      isLast: data.result?.pagination?.last ?? true,
    },
    nextCursor: data.result?.pagination?.nextCursor,
  },
});

const downloadFile = (fileUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const showToast = (message: string) => {
  (window as { showToast?: (_message: string) => void }).showToast?.(message);
};

const showErrorToast = (message: string) => {
  (window as { showErrorToast?: (_message: string) => void }).showErrorToast?.(message);
};

const useDocsCategoryDetail = (categoryId: string | undefined) => {
  return useQuery({
    queryKey: ['docs-category-detail', categoryId],
    queryFn: () => getDocsCategoryById(categoryId!),
    enabled: !!categoryId,
  });
};

const useDocsFiles = (categoryId: string | undefined, searchKeyword: string) => {
  return useInfiniteScroll<DocsFile & { timestamp: string }, HTMLTableRowElement>({
    queryKey: ['docs-detail-files', categoryId, searchKeyword],
    fetchFn: async (cursor) => {
      if (!categoryId) {
        throw new Error('categoryId is required');
      }

      if (searchKeyword.trim()) {
        const response = await searchDocsCategoryFiles(categoryId, searchKeyword, cursor);
        const fileList = createFileListWithTimestamp(response.data?.result?.fileList ?? []);
        return createApiResponse(response.data, fileList);
      }

      const response = await getDocsCategoryFiles(categoryId, cursor);
      const fileList = createFileListWithTimestamp(response.data?.result?.fileList ?? []);
      return createApiResponse(response.data, fileList);
    },
    enabled: !!categoryId,
  });
};

const CategoryInfo: React.FC<{
  categoryDetail: {
    status?: { Completed?: number; Processing?: number; Fail?: number };
    createdAt: string;
    updatedAt: string;
    lastModifierId?: string;
    lastModifierName?: string;
    departmentList?: string[];
  };
}> = ({ categoryDetail }) => {
  const statusItems: StatusItemData[] = [
    { type: 'Completed', count: categoryDetail?.status?.Completed ?? 0 },
    { type: 'Processing', count: categoryDetail?.status?.Processing ?? 0 },
    { type: 'Fail', count: categoryDetail?.status?.Fail ?? 0 },
  ];

  return (
    <InfoBox>
      <InfoItemColumn>
        <LabelContainer>
          <Label>파일 현황:</Label>
          <Tooltip content={TOOLTIP_CONTENT.title} description={TOOLTIP_CONTENT.description}>
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
        <Value>{formatDate(categoryDetail.createdAt)}</Value>
      </InfoItemColumn>

      <InfoItemColumn>
        <Label>최종 수정일:</Label>
        <Value>{formatDate(categoryDetail.updatedAt)}</Value>
      </InfoItemColumn>

      <InfoItemColumn>
        <Label>최종 수정자:</Label>
        <Value>
          {categoryDetail?.lastModifierId} ({categoryDetail?.lastModifierName})
        </Value>
      </InfoItemColumn>

      <InfoItemColumn style={{ flexBasis: '100%', marginTop: '28px' }}>
        <Label>포함 부서:</Label>
        <Value>
          <DepartmentTagList
            departments={
              categoryDetail.departmentList?.map((name: string) => ({
                departmentId: name,
                departmentName: name,
              })) ?? []
            }
          />
        </Value>
      </InfoItemColumn>
    </InfoBox>
  );
};

const FileTableRow: React.FC<{
  file: DocsFile;
  index: number;
  isLast?: boolean;
  observerRef: React.RefObject<HTMLTableRowElement | null>;
  onFileClick: (_file: DocsFile) => void;
  onEditFile: (_file: DocsFile) => void;
  onDeleteFile: (_file: DocsFile) => void;
}> = ({ file, index, isLast, observerRef, onFileClick, onEditFile, onDeleteFile }) => (
  <TableRow key={`file-${file.fileId}`} ref={isLast ? observerRef : undefined}>
    <td style={{ width: CELL_WIDTHS.NUMBER, minWidth: CELL_WIDTHS.NUMBER, textAlign: 'center' }}>
      {index + 1}
    </td>
    <ScrollableCell width={CELL_WIDTHS.FILENAME} align="left">
      <StyledLink onClick={() => onFileClick(file)}>{file.fileName}</StyledLink>
    </ScrollableCell>
    <td style={{ width: CELL_WIDTHS.STATUS, minWidth: CELL_WIDTHS.STATUS, textAlign: 'left' }}>
      <StatusWrapper>
        <StatusBadge status={file.status}>{file.status}</StatusBadge>
      </StatusWrapper>
    </td>
    <td style={{ width: CELL_WIDTHS.MANAGER, minWidth: CELL_WIDTHS.MANAGER, textAlign: 'left' }}>
      {file.lastModifierId}({file.lastModifierName})
    </td>
    <td
      style={{
        width: CELL_WIDTHS.REGISTERED_AT,
        minWidth: CELL_WIDTHS.REGISTERED_AT,
        textAlign: 'left',
      }}
    >
      {formatDateTime(file.createdAt)}
    </td>
    <td
      style={{ width: CELL_WIDTHS.UPDATED_AT, minWidth: CELL_WIDTHS.UPDATED_AT, textAlign: 'left' }}
    >
      {formatDateTime(file.updatedAt)}
    </td>
    <td
      style={{ width: CELL_WIDTHS.DOWNLOAD, minWidth: CELL_WIDTHS.DOWNLOAD, textAlign: 'center' }}
    >
      {(() => {
        const isCompleted = file.status === 'Completed';
        const handleDownload = () => {
          if (!isCompleted) return;
          downloadFile(file.fileUrl, file.fileName);
        };
        return (
          <DownloadIconWrapper
            onClick={handleDownload}
            style={{
              opacity: isCompleted ? 1 : 0.4,
              cursor: isCompleted ? 'pointer' : 'not-allowed',
            }}
            aria-disabled={!isCompleted}
          >
            <DownloadIcon />
          </DownloadIconWrapper>
        );
      })()}
    </td>
    <td style={{ width: CELL_WIDTHS.ACTIONS, minWidth: CELL_WIDTHS.ACTIONS, textAlign: 'center' }}>
      <ActionButtons>
        <ActionButton onClick={() => onEditFile(file)}>
          <EditIcon />
        </ActionButton>
        {(() => {
          const isCompleted = file.status === 'Completed';
          const handleDelete = () => {
            if (!isCompleted) return;
            onDeleteFile(file);
          };
          return (
            <ActionButton
              onClick={handleDelete}
              aria-disabled={!isCompleted}
              style={{
                opacity: isCompleted ? 1 : 0.4,
                cursor: isCompleted ? 'pointer' : 'not-allowed',
              }}
            >
              <DeleteIcon />
            </ActionButton>
          );
        })()}
      </ActionButtons>
    </td>
  </TableRow>
);

const EmptyState: React.FC = () => (
  <EmptyRow>
    <EmptyCell colSpan={8}>
      <EmptyMessage>등록된 파일이 없습니다.</EmptyMessage>
    </EmptyCell>
  </EmptyRow>
);

const FileTable: React.FC<{
  files: (DocsFile & { timestamp: string })[];
  observerRef: React.RefObject<HTMLTableRowElement | null>;
  onFileClick: (_file: DocsFile) => void;
  onEditFile: (_file: DocsFile) => void;
  onDeleteFile: (_file: DocsFile) => void;
  isLoading?: boolean;
}> = ({ files, observerRef, onFileClick, onEditFile, onDeleteFile, isLoading = false }) => (
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
        <tbody>
          {isLoading ? (
            <LoadingWrapper>
              <Loading size={28} color="#555" />
              <span style={{ fontSize: '14px', color: '#555' }}>파일 목록을 불러오는 중...</span>
            </LoadingWrapper>
          ) : files.length === 0 ? (
            <EmptyState />
          ) : (
            files.map((file, index) => {
              const isLast = index === files.length - 1;
              return (
                <FileTableRow
                  key={file.fileId}
                  file={file}
                  index={index}
                  isLast={isLast}
                  observerRef={observerRef}
                  onFileClick={onFileClick}
                  onEditFile={onEditFile}
                  onDeleteFile={onDeleteFile}
                />
              );
            })
          )}
        </tbody>
      </TableLayout>
    </TableScrollWrapper>
  </TableWrapper>
);

const FileDetailPanelWrapper: React.FC<FileDetailPanelProps> = ({ file, onClose }) => {
  return (
    <FileDetailPanel
      key={`${file.fileId}-${file.updatedAt}`} // 파일이 업데이트되면 컴포넌트를 다시 마운트하여 히스토리 새로고침
      file={{
        id: String(file.fileId),
        name: file.fileName,
        fileName: file.fileName,
        status: file.status,
        manager: `${file.lastModifierId}(${file.lastModifierName})`,
        registeredAt: file.createdAt,
        updatedAt: file.updatedAt,
        version: '1.0.0',
        fileUrl: file.fileUrl ?? '',
        timestamp: file.updatedAt,
      }}
      onClose={onClose}
    />
  );
};

export default function DocsDetailPage() {
  const { docId: categoryId } = useParams<{ docId: string }>();
  const queryClient = useQueryClient();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [targetFileName, setTargetFileName] = useState<string>('');
  const [targetFileId, setTargetFileId] = useState<string>('');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTargetFile, setEditTargetFile] = useState<EditTargetFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<DocsFile | null>(null);

  const { data: categoryDetailResponse, isLoading: isCategoryLoading } =
    useDocsCategoryDetail(categoryId);
  const debouncedSearchKeyword = useDebounce(searchKeyword, DEBOUNCE_DELAY);
  const {
    data: paginatedFiles,
    observerRef,
    isLoading: isFilesLoading,
  } = useDocsFiles(categoryId, debouncedSearchKeyword);

  const categoryDetail = categoryDetailResponse?.data?.result;

  if (!categoryId) {
    return <NoData>카테고리 ID가 없습니다.</NoData>;
  }

  if (isCategoryLoading || !categoryDetail) {
    return null;
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleFileClick = (file: DocsFile) => {
    setSelectedFile(file);
  };

  const handleEditFile = (file: DocsFile) => {
    setEditTargetFile({
      title: file.fileName,
      version: '1.0.0',
      fileId: file.fileId,
      fileUrl: file.fileUrl,
      latestVersion: file.latestVersion || '1.0.0',
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteFile = (file: DocsFile) => {
    setTargetFileName(file.fileName);
    setTargetFileId(file.fileId);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteDocsCategoryFile(targetFileId);
      showToast(`${targetFileName} 파일이 삭제되었습니다.`);
      setIsDeletePopupOpen(false);
      setTargetFileName('');
      setTargetFileId('');
      // 파일 삭제 후 파일 목록 캐시를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['docs-detail-files', categoryId] });
    } catch {
      showErrorToast('파일 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditTargetFile(null);
  };

  const handleEditModalSubmit = (updatedFile?: DocsFile) => {
    setIsEditModalOpen(false);
    setEditTargetFile(null);

    if (updatedFile) {
      // 파일 수정 후 파일 목록과 히스토리 캐시를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['docs-detail-files', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['file-history', updatedFile.fileId] });
      // 캐시 무효화 후 약간의 지연을 두고 히스토리 모달을 오픈
      setTimeout(() => setSelectedFile(updatedFile), 100);
    } else {
      // 파일 목록 캐시를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['docs-detail-files', categoryId] });
    }
  };

  const handleUploadModalSuccess = () => {
    showToast('파일이 등록되었습니다.');
    // 파일 업로드 후 파일 목록 캐시를 무효화하여 새로고침
    queryClient.invalidateQueries({ queryKey: ['docs-detail-files', categoryId] });
  };

  const handleFileDetailClose = () => {
    setSelectedFile(null);
  };

  const getCurrentFile = () => {
    if (!selectedFile) return null;
    // paginatedFiles에서 최신 데이터를 찾아서 히스토리 모달에 반영
    const currentFile = paginatedFiles.find((file) => file.fileId === selectedFile.fileId);
    return currentFile || selectedFile;
  };

  return (
    <PageWrapper>
      <SideBarWrapper>
        <SideBar
          logoSymbol={symbolTextLogo}
          menuItems={MENU_ITEMS}
          activeMenuId="docs"
          onMenuClick={() => {}}
        />
      </SideBarWrapper>

      <Content>
        <ContentWrapper>
          <HeaderSection>
            <PageTitle>{categoryDetail.name}</PageTitle>
            <DescriptionRow>
              <Description>{categoryDetail.description}</Description>
              <Button onClick={() => setIsCsvModalOpen(true)} size="small" variant="primary">
                + 데이터 등록
              </Button>
            </DescriptionRow>
          </HeaderSection>
          <Divider />

          <CategoryInfo categoryDetail={categoryDetail} />

          <FileSectionHeader>
            <SectionTitle>파일 관리</SectionTitle>
            <FileSearch value={searchKeyword} onChange={handleSearchChange} />
          </FileSectionHeader>

          <FileTable
            files={paginatedFiles}
            observerRef={observerRef}
            onFileClick={handleFileClick}
            onEditFile={handleEditFile}
            onDeleteFile={handleDeleteFile}
            isLoading={isFilesLoading}
          />
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

      <DocsUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={handleUploadModalSuccess}
        categoryId={categoryId}
        latestVersion={categoryDetail.latestVersion || '1.0.0'}
      />

      {editTargetFile && (
        <DocsEditModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onSubmit={handleEditModalSubmit}
          fileId={editTargetFile.fileId}
          originalFileName={editTargetFile.title}
          originalVersion={editTargetFile.version}
          originalFileUrl={editTargetFile.fileUrl}
          latestVersion={editTargetFile.latestVersion || '1.0.0'}
        />
      )}

      {getCurrentFile() && (
        <FileDetailPanelWrapper file={getCurrentFile()!} onClose={handleFileDetailClose} />
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
  cursor: pointer;

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

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 620px);
  gap: 8px;
  transform: translateX(50px);
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
  max-height: 400px;
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
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
`;
