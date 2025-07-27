export interface Props {
  /** 라벨 텍스트 */
  label?: string;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 최대 글자수 제한 */
  maxLength?: number;
  /** 빈 값일 때 표시할 에러 메시지 */
  errorMessage?: string;
  /** 외부에서 관리하는 값 (controlled component) */
  value?: string;
  /** 값 변경 시 호출되는 핸들러 */
  onChange?: (_value: string) => void;
  /** blur 이벤트 핸들러 */
  onBlur?: () => void;
}
