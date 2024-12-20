import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from 'date-fns';

interface DateRangePickerComponentProps {
    state: any[];
    setState: (state: any[]) => void;
    disabledDates: Date[];
}

const DateRangePickerComponent: React.FC<DateRangePickerComponentProps> = ({ state, setState, disabledDates }) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleInputClick = () => {
        setShowPicker(true);
    };

    const handleClose = () => {
        setShowPicker(false);
    };

    const handleSelect = (ranges: any) => {
        setState([ranges.selection]);
    };

    const formattedStartDate = state[0].startDate ? format(state[0].startDate, 'MM/dd/yyyy') : '';
    const formattedEndDate = state[0].endDate ? format(state[0].endDate, 'MM/dd/yyyy') : '';

    return (
        <div>
            <input
                type="text"
                value={`${formattedStartDate} - ${formattedEndDate}`}
                onClick={handleInputClick}
                readOnly
                className="border rounded-xl border-slate-400 p-2 w-full"
            />
            {showPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-fit w-full">
                        <div className="flex justify-end">
                            <button onClick={handleClose} className="text-black text-2xl">&times;</button>
                        </div>
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
                                className="flex-1"
                            />
                        </div>
                        <div className="flex justify-center mt-4">
                            <button onClick={handleClose} className="bg-secondary text-white px-4 py-2 rounded">Select Dates</button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
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