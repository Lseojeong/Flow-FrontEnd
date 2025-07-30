import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from '@/components/common/layout/SideBar';
import { commonMenuItems, settingsMenuItems } from '@/constants/SideBar.constants';
import { symbolTextLogo } from '@/assets/logo';
import { DepartmentTagList } from '@/components/common/department/DepartmentTagList';
import DownloadIcon from '@/assets/icons/common/download.svg?react';
import EditIcon from '@/assets/icons/common/edit.svg?react';
import DeleteIcon from '@/assets/icons/common/delete.svg?react';
import { dictMockData } from '@/pages/mock/dictMock'; // 사내문서 데이터도 dictMockData에 포함되어 있어야 합니다
import StatusSummary from '@/components/common/status/StatusSummary';
import { StatusItemData } from '@/components/common/status/Status.types';

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
            <SubTitle>{detailData.name}는 익숙하면서도 안전하게, 온라인과 오프라인의 구분 없이 어디서나 빠른 협업을 할 수 있도록 최신 기술과 AI 기술을 활용</SubTitle>
          </TitleGroup>
          <RegisterButton>+ 데이터 등록</RegisterButton>
        </Header>

        <InfoBox>
          <InfoItem>
            <Label>상태:</Label>
            <Value>
              <StatusSummary items={statusItems} />
            </Value>
          </InfoItem>

          <InfoItem>
            <Label>등록일:</Label>
            <Value>{detailData.registeredDate}</Value>
          </InfoItem>

          <InfoItem>
            <Label>최종 수정일:</Label>
            <Value>{detailData.lastModified}</Value>
          </InfoItem>

          <InfoItem>
            <Label>최종 수정자:</Label>
            <Value>{detailData.lastEditor}</Value>
          </InfoItem>

          <InfoItem style={{ flexBasis: '100%', marginTop: '12px' }}>
            <Label>포함 부서:</Label>
            <Value>
              <DepartmentTagList departments={detailData.departments} />
            </Value>
          </InfoItem>
        </InfoBox>

        <FileSection>
          <SectionTitle>파일 관리</SectionTitle>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: '50px' }}>번호</Th>
                <Th>파일명</Th>
                <Th style={{ width: '120px' }}>상태</Th>
                <Th style={{ width: '160px' }}>관리자</Th>
                <Th style={{ width: '150px' }}>등록일</Th>
                <Th style={{ width: '150px' }}>수정일</Th>
                <Th style={{ width: '160px', textAlign: 'left' }}>파일 다운로드</Th>
              </tr>
            </thead>
            <tbody>
              {detailData.files.map((file, index) => (
                <tr key={file.id}>
                  <Td>{index + 1}</Td>
                  <Td>{file.name}</Td>
                  <Td>
                    <OutlinedStatusBadge
                      status={
                        file.status === 'Completed'
                          ? 'green'
                          : file.status === 'Processing'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {file.status}
                    </OutlinedStatusBadge>
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

// 스타일

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
  border-top: 2px solid #ddd;
  border-bottom: 1px solid #eee;
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

const Label = styled.div`
  font-weight: 600;
  color: #444;
`;

const Value = styled.div`
  color: #666;
`;

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

const OutlinedStatusBadge = styled.span<{ status: 'green' | 'yellow' | 'red' }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 1.5px solid
    ${({ status }) =>
      status === 'green' ? '#3FC36C' : status === 'yellow' ? '#F7B500' : '#F04438'};
  color: ${({ status }) =>
    status === 'green' ? '#3FC36C' : status === 'yellow' ? '#F7B500' : '#F04438'};
  background: transparent;
  white-space: nowrap;
`;

const NoData = styled.div`
  margin-left: 280px;
  padding: 40px;
  font-size: 18px;
  color: #999;
`;
