import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

interface CalendarComponentProps {
  state: any[];
  setState: (state: any[]) => void;
  disabledDates: Date[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ state, setState, disabledDates }) => {
  const [killRange, setKillRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  ]);

  const handleSelect = (ranges) => {
    setKillRange([ranges.selection]);
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight to avoid timezone issues

  const initialRange = [{ startDate: null, endDate: null, key: 'selection' }];

  // Ensure disabledDates are in the correct format
  const formattedDisabledDates = disabledDates.map(date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // Set time to midnight to avoid timezone issues
    return newDate;
  });

  console.log('Formatted disabled dates:', formattedDisabledDates);

  return (
    <DateRange
      editableDateInputs={true}
      onChange={item => setState([item.selection])}
      moveRangeOnFirstSelection={false}
      ranges={state.length ? state : initialRange}
      disabledDates={formattedDisabledDates}
      minDate={today} // Prevent selection of past dates
    />
  );
};

export default CalendarComponent;