import React, { useState, useEffect } from "react";
import { addDays } from "date-fns";
import CalendarComponent from "./CalendarComponent";
import BookingFormModal from "./BookingFormModal";

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
  const [initialized, setInitialized] = useState<boolean>(false);
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [guests, setGuests] = useState<number>(1);
  const [pets, setPets] = useState<number>(0);
  const [occupancy, setOccupancy] = useState<number>(2);

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
    if (!initialized) {
      setState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: 'selection'
        }
      ]);
      setInitialized(true);
    }
  }, [initialized]);

  // Combine unavailable and booked dates
  const disabledDates = [...unavailableDates, ...bookedDates];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
          className="h-full shadow-lg shadow-secondary/40 lp-button m-0 drop-shadow-lg w-5/6 py-1 xs:mx-2 text-lg rounded-lg text-white"
          onClick={openModal}
        >
          Get Pricing Details
        </button>
      </div>
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
    </div>
  );
};

export default InstantBooking;