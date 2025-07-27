import React from 'react';

export interface MenuItemType {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  label: string;
  id: string;
  path?: string;
  subMenuItems?: MenuItemType[];
}

export interface Props {
  logoSymbol: string;
  menuItems: MenuItemType[];
  activeMenuId?: string;
  onMenuClick?: (_menuId: string) => void;
}
