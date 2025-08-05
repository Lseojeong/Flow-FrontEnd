import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import SideBar from '@/components/common/layout/SideBar';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { symbolTextLogo } from '@/assets/logo';
import DownloadIcon from '@/assets/icons/common/download.svg?react';
import EditIcon from '@/assets/icons/common/edit.svg?react';
import DeleteIcon from '@/assets/icons/common/delete.svg?react';
import { Button } from '@/components/common/button/Button';
import { dictMockData } from '@/pages/mock/dictMock';
import StatusSummary from '@/components/common/status/StatusSummary';
import { StatusItemData } from '@/components/common/status/Status.types';
import DepartmentTagList from '@/components/common/department/DepartmentTagList';
import { StatusBadge } from '@/components/common/status/StatusBadge';
import Divider from '@/components/common/divider/Divider';
import FileSearch from '@/components/common/file-search/FileSearch';

import { Popup } from '@/components/common/popup/Popup';
import FaqUploadModal from '@/components/modal/upload-modal/FaqUploadModal';
import FaqEditModal from '@/components/modal/upload-edit-modal/FaqEditModal';
import { FileDetailPanel } from '@/pages/history/FileDetailPanel';
import { DictFile } from '@/pages/mock/dictMock';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function FaqDetailPage() {
  const { categoryId } = useParams();
  const [searchKeyword, setSearchKeyword] = useState('');
  const detailData = dictMockData.find((item) => item.id.toString() === categoryId);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [targetFileName, setTargetFileName] = useState<string>('');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTargetFile, setEditTargetFile] = useState<{
    title: string;
    version: string;
  } | null>(null);

  const [selectedFile, setSelectedFile] = useState<DictFile | null>(null);

  if (!detailData) return <NoData>데이터가 없습니다.</NoData>;

  const statusItems: StatusItemData[] = [
    { type: 'Completed', count: detailData.status.completed },
    { type: 'Processing', count: detailData.status.processing },
    { type: 'Fail', count: detailData.status.fail },
  ];

  const filteredFiles = detailData.files.filter((file) =>
    file.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <PageWrapper>
      <SideBar
        logoSymbol={symbolTextLogo}
        menuItems={menuItems}
        activeMenuId="faq"
        onMenuClick={() => {}}
      />

      <Content>
        <Header>
          <TitleGroup>
            <Title>{detailData.name}</Title>
            <SubTitle>{detailData.description}</SubTitle>
          </TitleGroup>
          <Button onClick={() => setIsCsvModalOpen(true)}>+ 데이터 등록</Button>
        </Header>
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
          <InfoItemColumn style={{ flexBasis: '100%', marginTop: '12px' }}>
            <Label>포함 부서:</Label>
            <Value>
              <DepartmentTagList departments={detailData.departments} />
            </Value>
          </InfoItemColumn>
        </InfoBox>

        <FileSection>
          <FileSectionHeader>
            <SectionTitle>파일 관리</SectionTitle>
            <FileSearch value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
          </FileSectionHeader>

          <Table>
            <thead>
              <tr>
                <Th style={{ width: '50px', textAlign: 'center' }}>번호</Th>
                <Th>파일명</Th>
                <Th style={{ width: '120px' }}>상태</Th>
                <Th style={{ width: '160px' }}>관리자</Th>
                <Th style={{ width: '150px' }}>등록일</Th>
                <Th style={{ width: '150px' }}>수정일</Th>
                <Th style={{ width: '160px' }}>파일 다운로드</Th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => (
                <tr key={file.id}>
                  <Td style={{ textAlign: 'center' }}>{index + 1}</Td>
                  <HoverTd onClick={() => setSelectedFile(file)}>{file.name}</HoverTd>
                  <Td>
                    <StatusBadge status={file.status}>{file.status}</StatusBadge>
                  </Td>
                  <Td>{file.manager}</Td>
                  <Td>{file.registeredAt}</Td>
                  <Td>{file.updatedAt}</Td>
                  <Td>
                    <FileDownloadWrapper>
                      <DownloadIconWrapper>
                        <DownloadIcon />
                      </DownloadIconWrapper>
                      <ActionIcons>
                        <EditIcon
                          onClick={() => {
                            setEditTargetFile({
                              title: file.name,
                              version: file.version,
                            });
                            setIsEditModalOpen(true);
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        <DeleteIcon
                          onClick={() => {
                            setTargetFileName(file.name);
                            setIsDeletePopupOpen(true);
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </ActionIcons>
                    </FileDownloadWrapper>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </FileSection>
      </Content>
      <Popup
        isOpen={isDeletePopupOpen}
        title="파일 삭제"
        message={`${targetFileName} 파일을 삭제하시겠습니까?`}
        warningMessages={['삭제한 파일은 복구할 수 없습니다.']}
        onClose={() => setIsDeletePopupOpen(false)}
        onDelete={() => {
          setIsDeletePopupOpen(false);
          setIsSuccessPopupOpen(true);
        }}
      />

      <Popup
        isOpen={isSuccessPopupOpen}
        isAlert
        title="파일 삭제 완료"
        message="삭제가 완료되었습니다."
        alertButtonText="확인"
        onClose={() => setIsSuccessPopupOpen(false)}
      />
      <FaqUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSubmit={(data) => {
          console.log('업로드된 CSV:', data);
          setIsCsvModalOpen(false);
        }}
      />
      {editTargetFile && (
        <FaqEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditTargetFile(null);
          }}
          onSubmit={(data) => {
            console.log('수정된 파일 데이터:', data);
            setIsEditModalOpen(false);
            setEditTargetFile(null);
          }}
          originalFileName={editTargetFile.title}
          originalVersion={editTargetFile.version}
        />
      )}
      {selectedFile && (
        <FileDetailPanel file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
`;
const Content = styled.div`
  flex: 1;
  padding: 40px;
  width: calc(100% - 280px);
  max-width: 1200px;
  margin-left: 280px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #0e3a95;
  margin: 0;
`;
const SubTitle = styled.p`
  font-size: 14px;
  color: #888;
  margin: 4px 0 0 0;
`;
const InfoBox = styled.div`
  padding: 20px 0;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
`;
const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  flex: 1 1 0;
  min-width: 160px;
`;
const InfoItemColumn = styled(InfoItem)`
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;
const Label = styled.div`
  font-weight: 600;
  color: #444;
`;
const Value = styled.div`
  color: #666;
`;
const FileSection = styled.div``;
const FileSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0e3a95;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    font-size: 14px;
    border-bottom: 1px solid #ddd;
    padding: 14px 8px;
  }
  th {
    background-color: #0e3a95;
    color: white;
    font-weight: 700;
  }
`;
const Th = styled.th`
  text-align: left;
  padding-left: 8px;
`;
const Td = styled.td`
  text-align: left;
  padding-left: 8px;
  vertical-align: middle;
`;
const FileDownloadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const DownloadIconWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: 25px;
`;
const ActionIcons = styled.div`
  display: flex;
  gap: 16px;
  svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #999;
  }
`;
const NoData = styled.div`
  margin-left: 280px;
  padding: 40px;
  font-size: 18px;
  color: #999;
`;

const HoverTd = styled.td`
  padding-left: 8px;
  vertical-align: middle;
  cursor: default;

  &:hover {
    cursor: pointer;
    color: #0e3a95;
    font-weight: 600;
  }
`;
