import React from "react";

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const pad = (num) => num.toString().padStart(2, "0");

const CalendarSelector = ({ selectedDays, setSelectedDays }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based месяц
  const daysInMonth = getDaysInMonth(year, month);

  const toggleDay = (day) => {
    const dayStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    if (selectedDays.includes(dayStr)) {
      setSelectedDays(selectedDays.filter(d => d !== dayStr));
    } else {
      setSelectedDays([...selectedDays, dayStr]);
    }
  };

  return (
    <div className="calendar-grid">
      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
        const dayStr = `${year}-${pad(month + 1)}-${pad(day)}`;
        const isActive = selectedDays.includes(dayStr);

        return (
          <div
            key={day}
            className={`calendar-day ${isActive ? "active" : ""}`}
            onClick={() => toggleDay(day)}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarSelector;
