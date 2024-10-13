import React from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

interface CalendarComponentProps {
  state: any[];
  setState: (state: any[]) => void;
  disabledDates: Date[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ state, setState, disabledDates }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight to avoid timezone issues

  return (
    <DateRange
      editableDateInputs={true}
      onChange={item => {
        console.log("DateRange onChange:", item);
        setState([item.selection]);
      }}
      moveRangeOnFirstSelection={false}
      ranges={state}
      disabledDates={disabledDates}
      minDate={today} // Prevent selection of past dates
    />
  );
};

export default CalendarComponent;