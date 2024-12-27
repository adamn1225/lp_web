import React, { useState, useEffect } from "react";
import { addDays } from "date-fns";
import BookingFormModal from "./BookingFormModal";
import CalendarComponent from "./CalendarComponent";

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

const InstantBooking: React.FC<{ listingId: string }> = ({ listingId }) => {
  const [minOccupancy, setMinOccupancy] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [available, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<any[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isLocal, setIsLocal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [guests, setGuests] = useState<number>(1);
  const [pets, setPets] = useState<number>(0);
  const [occupancy, setOccupancy] = useState<number>(2);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocal(window.location.hostname === 'localhost');
    }

    // Fetch unavailable and booked dates when the component mounts
    const fetchUnavailableDates = async () => {
      try {
        const startDate = new Date().toISOString().slice(0, 10);
        const endDate = '2028-08-24'; // Set end date to 2028-08-24
        const apiUrl = isLocal
          ? `http://localhost:8888/.netlify/functions/fetchPricingData?listingId=${listingId}&startDate=${startDate}&endDate=${endDate}`
          : `/.netlify/functions/fetchPricingData?listingId=${listingId}&startDate=${startDate}&endDate=${endDate}`;

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
  }, [isLocal, listingId]);

  useEffect(() => {
    if (!initialized && unavailableDates.length > 0) {
      // Calculate the next available date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let nextAvailableDate = today;
      while (unavailableDates.some(date => date.getTime() === nextAvailableDate.getTime()) ||
        bookedDates.some(date => date.getTime() === nextAvailableDate.getTime())) {
        nextAvailableDate = addDays(nextAvailableDate, 1);
      }

      setState([
        {
          startDate: null,
          endDate: addDays(nextAvailableDate, 5),
          key: 'selection',
        },
      ]);
      setInitialized(true);
    }
  }, [initialized, unavailableDates, bookedDates]);

  // Combine unavailable and booked dates
  const disabledDates = [...unavailableDates, ...bookedDates];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isSelectedRangeUnavailable = () => {
    if (state.length === 0 || !state[0].startDate || !state[0].endDate) {
      return true;
    }
    const { startDate, endDate } = state[0];
    return isDateRangeUnavailable(startDate, endDate, unavailableDates, bookedDates);
  };

  const isDateRangeUnavailable = (startDate: Date, endDate: Date, unavailable: Date[], booked: Date[]) => {
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      if (unavailable.some(unavailableDate => unavailableDate.getTime() === date.getTime()) ||
        booked.some(bookedDate => bookedDate.getTime() === date.getTime())) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="mt-4">
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <CalendarComponent
        state={state}
        setState={setState}
        disabledDates={disabledDates}
      />

      <div className="flex flex-col justify-center items-center">
        <button
          type="button"
          className="h-full shadow-lg shadow-zinc-100 lp-button m-0 drop-shadow-lg w-5/6 py-1 xs:mx-2 text-lg rounded-lg text-white"
          onClick={openModal}
          disabled={isSelectedRangeUnavailable()}
        >
          Get Pricing Details
        </button>
      </div>
      {state.length > 0 && (
        <BookingFormModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          guests={guests}
          setGuests={setGuests}
          pets={pets}
          setPets={setPets}
          dateRange={state}
          setDateRange={setState}
          listingId={listingId}
          occupancy={occupancy}
          setOccupancy={setOccupancy}
        />
      )}
    </div>
  );
};

export default InstantBooking;