import { dashBoardIcon, docsIcon, faqIcon, settingsIcon, wordIcon } from '@/assets/icons/side-bar';

export const commonMenuItems = [
  { id: 'dictionary', icon: wordIcon, label: '용어사전', path: '/dictionary' },
  { id: 'faq', icon: faqIcon, label: 'FAQ', path: '/faq' },
  { id: 'docs', icon: docsIcon, label: '사내문서', path: '/docs' },
  { id: 'dashboard', icon: dashBoardIcon, label: '대시보드', path: '/dashboard' },
];

export const settingsMenuItems = [
  {
    id: 'settings',
    icon: settingsIcon,
    label: '설정',
    subMenuItems: [
      { id: 'flow-settings', icon: settingsIcon, label: 'FLOW 설정', path: '/settings/flow' },
      { id: 'user-settings', icon: settingsIcon, label: '사용자 설정', path: '/settings/user' },
    ],
  },
];
