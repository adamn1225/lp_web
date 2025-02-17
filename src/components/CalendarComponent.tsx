import React from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

interface CalendarComponentProps {
  state: any[];
  setState: (state: any[]) => void;
  disabledDates: Date[];
  datePrices: { [key: string]: number }; // Add datePrices prop
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ state, setState, disabledDates, datePrices }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialRange = [{ startDate: null, endDate: null, key: 'selection' }];

  const formattedDisabledDates = disabledDates.map(date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  });

  console.log('Formatted disabled dates:', formattedDisabledDates);

  const dayContentRenderer = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const price = datePrices[dateString];
    return (
      <div>
        <span>{date.getDate()}</span>
        {price && <div className="text-xs text-gray-500">${price}</div>}
      </div>
    );
  };

  return (
    <DateRange
      editableDateInputs={true}
      onChange={item => setState([item.selection])}
      moveRangeOnFirstSelection={false}
      ranges={state.length ? state : initialRange}
      disabledDates={formattedDisabledDates}
      minDate={today} // Prevent selection of past dates
      dayContentRenderer={dayContentRenderer} // Use dayContentRenderer to display prices
    />
  );
};

export default CalendarComponent;