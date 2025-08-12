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
import {
  getDocsCategoryFiles,
  deleteDocsCategoryFile,
  searchDocsCategoryFiles,
} from '@/apis/docs_detail/api';
import type { DocsFile } from '@/apis/docs_detail/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDate, formatDateTime } from '@/utils/index';

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
  fileId: string;
  fileUrl: string;
}

export default function DocsDetailPage() {
  const { docId: categoryId } = useParams<{ docId: string }>();
  const queryClient = useQueryClient();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [targetFileName, setTargetFileName] = useState<string>('');
  const [targetFileId, setTargetFileId] = useState<string>('');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTargetFile, setEditTargetFile] = useState<EditTargetFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<DocsFile | null>(null);

  const { data: categoryDetailResponse } = useQuery({
    queryKey: ['docs-category-detail', categoryId],
    queryFn: () => getDocsCategoryById(categoryId!),
    enabled: !!categoryId,
  });

  const categoryDetail = categoryDetailResponse?.data?.result;

  const debouncedSearchKeyword = useDebounce(searchKeyword, DEBOUNCE_DELAY);

  const { data: paginatedFiles, observerRef } = useInfiniteScroll<
    DocsFile & { timestamp: string },
    HTMLTableRowElement
  >({
    queryKey: ['docs-detail-files', categoryId, debouncedSearchKeyword],
    fetchFn: async (cursor) => {
      if (!categoryId) {
        throw new Error('categoryId is required');
      }

      if (debouncedSearchKeyword.trim()) {
        const response = await searchDocsCategoryFiles(categoryId, debouncedSearchKeyword, cursor);
        const res = response.data;

        const fileList: (DocsFile & { timestamp: string })[] = (res?.result?.fileList ?? []).map(
          (item: DocsFile) => ({
            ...item,
            timestamp: item.updatedAt ?? item.createdAt ?? '',
          })
        );

        return {
          code: res.code ?? 'COMMON200',
          result: {
            historyList: fileList,
            pagination: {
              isLast: res.result?.pagination?.last ?? true,
            },
            nextCursor: res.result?.pagination?.nextCursor,
          },
        };
      }

      const response = await getDocsCategoryFiles(categoryId, cursor);
      const res = response.data;

      const fileList: (DocsFile & { timestamp: string })[] = (res?.result?.fileList ?? []).map(
        (item: DocsFile) => ({
          ...item,
          timestamp: item.updatedAt ?? item.createdAt ?? '',
        })
      );

      return {
        code: res.code ?? 'COMMON200',
        result: {
          historyList: fileList,
          pagination: {
            isLast: res.result?.pagination?.last ?? true,
          },
          nextCursor: res.result?.pagination?.nextCursor,
        },
      };
    },
    enabled: !!categoryId,
  });

  // 서버 사이드 검색을 사용하므로 클라이언트 사이드 필터링 제거

  if (!categoryId) {
    return <NoData>카테고리 ID가 없습니다.</NoData>;
  }

  if (!categoryDetail) {
    return <NoData>데이터를 불러오는 중...</NoData>;
  }

  const statusItems: StatusItemData[] = [
    { type: 'Completed', count: categoryDetail?.status?.Completed ?? 0 },
    { type: 'Processing', count: categoryDetail?.status?.Processing ?? 0 },
    { type: 'Fail', count: categoryDetail?.status?.Fail ?? 0 },
  ];

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
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteFile = (file: DocsFile) => {
    setTargetFileName(file.fileName);
    setTargetFileId(file.fileId);
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDocsCategoryFile(targetFileId);
      if ((window as { showToast?: (_message: string) => void }).showToast) {
        (window as { showToast?: (_message: string) => void }).showToast!(
          `${targetFileName} 파일이 삭제되었습니다.`
        );
      }
      setIsDeletePopupOpen(false);
      setTargetFileName('');
      setTargetFileId('');
      // 캐시를 무효화하여 파일 목록을 새로고침합니다
      queryClient.invalidateQueries({ queryKey: ['docs-detail-files', categoryId] });
    } catch {
      if ((window as { showErrorToast?: (_message: string) => void }).showErrorToast) {
        (window as { showErrorToast?: (_message: string) => void }).showErrorToast!(
          '파일 삭제 중 오류가 발생했습니다.'
        );
      }
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
      // 캐시를 무효화하고 히스토리 모달을 엽니다
      queryClient.invalidateQueries({ queryKey: ['docs-detail-files', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['file-history', updatedFile.fileId] });
      setTimeout(() => {
        setSelectedFile(updatedFile);
      }, 100);
    } else {
      // 파일 목록을 새로고침합니다
      queryClient.invalidateQueries({ queryKey: ['docs-detail-files', categoryId] });
    }
  };

  const handleUploadModalSuccess = () => {
    if ((window as { showToast?: (_message: string) => void }).showToast) {
      (window as { showToast?: (_message: string) => void }).showToast!('파일이 등록되었습니다.');
    }
    // 캐시를 무효화하여 파일 목록을 새로고침합니다
    queryClient.invalidateQueries({ queryKey: ['docs-detail-files', categoryId] });
  };

  const handleFileDetailClose = () => {
    setSelectedFile(null);
  };

  const renderFileRow = (file: DocsFile, index: number, isLast?: boolean) => (
    <TableRow key={`file-${file.fileId}`} ref={isLast ? observerRef : undefined}>
      <td style={{ width: CELL_WIDTHS.NUMBER, minWidth: CELL_WIDTHS.NUMBER, textAlign: 'center' }}>
        {index + 1}
      </td>
      <ScrollableCell width={CELL_WIDTHS.FILENAME} align="left">
        <StyledLink onClick={() => handleFileClick(file)}>{file.fileName}</StyledLink>
      </ScrollableCell>
      <td style={{ width: CELL_WIDTHS.STATUS, minWidth: CELL_WIDTHS.STATUS, textAlign: 'left' }}>
        <StatusWrapper>
          <StatusBadge status={file.status}>{file.status}</StatusBadge>
        </StatusWrapper>
      </td>
      <td style={{ width: CELL_WIDTHS.MANAGER, minWidth: CELL_WIDTHS.MANAGER, textAlign: 'left' }}>
        {file.lastModifierName}
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
        style={{
          width: CELL_WIDTHS.UPDATED_AT,
          minWidth: CELL_WIDTHS.UPDATED_AT,
          textAlign: 'left',
        }}
      >
        {formatDateTime(file.updatedAt)}
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

  const renderEmptyState = () => (
    <EmptyRow>
      <EmptyCell colSpan={8}>
        <EmptyMessage>파일을 등록해주세요.</EmptyMessage>
      </EmptyCell>
    </EmptyRow>
  );

  const renderFileList = () => {
    return paginatedFiles.length === 0
      ? renderEmptyState()
      : paginatedFiles.map((file, index) => {
          const isLast = index === paginatedFiles.length - 1;
          return renderFileRow(file, index, isLast);
        });
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
            <PageTitle>{categoryDetail.name}</PageTitle>
            <DescriptionRow>
              <Description>{categoryDetail.description}</Description>
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
              <Value>{formatDate(categoryDetail.createdAt)}</Value>
            </InfoItemColumn>

            <InfoItemColumn>
              <Label>최종 수정일:</Label>
              <Value>{formatDate(categoryDetail.updatedAt)}</Value>
            </InfoItemColumn>

            <InfoItemColumn>
              <Label>최종 수정자:</Label>
              <Value>{categoryDetail?.lastModifierName || '-'}</Value>
            </InfoItemColumn>
            <InfoItemColumn style={{ flexBasis: '100%', marginTop: '28px' }}>
              <Label>포함 부서:</Label>
              <Value>
                <DepartmentTagList
                  departments={
                    categoryDetail.departmentList?.map((name) => ({
                      departmentId: name,
                      departmentName: name,
                    })) ?? []
                  }
                />
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

      <DocsUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={handleUploadModalSuccess}
        categoryId={categoryId}
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
          latestVersion="1.0.0"
        />
      )}

      {selectedFile &&
        (() => {
          // paginatedFiles에서 최신 데이터를 찾습니다
          const currentFile = paginatedFiles.find((file) => file.fileId === selectedFile.fileId);
          const fileToShow = currentFile || selectedFile;

          // 파일이 존재하는지 확인
          if (!fileToShow) {
            return null;
          }

          return (
            <FileDetailPanel
              key={`${fileToShow.fileId}-${fileToShow.updatedAt}`} // 파일이 업데이트되면 컴포넌트를 다시 마운트
              file={{
                id: String(fileToShow.fileId),
                name: fileToShow.fileName,
                fileName: fileToShow.fileName,
                status: fileToShow.status,
                manager: fileToShow.lastModifierName,
                registeredAt: fileToShow.createdAt,
                updatedAt: fileToShow.updatedAt,
                version: '1.0.0',
                fileUrl: fileToShow.fileUrl ?? '',
                timestamp: fileToShow.updatedAt,
              }}
              onClose={handleFileDetailClose}
            />
          );
        })()}
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
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
`;
