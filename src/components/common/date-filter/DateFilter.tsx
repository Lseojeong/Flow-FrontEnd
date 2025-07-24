import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { colors, fontWeight } from '@/styles/index';
import { calenderIcon as CalenderIcon, arrowIcon as ArrowIcon } from '@/assets/icons/common';
import { ko } from 'date-fns/locale';

registerLocale('ko', ko);

// 상수 정의
const DATE_FORMAT = 'yyyy/MM/dd';
const DATE_FORMAT_CALENDAR = 'yyyy년 MM월';
const DEFAULT_PLACEHOLDER = '날짜를 선택하세요';
const INPUT_WIDTH = '204px';
const INPUT_HEIGHT = '32px';
const CALENDAR_ICON_SIZE = '36px';
const ARROW_ICON_SIZE = '16px';
const NAVIGATION_BUTTON_SIZE = '24px';

// 타입 정의
export interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (_startDate: Date | null, _endDate: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

interface CustomNavigationProps {
  className?: string;
  onClick: () => void;
  type: 'previous' | 'next';
  disabled?: boolean;
}

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  hasValue?: boolean;
}

// 유틸리티 함수
const getBorderColor = (error: boolean, focused: boolean, disabled: boolean): string => {
  if (error) return '#ff4757';
  if (focused) return colors.Normal;
  if (disabled) return '#e1e5e9';
  return colors.BoxStroke;
};

const getBackgroundColor = (disabled: boolean): string => {
  return disabled ? '#f8f9fa' : 'white';
};

const getCalendarIconColor = (disabled: boolean): string => {
  return disabled ? '#9ca3af' : colors.Normal;
};

// 커스텀 네비게이션 컴포넌트
const CustomNavigation: React.FC<CustomNavigationProps> = ({
  className,
  onClick,
  type,
  disabled,
}) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.background = colors.Light;
    target.style.borderColor = colors.Normal;
    target.style.transform = 'scale(1.1)';

    const arrow = target.querySelector('svg');
    if (arrow) {
      arrow.style.color = colors.Normal;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.background = 'white';
    target.style.borderColor = colors.BoxStroke;
    target.style.transform = 'scale(1)';

    const arrow = target.querySelector('svg');
    if (arrow) {
      arrow.style.color = colors.BoxText;
    }
  };

  const getButtonPosition = () => {
    return type === 'previous' ? { left: '12px' } : { right: '12px' };
  };

  const getArrowRotation = () => {
    return type === 'previous' ? 'rotate(90deg)' : 'rotate(-90deg)';
  };

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'absolute',
        top: '10px',
        width: NAVIGATION_BUTTON_SIZE,
        height: NAVIGATION_BUTTON_SIZE,
        border: `1px solid ${disabled ? '#e1e5e9' : colors.BoxStroke}`,
        borderRadius: '50%',
        background: disabled ? '#f8f9fa' : 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1,
        ...getButtonPosition(),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ArrowIcon
        style={{
          width: ARROW_ICON_SIZE,
          height: ARROW_ICON_SIZE,
          color: colors.BoxText,
          transform: getArrowRotation(),
        }}
      />
    </button>
  );
};

// 커스텀 헤더 컴포넌트
const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}) => (
  <div style={{ position: 'relative', padding: '16px 16px 0 16px' }}>
    <div
      style={{
        fontSize: '16px',
        fontWeight: fontWeight.SemiBold,
        color: colors.BoxText,
        textAlign: 'center',
        marginBottom: '12px',
      }}
    >
      {date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
    </div>
    <CustomNavigation type="previous" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} />
    <CustomNavigation type="next" onClick={increaseMonth} disabled={nextMonthButtonDisabled} />
  </div>
);

// 메인 DateFilter 컴포넌트
export const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onDateChange,
  placeholder = DEFAULT_PLACEHOLDER,
  className,
  disabled = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onDateChange(start, end);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleCalendarOpen = () => {
    setIsOpen(true);
    setIsFocused(true);
  };

  const handleCalendarClose = () => {
    setIsOpen(false);
    setIsFocused(false);
  };

  const hasValue = !!(startDate || endDate);

  return (
    <DateFilterContainer className={className}>
      <DatePicker
        maxDate={new Date()}
        showPopperArrow={false}
        fixedHeight
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        open={isOpen}
        disabled={disabled}
        onInputClick={handleInputClick}
        onCalendarOpen={handleCalendarOpen}
        onCalendarClose={handleCalendarClose}
        placeholderText={placeholder}
        dateFormat={DATE_FORMAT}
        dateFormatCalendar={DATE_FORMAT_CALENDAR}
        locale="ko"
        customInput={
          <CustomInput disabled={disabled} error={error} focused={isFocused} hasValue={hasValue} />
        }
        popperClassName="date-picker-popper"
        popperPlacement="bottom-start"
        renderCustomHeader={CustomHeader}
      />
      <DatePickerStyles />
    </DateFilterContainer>
  );
};

// 커스텀 입력 컴포넌트
const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, onChange, placeholder, disabled, error, focused, hasValue }, ref) => {
    const handleClearClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <DateInputContainer
        disabled={disabled}
        error={error}
        focused={focused}
        hasValue={hasValue}
        onClick={onClick}
      >
        <CalendarIcon disabled={disabled}>
          <CalenderIcon />
        </CalendarIcon>
        <DateInput
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
        />
        {hasValue && !disabled && <ClearButton onClick={handleClearClick}>×</ClearButton>}
      </DateInputContainer>
    );
  }
);

CustomInput.displayName = 'CustomInput';

// 스타일 컴포넌트
const DateFilterContainer = styled.div`
  position: relative;
  width: fit-content;
`;

const DateInputContainer = styled.div<{
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  hasValue?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  width: ${INPUT_WIDTH};
  height: ${INPUT_HEIGHT};
  border: 1px solid
    ${({ error, focused, disabled }) =>
      getBorderColor(error || false, focused || false, disabled || false)};
  border-radius: 4px;
  background-color: ${({ disabled }) => getBackgroundColor(disabled || false)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    ${({ disabled, error }) =>
      !disabled &&
      `
      border-color: ${error ? '#ff3742' : colors.Normal};
      transform: translateY(-1px);
    `}
  }

  ${({ hasValue }) =>
    hasValue &&
    `
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  `}
`;

const CalendarIcon = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${CALENDAR_ICON_SIZE};
  height: ${CALENDAR_ICON_SIZE};
  color: ${({ disabled }) => getCalendarIconColor(disabled || false)};
  flex-shrink: 0;
  transition: color 0.2s ease;

  svg {
    width: ${ARROW_ICON_SIZE};
    height: ${ARROW_ICON_SIZE};
  }
`;

const DateInput = styled.input`
  flex: 1;
  padding: 0 12px 0 0;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: ${fontWeight.Medium};
  color: ${colors.BoxText};
  cursor: pointer;
  transition: color 0.2s ease;

  &:focus {
    outline: none;
    color: #1f2937;
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: ${fontWeight.Regular};
  }

  &::selection {
    background-color: rgba(59, 130, 246, 0.2);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;

  &:hover {
    background-color: #d1d5db;
    color: #374151;
    opacity: 1;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DatePickerStyles = createGlobalStyle`
  .date-picker-popper {
    z-index: 1000;
  }

  .react-datepicker {
    border: 1px solid ${colors.BoxStroke};
    border-radius: 8px;
    background: white;
    overflow: hidden;
  }

  .react-datepicker__header {
    background: ${colors.White};
    border-bottom: none;
    border-radius: 12px 12px 0 0;
  }

  .react-datepicker__navigation {
    display: none;
  }

  .react-datepicker__day-names {
    background: ${colors.White};
    margin-top: 12px;
    padding: 4px 0;
  }

  .react-datepicker__day-name {
    color: ${colors.Normal};
    font-weight: ${fontWeight.Medium};
    font-size: 12px;
    width: 36px;
    line-height: 24px;
  }

  .react-datepicker__month {
    margin: 8px;
  }

  .react-datepicker__week {
    display: flex;
    justify-content: space-around;
  }

  .react-datepicker__day {
    width: 36px;
    height: 36px;
    line-height: 36px;
    margin: 2px;
    border-radius: 8px;
    color: #374151;
    font-weight: ${fontWeight.Medium};
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .react-datepicker__day:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #4338ca 100%);
    color: ${colors.White};
    transform: scale(1.05);
  }

  .react-datepicker__day--selected {
    background: linear-gradient(135deg, ${colors.Normal} 0%, #4f46e5 100%);
    color: ${colors.White};
    border-radius: 8px;
    font-weight: ${fontWeight.SemiBold};
  }

  .react-datepicker__day--selected:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #4338ca 100%);
    transform: scale(1.05);
  }

  .react-datepicker__day--keyboard-selected {
    background: none !important;
    color: inherit !important;
  }

  .react-datepicker__day--in-selecting-range {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    color: ${colors.Normal};
  }

  .react-datepicker__day--in-range {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    color: ${colors.Normal};
    border-radius: 0;
  }

  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    background: linear-gradient(135deg, ${colors.Normal} 0%, #4f46e5 100%);
    color: ${colors.White};
    border-radius: 8px;
    font-weight: ${fontWeight.SemiBold};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .react-datepicker__day--today {
    position: relative;
  }

  .react-datepicker__day--today::after {
    content: '';
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: rgb(245, 210, 11);
    border-radius: 50%;
    margin-bottom: 0px;
  }

  .react-datepicker__day--outside-month {
    color: #d1d5db;
  }

  .react-datepicker__day--disabled {
    color: #d1d5db;
    cursor: not-allowed;
  }

  .react-datepicker__day--disabled:hover {
    background: transparent;
    transform: none;
  }
`;

export default DateFilter;
