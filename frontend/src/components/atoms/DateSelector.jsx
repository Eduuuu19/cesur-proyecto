import React, { forwardRef } from 'react';
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

export default function DateSelector({ type = 'month', selectedDate, onChange, fechasDisponibles = {} }) {
  const isMonthMode = type === 'month';

  const esMesValido = (date) => {
    const año = date.getFullYear().toString();
    const mes = (date.getMonth() + 1);
    
    if (!fechasDisponibles[año]) return false;
    return fechasDisponibles[año].includes(mes);
  };

  const esAñoValido = (date) => {
    const año = date.getFullYear().toString();
    return !!fechasDisponibles[año];
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      showMonthYearPicker={isMonthMode}
      showYearPicker={!isMonthMode}
      filterDate={isMonthMode ? esMesValido : esAñoValido}
      dateFormat={isMonthMode ? "MM/yyyy" : "yyyy"}
      locale="es"
      customInput={<CustomDateButton isMonthMode={isMonthMode} date={selectedDate} />}
    />
  );
}