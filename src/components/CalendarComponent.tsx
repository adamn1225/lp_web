import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/global.scss"; // Ensure the global styles are imported

interface CalendarComponentProps {
  state: any[];
  setState: (state: any[]) => void;
  disabledDates: Date[];
  datePrices: { [key: string]: number };
  minNights: number;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ state, setState, disabledDates, datePrices, minNights }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setState([{ startDate: date, endDate, key: 'selection' }]);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setState([{ startDate, endDate: date, key: 'selection' }]);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || disabledDates.some(disabledDate => disabledDate.getTime() === date.getTime());
  };

  const renderDayContents = (day: number, date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const price = datePrices[dateString];
    const isDisabled = isDateDisabled(date);

    return (
      <div className="rdrDay flex justify-between gap-5">
        <span className="rdrDayNumber">{day}</span>
        {!isDisabled && price && <div className="rdrDayPrice">${price}</div>}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex flex-col w-full mb-4">
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="p-1 border rounded w-full"
          dayClassName={(date) => isDateDisabled(date) ? "disabled-date" : ""}
          renderDayContents={renderDayContents}
        />
      </div>
      <div className="flex flex-col w-full mb-4">
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          className="p-1 border rounded w-full"
          dayClassName={(date) => isDateDisabled(date) ? "disabled-date" : ""}
          renderDayContents={renderDayContents}
        />
      </div>
    </div>
  );
};

export default CalendarComponent;