import React, { useState } from 'react';
import { Search } from 'lucide-react';

const ReservationDateForm: React.FC = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const checkAvailability = async () => {
    if (!start || !end) {
      alert('Please select both start and end dates.');
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/checkAvailability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ start, end })
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Error checking availability: ' + data.error);
      } else if (data.available) {
        alert('The property is available for the selected dates.');
        // Proceed with reservation logic here
      } else {
        alert('The property is not available for the selected dates.');
      }
    } catch (error) {
      alert('Error checking availability: ' + error.message);
    }
  };

  return (
    <form id="reservation-form" autoComplete="off" method="get" action="">
      <div id="date-range-picker" className="flex items-center">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
          </div>
          <input
            id="datepicker-range-start"
            name="start"
            type="text"
            className="bg-gray-50 border-2 border-cyan-400 text-slate-900 placeholder-slate-600 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full ps-9 py-3 px-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
            placeholder="Check in date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <span className="mx-1 text-gray-500"></span>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
          </div>
          <input
            id="datepicker-range-end"
            name="end"
            type="text"
            className="placeholder: text-md bg-gray-50 border-2 border-cyan-400 text-slate-900 placeholder-slate-600 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full ps-9 py-3 px-1 dark:bg-cyan-700 dark:border-cyan-600 dark:placeholder-cyan-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500"
            placeholder="Check out date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <div className="ml-2">
          <button type="button" id="check-availability" className="bg-cyan-600 py-2.5 px-2.5 border rounded-lg shadow-md shadow-cyan-500/30 text-muted-100" onClick={checkAvailability}>
            <Search />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReservationDateForm;