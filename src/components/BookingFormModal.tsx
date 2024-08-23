import { set } from 'date-fns';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface BookingFormModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  guests: number;
  setGuests: (guests: number) => void;
  pets: number;
  setPets: (pets: number) => void;
  price: number | null;
  dateRange: any[];
  setDateRange: (range: any[]) => void;
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isModalOpen,
  closeModal,
  guests,
  setGuests,
  pets,
  setPets,
  price,
  dateRange,
  setDateRange,
}) => {
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [guestPrice, setGuestPrice] = useState<number>(0);
  const [stayPrice, setStayPrice] = useState<number>(0);
  const [petPrice, setPetPrice] = useState<number>(0);

  const nightlyRate = 79;

  useEffect(() => {
    const { startDate, endDate } = dateRange[0];
    if (startDate && endDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const stayPrice = daysDiff * nightlyRate;
      const guestPrice = guests * 20;
      const petPrice = pets * 10;
      const totalPrice = stayPrice + guestPrice + petPrice;
      setGuestPrice(guestPrice);
      setPetPrice(petPrice);
      setCalculatedPrice(totalPrice);
      setStayPrice(stayPrice);
    }
  }, [dateRange, guests, pets]);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Booking Form"
      className="bg-white px-4 rounded-lg drop-shadow-2xl shadow-lg w-80"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative py-8 flex flex-col h-full text-slate-800 font-semibold text-lg">
        <button
          className="absolute right-1 text-slate-500 hover:text-slate-800 text-3xl"
          onClick={closeModal}
        >
          &times;
        </button>
        <form className="flex flex-col justify-center items-center">
          <div>
            <div className="mb-4">
              <label htmlFor="guests" className="block text-slate-800">Number of Guests:</label>
              <input
                type="number"
                id="guests"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="pets" className="block text-slate-800">Number of Pets:</label>
              <input
                type="number"
                id="pets"
                value={pets}
                onChange={(e) => setPets(Number(e.target.value))}
                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                min="0"
              />
            </div>
          </div>
        </form>
        {calculatedPrice !== null && (
          <div className="flex flex-col mx-10 justify-start mt-3">
          <div className='text-justify'>
            <p>Guest Price: ${guestPrice}</p>
            <p>Pet Price: ${petPrice}</p>
            <p>Stay Price: ${stayPrice}</p>
            <div className='border border-x-0 border-y-1 border-slate-800 my-2'> </div>
            <p>Total Price: ${calculatedPrice}</p>
          </div>
        <button
          className="lp-button drop-shadow-lg text-white rounded-lg py-2 px-4 mt-4"
        >
            Book Instantly!
        </button>
      </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingFormModal;