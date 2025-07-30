import React, { useState } from 'react';
import styled from 'styled-components';
import { fontWeight, colors } from '@/styles/index';
import { MenuItemType, Props } from './SideBar.types';
import { ArrowIcon } from '@/assets/icons/common/index';
import { useNavigate } from 'react-router-dom'; 

/**
 * @example
<SideBar
  logoSymbol={symbolTextLogo}
  menuItems={menuItems}
  activeMenuId={activeMenuId}
  onMenuClick={setActiveMenuId}
/>;
*/

const SideBar = ({ logoSymbol, menuItems, activeMenuId, onMenuClick }: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const navigate = useNavigate(); 

  const handleClick = (item: MenuItemType) => {
    if (item.subMenuItems) {
      setOpenDropdownId(openDropdownId === item.id ? null : item.id);
    } else {
      onMenuClick?.(item.id);
      if (item.path) {
        navigate(item.path); 
      }
    }
  };

  return (
    <SideBarContainer>
      <LogoWrapper>
        <LogoImg src={logoSymbol} alt="Flow symbol logo" />
      </LogoWrapper>
      <MenuWrapper>
        <MenuList>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openDropdownId === item.id;
            const isActive = activeMenuId === item.id;

            return (
              <React.Fragment key={item.id}>
                <MenuItem $active={isActive} onClick={() => handleClick(item)}>
                  <Icon className="menu-icon" />
                  {item.label}
                  {item.subMenuItems && (
                    <span
                      style={{
                        marginLeft: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      {React.createElement(ArrowIcon, { width: 20, height: 20 })}
                    </span>
                  )}
                </MenuItem>

                {item.subMenuItems && isOpen && (
                  <SubMenuList>
                    {item.subMenuItems.map((subItem) => (
                      <SubMenuItem
                        key={subItem.id}
                        $active={activeMenuId === subItem.id}
                        onClick={() => {
                          onMenuClick?.(subItem.id);
                          if (subItem.path) {
                            navigate(subItem.path);
                          }
                        }}
                      >
                        {subItem.label}
                      </SubMenuItem>
                    ))}
                  </SubMenuList>
                )}
              </React.Fragment>
            );
          })}
        </MenuList>
      </MenuWrapper>
    </SideBarContainer>
  );
};

export default SideBar;


const SideBarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${colors.White};
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  user-select: none;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 40px;
  margin-bottom: 36px;
`;

const LogoImg = styled.img`
  width: 161px;
  height: 43px;
  margin-top: 40px;
`;

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 40px;
  margin-bottom: 40px;
`;

const MenuList = styled.ul`
  list-style: none;
  width: 100%;
  padding: 0;
`;

const MenuItem = styled.li<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0 24px 32px;
  color: ${({ $active }) => ($active ? colors.Normal : colors.Dark_active)};
  font-size: 18px;
  font-weight: ${fontWeight.Medium};
  cursor: pointer;
  transition: color 0.2s;
  outline: none;

  & .menu-icon {
    width: 20px;
    height: 20px;
    color: inherit;
    -webkit-user-drag: none;
  }
  &:hover {
    color: ${colors.Light_active};
  }
`;

const SubMenuList = styled.ul`
  list-style: none;
  padding-left: 35px;
  margin-top: 8px;
`;

const SubMenuItem = styled.li<{ $active?: boolean }>`
  padding: 10px 60px 10px 30px;
  font-size: 14px;
  font-weight: ${fontWeight.Medium};
  color: ${({ $active }) => ($active ? colors.Normal : colors.Black)};
  cursor: pointer;
  background: ${({ $active }) => ($active ? colors.Light : 'transparent')};
  border-radius: 4px;
  margin-bottom: 4px;
  transition:
    background 0.2s,
    color 0.2s;
  outline: none;
  &:hover {
    color: ${colors.Normal};
  }
`;
