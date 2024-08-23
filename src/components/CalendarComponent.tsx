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
  return (
    <DateRange
      editableDateInputs={true}
      onChange={item => setState([item.selection])}
      moveRangeOnFirstSelection={false}
      ranges={state}
      disabledDates={disabledDates} // Pass combined disabledDates to DateRange
    />
  );
};

export default CalendarComponent;