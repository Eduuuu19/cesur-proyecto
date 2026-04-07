import React, { useState, forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiChevronDown } from 'react-icons/fi';
import styles from './DateSelector.module.css';

registerLocale('es', es);

const CustomDateButton = forwardRef(({ onClick, isMonthMode, date }, ref) => (
  <div className={styles.selectorWrapper} onClick={onClick} ref={ref}>
    <FiCalendar size={14} />
    <span>
      {date ? (
        isMonthMode 
          ? date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
          : date.getFullYear()
      ) : "Seleccionar"}
    </span>
    <FiChevronDown size={14} />
  </div>
));

export default function DateSelector({ type = 'month', minDate = null }) {
  const [startDate, setStartDate] = useState(new Date());
  const isMonthMode = type === 'month';

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      showMonthYearPicker={isMonthMode}
      showYearPicker={!isMonthMode}
      minDate={minDate}
      locale="es"
      customInput={<CustomDateButton isMonthMode={isMonthMode} date={startDate} />}
    />
  );
}