import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { colors, fontWeight } from '@/styles/index';
import { CalenderIcon, ArrowIcon } from '@/assets/icons/common/index';
import { ko } from 'date-fns/locale';
import { DateFilterProps, NavigationProps, InputProps } from './DateFilter.types';
import {
  DATE_FORMAT,
  DATE_FORMAT_CALENDAR,
  DEFAULT_PLACEHOLDER,
  INPUT_WIDTH,
  INPUT_HEIGHT,
  INPUT_ICON_SIZE,
  INPUT_FONT_SIZE,
  INPUT_FONT_WEIGHT,
  INPUT_TEXT_COLOR,
  INPUT_PLACEHOLDER_COLOR,
  INPUT_BORDER_COLOR,
  INPUT_FOCUS_COLOR,
  INPUT_BG_COLOR,
  INPUT_RADIUS,
  INPUT_PADDING,
  NAVIGATION_BUTTON_SIZE,
} from '@/constants/FilterSearch.constants';

registerLocale('ko', ko);

const CustomNavigation: React.FC<NavigationProps> = ({ className, onClick, type, disabled }) => {
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
          width: INPUT_ICON_SIZE,
          height: INPUT_ICON_SIZE,
          color: colors.BoxText,
          transform: getArrowRotation(),
        }}
      />
    </button>
  );
};

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

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

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
  const [tempStartDate, setTempStartDate] = useState<Date | null>(
    startDate ? new Date(startDate) : null
  );
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate ? new Date(endDate) : null);

  // string을 Date 객체로 변환
  const startDateObj = startDate ? new Date(startDate) : null;
  const endDateObj = endDate ? new Date(endDate) : null;

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    // 임시 상태 업데이트
    setTempStartDate(start);
    setTempEndDate(end);

    // Date 객체를 yyyy-MM-dd 형식으로 변환하여 전달
    const formatDate = (date: Date | null) => {
      if (!date) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startString = formatDate(start);
    const endString = formatDate(end);

    // 두 날짜가 모두 선택된 경우에만 onDateChange 호출
    if (startString && endString) {
      onDateChange(startString, endString);
    }
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

  const filterDate = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  };

  return (
    <DateFilterContainer className={className}>
      <DatePicker
        filterDate={filterDate}
        showPopperArrow={false}
        selected={tempStartDate}
        onChange={handleDateChange}
        startDate={tempStartDate}
        endDate={tempEndDate}
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
        selectsStart={!tempEndDate}
        selectsEnd={!!tempStartDate && !tempEndDate}
        customInput={
          <CustomInput disabled={disabled} error={error} focused={isFocused} hasValue={hasValue} />
        }
        popperClassName="date-picker-popper"
        popperPlacement="bottom-start"
        renderCustomHeader={CustomHeader}
        dayClassName={(date) => {
          const isSunday = date.getDay() === 0;
          const isRangeStart = startDateObj && isSameDay(date, startDateObj);
          const isRangeEnd = endDateObj && isSameDay(date, endDateObj);
          const isToday = isSameDay(date, new Date());

          let className = '';
          if (isSunday) className += ' react-datepicker__day--sun';
          if (isRangeStart) className += ' react-datepicker__day--range-start';
          if (isRangeEnd) className += ' react-datepicker__day--range-end';
          if (isToday) className += ' react-datepicker__day--today';

          return className.trim();
        }}
      />
      <DatePickerStyles />
    </DateFilterContainer>
  );
};

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onClick, onChange, placeholder, disabled, error, focused, hasValue }, ref) => {
    const handleClearClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <DateInputContainer
        disabled={disabled}
        $error={error}
        $focused={focused}
        $hasValue={hasValue}
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

const DateFilterContainer = styled.div`
  position: relative;
  width: fit-content;
`;

const DateInputContainer = styled.div<{
  disabled?: boolean;
  $error?: boolean;
  $focused?: boolean;
  $hasValue?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  width: ${INPUT_WIDTH};
  height: ${INPUT_HEIGHT};
  border: 1px solid
    ${({ $error, $focused, disabled }) =>
      $error
        ? '#ff4757'
        : $focused
          ? INPUT_FOCUS_COLOR
          : disabled
            ? '#e1e5e9'
            : INPUT_BORDER_COLOR};
  border-radius: ${INPUT_RADIUS};
  background: ${INPUT_BG_COLOR};
  padding: ${INPUT_PADDING};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: border-color 0.2s;

  &:hover,
  &:focus-within {
    border-color: ${INPUT_FOCUS_COLOR};
  }
`;

const CalendarIcon = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${INPUT_ICON_SIZE};
  height: ${INPUT_ICON_SIZE};
  color: ${({ disabled }) => (disabled ? '#9ca3af' : INPUT_BORDER_COLOR)};
  flex-shrink: 0;
  margin-right: 8px;
  transition: color 0.2s ease;

  svg {
    width: ${INPUT_ICON_SIZE};
    height: ${INPUT_ICON_SIZE};
  }
`;

const DateInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: ${INPUT_FONT_SIZE};
  font-weight: ${INPUT_FONT_WEIGHT};
  color: ${INPUT_TEXT_COLOR};
  padding: 0;

  &::placeholder {
    color: ${INPUT_PLACEHOLDER_COLOR};
    opacity: 0.7;
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
    color: rgb(255, 195, 84);
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
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
    color: ${colors.Normal};
  }

  .react-datepicker__day--in-range {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
    color: ${colors.Normal} !important;
    border-radius: 0 !important;
  }

  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    background: linear-gradient(135deg, ${colors.Normal} 0%, #4f46e5 100%) !important;
    color: ${colors.White} !important;
    border-radius: 8px !important;
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
    background: rgb(28, 219, 79);
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

  .react-datepicker__day-name:first-child {
    color: ${colors.MainRed} !important;
  }

  .react-datepicker__day-name:last-child {
    color: ${colors.Normal} !important;
  }

  .react-datepicker__day-name:nth-child(2),
  .react-datepicker__day-name:nth-child(3),
  .react-datepicker__day-name:nth-child(4),
  .react-datepicker__day-name:nth-child(5),
  .react-datepicker__day-name:nth-child(6) {
    color: ${colors.Black} !important;
  }
`;

export default DateFilter;
