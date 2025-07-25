// src/playground/SideBarPlayground.tsx
import { useState } from 'react';
import { symbolTextLogo } from '@/assets/logo';
import { SideBar, commonMenuItems, settingsMenuItems } from '@/components/common/layout/index';

const menuItems = [...commonMenuItems, ...settingsMenuItems];

export const SideBarPlayground = () => {
  const [activeMenuId, setActiveMenuId] = useState('dictionary');

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <SideBar
        logoSymbol={symbolTextLogo}
        menuItems={menuItems}
        activeMenuId={activeMenuId}
        onMenuClick={setActiveMenuId}
      />
      <div style={{ marginLeft: '300px', padding: '2rem', minWidth: '300px' }}>
        <h3>컨트롤 패널</h3>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Active Menu</h4>
          <select
            value={activeMenuId}
            onChange={(e) => setActiveMenuId(e.target.value)}
            style={{ padding: '8px', width: '100%' }}
          >
            <option value="">없음</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h4>클릭된 메뉴</h4>
          <p>
            현재 활성 메뉴: <strong>{activeMenuId || '없음'}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
