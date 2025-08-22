interface BasePopupProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
}

interface AlertPopupProps extends BasePopupProps {
  isAlert: true;
  alertButtonText?: string;
}

interface ConfirmPopupProps extends BasePopupProps {
  isAlert?: false;
  warningMessages?: string[];
  cancelText?: string;
  confirmText?: string;
  onDelete: () => void;
  disabled?: boolean;
  hasError?: boolean;
}

export type PopupProps = AlertPopupProps | ConfirmPopupProps;

export type { PopupProps as Props };
