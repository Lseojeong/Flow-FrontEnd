export const MODAL_STYLE = {
  WIDTH: '720px',
  PADDING: '32px',
  BORDER_RADIUS: '8px',
  TITLE_FONT_SIZE: '20px',

  MODAL_GAP: '20px',
  BUTTON_GAP: '12px',
  BUTTON_GAP_EDIT: '8px',
  CONTAINER_GAP: '12px',
  TITLE_MARGIN_BOTTOM: '1px',
  BUTTON_ROW_MARGIN_TOP: '20px',

  OVERLAY_BACKGROUND: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_Z_INDEX: 2000,

  TOAST_DELAY: 100,
} as const;

export const CATEGORY_MODAL_CONSTANTS = {
  CANCEL_BUTTON: '취소',
  REGISTER_BUTTON: '등록',
  EDIT_BUTTON: '수정',

  SUCCESS_REGISTER_MESSAGE: '카테고리가 등록되었습니다.',
  SUCCESS_EDIT_MESSAGE: '카테고리가 수정되었습니다.',

  DUPLICATE_ERROR: '중복된 카테고리입니다.',
} as const;

export const UPLOAD_MODAL_CONSTANTS = {
  CANCEL_BUTTON: '취소',
  EDIT_BUTTON: '수정',
  REGISTER_BUTTON: '등록',
  UPLOAD_BUTTON: '+ 업로드',

  SUCCESS_TITLE: '수정 완료',
  SUCCESS_UPLOAD_MESSAGE: '파일이 등록되었습니다.',
  SUCCESS_EDIT_MESSAGE: '파일이 수정되었습니다.',
  CONFIRM_BUTTON: '확인',

  CSV_ACCEPT: '.csv',
  PDF_ACCEPT: '.pdf',
} as const;
