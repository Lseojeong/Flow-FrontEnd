// 카테고리 모달 상수
export const CATEGORY_MODAL_CONSTANTS = {
  CANCEL_BUTTON: '취소',
  REGISTER_BUTTON: '등록',
  EDIT_BUTTON: '수정',

  SUCCESS_REGISTER_MESSAGE: '카테고리가 등록되었습니다.',
  SUCCESS_EDIT_MESSAGE: '카테고리가 수정되었습니다.',

  DUPLICATE_ERROR: '중복된 카테고리입니다.',
  EMPTY_NAME_ERROR: '카테고리를 입력해주세요.',

  MODAL_WIDTH: '720px',
  MODAL_PADDING: '32px',
  MODAL_BORDER_RADIUS: '8px',
  MODAL_GAP: '20px',
  BUTTON_GAP: '12px',
  BUTTON_GAP_EDIT: '8px',
  CONTAINER_GAP: '12px',
  TITLE_FONT_SIZE: '20px',
  TITLE_MARGIN_BOTTOM: '1px',
  BUTTON_ROW_MARGIN_TOP: '20px',

  OVERLAY_BACKGROUND: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_Z_INDEX: 2000,

  TOAST_DELAY: 100,
} as const;

export const MODAL_TYPES = {
  REGISTER: 'register',
  EDIT: 'edit',
} as const;

export const ERROR_TYPES = {
  DUPLICATE: 'duplicate',
  EMPTY: 'empty',
} as const;

//업로드 모달 상수
export const UPLOAD_MODAL_CONSTANTS = {
  DEFAULT_TITLE: '파일 업로드',
  CANCEL_BUTTON: '취소',
  UPLOAD_BUTTON: '업로드',
} as const;
