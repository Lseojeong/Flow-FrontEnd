import React from 'react';
import styled from 'styled-components';
import SideBar from '@/components/common/layout/SideBar';
import { Button } from '@/components/common/button/Button';
import Divider from '@/components/common/divider/Divider';
import { symbolTextLogo } from '@/assets/logo';
import { colors, fontWeight } from '@/styles';
import type { MenuItemType } from '@/components/common/layout/SideBar.types';

interface CategoryPageLayoutProps {
  title: string;
  description: string;
  activeMenuId: string;
  menuItems: MenuItemType[];
  onMenuClick: (_id: string) => void;
  onAddCategory: () => void;
  children: React.ReactNode;
}

export const CategoryPageLayout: React.FC<CategoryPageLayoutProps> = ({
  title,
  description,
  activeMenuId,
  menuItems,
  onMenuClick,
  onAddCategory,
  children,
}) => {
  return (
    <PageWrapper>
      <SideBarWrapper>
        <SideBar
          logoSymbol={symbolTextLogo}
          menuItems={menuItems}
          activeMenuId={activeMenuId}
          onMenuClick={onMenuClick}
        />
      </SideBarWrapper>

      <Content>
        <ContentInner>
          <PageTitle>{title}</PageTitle>
          <Description>{description}</Description>
          <Divider />

          <TopBar>
            <Button size="small" onClick={onAddCategory}>
              + 카테고리 등록
            </Button>
          </TopBar>

          {children}
        </ContentInner>
      </Content>
    </PageWrapper>
  );
};

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
`;

const ContentInner = styled.div`
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

const Description = styled.p`
  font-size: 16px;
  font-weight: ${fontWeight.Regular};
  color: ${colors.BoxText};
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;
