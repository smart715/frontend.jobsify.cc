'use client';

import { useState } from 'react';

import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarWithDropdown = () => {
  const [date, setDate] = useState(new Date());

  const handleYearChange = (e) => {
    const newDate = new Date(date);

    newDate.setFullYear(e.target.value);
    setDate(newDate);
  };

  const handleMonthChange = (e) => {
    const newDate = new Date(date);

    newDate.setMonth(e.target.value);
    setDate(newDate);
  };

  const years = [];
  const currentYear = new Date().getFullYear();

  for (let y = currentYear - 10; y <= currentYear + 10; y++) {
    years.push(y);
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Selected Date: {date.toDateString()}</h3>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <select value={date.getFullYear()} onChange={handleYearChange}>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select value={date.getMonth()} onChange={handleMonthChange}>
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
      </div>

      <Calendar onChange={setDate} value={date} />
    </div>
  );
};

export default CalendarWithDropdown;
