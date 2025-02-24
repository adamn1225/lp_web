import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/global.scss"; // Ensure the global styles are imported

interface CalendarComponentProps {
  state: any[];
  setState: (state: any[]) => void;
  disabledDates: string[];
  datePrices: { [key: string]: number };
  minNights: number;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ state, setState, disabledDates, datePrices, minNights }) => {
  const today = new Date();

  const initialRange = [{ startDate: null, endDate: null, key: 'selection' }];

  // Push each disabled date one day ahead
  const formattedDisabledDates = disabledDates.map(date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  });

  console.log('Formatted disabled dates:', formattedDisabledDates);

  const dayContentRenderer = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const price = datePrices[dateString];
    const isDisabled = formattedDisabledDates.some(disabledDate => disabledDate.getTime() === date.getTime());
    const isStartOfMonth = date.getDate() === 1;
    const isEndOfMonth = date.getDate() === new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const isPassive = date.getMonth() !== state[0].startDate.getMonth();

    return (
      <div className={`rdrDay flex justify-between gap-5 ${isStartOfMonth ? 'rdrDayStartOfMonth' : ''} ${isEndOfMonth ? 'rdrDayEndOfMonth' : ''}`}>
        <span className="rdrDayNumber">{date.getDate()}</span>
        {price && (
          <div className={`rdrDayPrice ${isDisabled ? 'line-through opacity-50' : ''}`}>
            ${price}
          </div>
        )}
      </div>
    );
  };

  const [months, setMonths] = useState(2);

  useEffect(() => {
    const updateMonths = () => {
      if (window.innerWidth < 768) {
        setMonths(1);
      } else {
        setMonths(2);
      }
    };

    updateMonths();
    window.addEventListener('resize', updateMonths);

    return () => window.removeEventListener('resize', updateMonths);
  }, []);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value);
    const newEndDate = state[0].endDate;
    setState([{ startDate: newStartDate, endDate: newEndDate, key: 'selection' }]);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = state[0].startDate;
    const newEndDate = new Date(e.target.value);
    setState([{ startDate: newStartDate, endDate: newEndDate, key: 'selection' }]);
  };

  const handleDateRangeChange = (item) => {
    setState([item.selection]);
  };

  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  return (
    <div className="flex flex-col-reverse md:flex-col">
      <div className="flex justify-center items-center gap-1 md:gap-4 -mt-1 md:mt-0 mb-4 md:mb-3">
        <div className="flex flex-col w-full">
          <input
            type="date"
            value={state[0].startDate ? state[0].startDate.toISOString().split('T')[0] : ''}
            onChange={handleStartDateChange}
            className="p-1 border rounded w-full"
          />
        </div>

        <div className="flex flex-col w-full">
          <input
            type="date"
            value={state[0].endDate ? state[0].endDate.toISOString().split('T')[0] : ''}
            onChange={handleEndDateChange}
            className="p-1 border rounded w-full"
          />
        </div>
      </div>
      <div style={{ width: '75%' }}>
        <DateRange
          editableDateInputs={true}
          onChange={handleDateRangeChange}
          moveRangeOnFirstSelection={false}
          ranges={state.length ? state : initialRange}
          disabledDates={formattedDisabledDates}
          minDate={today}
          dayContentRenderer={dayContentRenderer}
          months={months}
          direction="horizontal"
          shownDate={today}
        />
      </div>
    </div>
  );
};

export default CalendarComponent;