import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

type Listing = {
    id: string;
    name: string;
    description: string;
    price: number;
    // Add other properties as needed
};

interface ReservationFormProps {
  listingId: string;
  reservedDates: Date[];
  "client:load": boolean;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ listingId, reservedDates }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [nights, setNights] = useState(1);
  const [state, setState] = useState<any[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [available, setListings] = useState<Listing[]>([]);
  const [isLocal, setIsLocal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocal(window.location.hostname === 'localhost');
    }
  }, []);

  const serverPort = import.meta.env.VITE_SERVER_PORT || '5000';
  const apiUrl = isLocal
    ? `http://localhost:${serverPort}/api/available`
    : `/.netlify/functions/availability`;

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const checkAvailability = async () => {
    setLoading(true);
    setError('');

    try {
      const formattedCheckIn = formatDate(state[0].startDate);
      const formattedCheckOut = formatDate(state[0].endDate);

      const response = await fetch(`${apiUrl}?checkIn=${encodeURIComponent(formattedCheckIn)}&checkOut=${encodeURIComponent(formattedCheckOut)}&minOccupancy=${encodeURIComponent(guestCount.toString())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      // console.log('API Response Text:', responseText);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText} - ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        throw new Error('Invalid JSON response');
      }

      if (!Array.isArray(data.results)) {
        throw new Error('Unexpected response format');
      }

      setListings(data.results);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const reservationData = {
      listingId: listingId,
      checkInDateLocalized: formatDate(state[0].startDate),
      checkOutDateLocalized: formatDate(state[0].endDate),
      guestsCount: guestCount,
      firstName: firstName,
      lastName: lastName
    };

    try {
      const response = await fetch('/.netlify/functions/createReservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });

      const jsonResponse = await response.json();
      console.log(jsonResponse);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText} - ${jsonResponse}`);
      }

      alert('Reservation successful!');
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2 '>
      <h1 className='text-center font-bold text-slate-600 text-xl decoration-slate-600 underline underline-offset-4'>Book Instantly</h1>
      <div className='text-slate-600 font-bold flex flex-col'>
        <label>First Name</label>
        <input
          type="text"
          placeholder='First Name'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className='text-slate-600 font-bold flex flex-col'>
        <label>Last Name</label>
        <input
          type="text"
          placeholder='Last Name'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className='grid grid-cols-2 items-center align-middle text-slate-600 font-bold'>
        <label>Number of Guests:</label>
        <select
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          required
        >
          {[...Array(5).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div className='flex flex-col items-stretch text-slate-600 font-bold'>
        <label>
          Number of Nights:
          <input
            type="number"
            value={nights}
            onChange={(e) => setNights(Number(e.target.value))}
            min="1"
            required
            className='w-full'
          />
        </label>
      </div>
      <h3 className="text-center pb-4 text-2xl">How long is your trip?</h3>
      <div className='flex flex-col items-center justify-center self-center align-middle text-slate-600 font-bold'>
        <label>Date Range:</label>
        <DateRange
          ranges={state}
          onChange={(item) => setState([item.selection])}
          disabledDates={reservedDates}
        />
      </div>
      <button className='bg-cyan-600 mb-6 font-bold text-sm text-white rounded h-11 transition-all duration-300 py-2 px-4 flex items-center justify-center cursor-pointer w-full hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300' type="submit">
        Reserve
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </form>
  );
};

export default ReservationForm;