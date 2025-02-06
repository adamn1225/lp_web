import React from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from 'date-fns';

interface DateRangePickerComponentProps {
    state: any[];
    setState: (state: any[]) => void;
    disabledDates: Date[];
    onClick?: () => void; // Add onClick prop
}

const DateRangePickerComponent: React.FC<DateRangePickerComponentProps> = ({ state, setState, disabledDates, onClick }) => {
    const handleSelect = (ranges: any) => {
        setState([ranges.selection]);
    };

    const formattedStartDate = state[0].startDate ? format(state[0].startDate, 'MM/dd/yyyy') : '';
    const formattedEndDate = state[0].endDate ? format(state[0].endDate, 'MM/dd/yyyy') : '';

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-fit w-full">
            <div className="rdrMonthsContainer">
                <DateRange
                    editableDateInputs={true}
                    onChange={handleSelect}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                    disabledDates={disabledDates}
                    minDate={new Date()} // Prevent selection of past dates
                    months={2} // Show two calendars
                    direction="horizontal" // Show calendars in a row for desktop
                    className="flex-1 w-full"
                />
            </div>
            <div className="flex justify-center mt-4">
                <button onClick={onClick} className="bg-secondary text-white px-3 py-1.5 rounded-md">Check Availability</button>
            </div>
            <style>{`
                .rdrMonth {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin: 0 8px;
                    padding: 8px;
                }
                .rdrMonthsContainer .rdrMonths {
                    display: flex;
                    flex-direction: column;
                }
                @media (min-width: 768px) {
                    .rdrMonthsContainer .rdrMonths {
                        flex-direction: row;
                    }
                }
            `}</style>
        </div>
    );
};

export default DateRangePickerComponent;