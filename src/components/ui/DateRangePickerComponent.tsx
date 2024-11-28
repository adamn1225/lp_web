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
                <div className="custom-modal">
                    <div className="custom-modal-content">
                        <span className="custom-close" onClick={handleClose}>&times;</span>
                        <DateRange
                            editableDateInputs={true}
                            onChange={item => setState([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                            disabledDates={disabledDates}
                            minDate={new Date()} // Prevent selection of past dates
                            months={2} // Show two calendars
                            direction="vertical" // Show calendars in a column
                            className="flex"
                        />
                    </div>
                </div>
            )}
            <style>{`
                .custom-modal {
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0,0,0,0.4);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .custom-modal-content {
                    background-color: #fefefe;
                    padding: 20px;
                    border: 1px solid #888;
                    border-radius: 8px;
                    position: relative;
                    width: screen;
                    max-width: 500px;
                }
                .custom-close {
                    color: #000;
                    position: absolute;
                    top: 1px;
                    right: 5px;
                    font-size: 28px;
                    font-weight: bold;
                }
                .custom-close:hover,
                .custom-close:focus {
                    color: black;
                    text-decoration: none;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default DateRangePickerComponent;