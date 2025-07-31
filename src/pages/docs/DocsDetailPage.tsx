import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from '@/components/common/layout/SideBar';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { symbolTextLogo } from '@/assets/logo';
import DownloadIcon from '@/assets/icons/common/download.svg?react';
import EditIcon from '@/assets/icons/common/edit.svg?react';
import DeleteIcon from '@/assets/icons/common/delete.svg?react';
import { dictMockData } from '@/pages/mock/dictMock';
import StatusSummary from '@/components/common/status/StatusSummary';
import { StatusItemData } from '@/components/common/status/Status.types';
import { StatusBadge } from '@/components/common/status/StatusBadge';
import DepartmentTagList from '@/components/common/department/DepartmentTagList';
import Divider from '@/components/common/divider/Divider';
import DoubleDivider from '@/components/common/divider/DoubleDivider';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export default function DocsDetailPage() {
  const { docId } = useParams();
  const detailData = dictMockData.find((item) => item.id.toString() === docId);

  if (!detailData) return <NoData>데이터가 없습니다.</NoData>;

  const statusItems: StatusItemData[] = [
    { type: 'Completed', count: detailData.status.green },
    { type: 'Processing', count: detailData.status.yellow },
    { type: 'Fail', count: detailData.status.red },
  ];

  return (
    <PageWrapper>
      <SideBar
        logoSymbol={symbolTextLogo}
        menuItems={menuItems}
        activeMenuId="docs"
        onMenuClick={() => {}}
      />

      <Content>
        <Header>
          <TitleGroup>
            <Title>{detailData.name}</Title>
            <SubTitle>{detailData.description}</SubTitle>
          </TitleGroup>
          <RegisterButton>+ 데이터 등록</RegisterButton>
        </Header>
        <DoubleDivider />
        <InfoBox>
          <InfoItemColumn>
            <Label>상태:</Label>
            <Value><StatusSummary items={statusItems} /></Value>
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
            <Value><DepartmentTagList departments={detailData.departments} /></Value>
          </InfoItemColumn>
        </InfoBox>
        <Divider />
        <FileSection>
          <SectionTitle>파일 관리</SectionTitle>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: '50px', textAlign: 'center' }}>번호</Th>
                <Th>파일명</Th>
                <Th style={{ width: '100px' }}>상태</Th>
                <Th style={{ width: '160px' }}>관리자</Th>
                <Th style={{ width: '150px' }}>등록일</Th>
                <Th style={{ width: '150px' }}>수정일</Th>
                <Th style={{ width: '160px' }}>파일 다운로드</Th>
              </tr>
            </thead>
            <tbody>
              {detailData.files.map((file, index) => (
                <tr key={file.id}>
                  <Td style={{ textAlign: 'center' }}>{index + 1}</Td>
                  <Td>{file.name}</Td>
                  <Td>
                    <StatusBadge status={file.status}>{file.status}</StatusBadge>
                  </Td>
                  <Td>{file.manager}</Td>
                  <Td>{file.registeredAt}</Td>
                  <Td>{file.updatedAt}</Td>
                  <Td>
                    <FileDownloadWrapper>
                      <DownloadIconWrapper><DownloadIcon /></DownloadIconWrapper>
                      <ActionIcons>
                        <EditIcon />
                        <DeleteIcon />
                      </ActionIcons>
                    </FileDownloadWrapper>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </FileSection>
      </Content>
    </PageWrapper>
  );
}

// 스타일 컴포넌트
const PageWrapper = styled.div` display: flex; `;
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
const TitleGroup = styled.div` display: flex; flex-direction: column; `;
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
const RegisterButton = styled.button`
  background-color: #0e3a95;
  color: white;
  border: none;
  padding: 8px 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: #07326d;
  }
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
const Value = styled.div` color: #666; `;

const FileSection = styled.div``;
const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
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
