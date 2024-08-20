import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { Search } from "lucide-react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import _ from 'lodash';

interface Listing {
  _id: string;
  title: string;
  picture: {
    thumbnail: string;
    caption: string;
  };
  publicDescription: {
    summary: string;
  };
  prices: {
    basePrice: number;
    currency: string;
  };
  // Add other properties as needed
}

const InstantBooking: React.FC = () => {
  const [minOccupancy, setMinOccupancy] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [available, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<any[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isLocal, setIsLocal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocal(window.location.hostname === 'localhost');
    }

    // Fetch unavailable and booked dates when the component mounts
    const fetchUnavailableDates = async () => {
      try {
        const listingId = window.location.pathname.split('/').pop();
        const startDate = new Date().toISOString().slice(0, 10);
        const endDate = '2025-08-24'; // Set end date to 2025-08-24
        const apiUrl = isLocal
          ? `http://localhost:8888/.netlify/functions/instantBooking?listingId=${listingId}&startDate=${startDate}&endDate=${endDate}`
          : `/.netlify/functions/instantBooking?listingId=${listingId}&startDate=${startDate}&endDate=${endDate}`;

        console.log('Fetching unavailable dates from:', apiUrl);
        console.log('isLocal:', isLocal);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched unavailable dates:', data);

        if (!data.unavailableDates || !Array.isArray(data.unavailableDates)) {
          throw new Error('Invalid data structure');
        }

        const unavailable = data.unavailableDates.map((date: string) => new Date(date));
        const booked = data.bookedDates.map((date: string) => new Date(date));

        console.log('Unavailable dates:', unavailable);
        console.log('Booked dates:', booked);

        setUnavailableDates(unavailable);
        setBookedDates(booked);
      } catch (err) {
        console.error('Error fetching unavailable dates:', err);
        setError(err.message);
      }
    };

    fetchUnavailableDates();
  }, [isLocal]);

  // Combine unavailable and booked dates
  const disabledDates = [...unavailableDates, ...bookedDates];

  return (
    <div className="mt-4">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <DateRange
        editableDateInputs={true}
        onChange={item => setState([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={state}
        disabledDates={disabledDates} // Pass combined disabledDates to DateRange
      />
<div className="flex flex-col justify-center items-center">
        <button type="submit" className="h-full bg-cyan-600 m-0 md:w-1/2 drop-shadow-lg w-full py-1 px-4 xs:mx-2 text-lg rounded-lg text-white">
         Book Instantly!
        </button>
</div>

    </div>
  );
};

export default InstantBooking;