import { DashBoardIcon, DocsIcon, FaqIcon, SettingsIcon, WordIcon } from '@/assets/icons/side-bar';

export const commonMenuItems = [
  { id: 'dictionary', icon: WordIcon, label: '용어사전', path: '/dictionary' },
  { id: 'faq', icon: FaqIcon, label: 'FAQ', path: '/faq' },
  { id: 'docs', icon: DocsIcon, label: '사내문서', path: '/docs' },
  { id: 'dashboard', icon: DashBoardIcon, label: '대시보드', path: '/dashboard' },
];

export const settingsMenuItems = [
  {
    id: 'settings',
    icon: SettingsIcon,
    label: '설정',
    subMenuItems: [
      { id: 'flow-settings', icon: SettingsIcon, label: 'FLOW 설정', path: '/settings/flow' },
      { id: 'user-settings', icon: SettingsIcon, label: '사용자 설정', path: '/settings/user' },
    ],
  },
];
