import { set } from "date-fns";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";

interface BookingFormModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  guests: number;
  setGuests: (guests: number) => void;
  pets: number;
  setPets: (pets: number) => void;
  dateRange: { startDate: Date; endDate: Date }[];
  setDateRange: (dateRange: { startDate: Date; endDate: Date }[]) => void;
  listingId: string;
  occupancy: number;
  setOccupancy: (maxOccupancy: number) => void;
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isModalOpen,
  closeModal,
  guests,
  setGuests,
  pets,
  setPets,
  dateRange,
  setDateRange,
  listingId,
  occupancy,
  setOccupancy,
}) => {
  const [basePrice, setBasePrice] = useState<number>(0);
  const [weeklyPriceFactor, setWeeklyPriceFactor] = useState<number>(1);
  const [monthlyPriceFactor, setMonthlyPriceFactor] = useState<number>(1);
  const [cleaningFee, setCleaningFee] = useState<number>(0);
  const [petFee, setPetFee] = useState<number>(0);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [cityTax, setCityTax] = useState<number>(0);
  const [localTax, setLocalTax] = useState<number>(0);
  const [accommodates, setAccommodates ] = useState<number>(0);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const { startDate, endDate } = dateRange[0];
        const formattedStartDate = startDate.toISOString().slice(0, 10);
        const formattedEndDate = endDate.toISOString().slice(0, 10);

        console.log('Fetching pricing data...');
        const response = await fetch(`/.netlify/functions/fetchPricingData?listingId=${listingId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        console.log('API response:', response);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched pricing data:', data);

        setBasePrice(data.basePrice || 0);
        setWeeklyPriceFactor(data.weeklyPriceFactor || 1);
        setMonthlyPriceFactor(data.monthlyPriceFactor || 1);
        setCleaningFee(data.cleaningFee || 0);
        setPetFee(data.petFee || 0);
        setCityTax(data.cityTax || 0);
        setLocalTax(data.localTax || 0);
        setAccommodates(data.accommodates || 2);

        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        let stayPrice = 0;

        for (let i = 0; i < daysDiff; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(currentDate.getDate() + i);
          const formattedDate = currentDate.toISOString().slice(0, 10);
          stayPrice += data.datePrices[formattedDate] || data.basePrice;
        }

        const guestPrice = 0;
        const petPrice = pets > 0 ? petFee : 0;
        const totalPrice = stayPrice + cleaningFee + petPrice;
        const taxes = (cityTax + localTax) * 0.01;
        const afterTax = totalPrice + (totalPrice * taxes);
        console.log('Calculated afterTax:', afterTax);
        setCalculatedPrice(afterTax);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
      }
    };

    fetchPricingData();
  }, [listingId, dateRange, pets, petFee, cityTax, localTax, accommodates]);

  useEffect(() => {
    const { startDate, endDate } = dateRange[0];
    if (startDate && endDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      let stayPrice = daysDiff * basePrice;

      if (daysDiff >= 30) {
        stayPrice *= monthlyPriceFactor;
      } else if (daysDiff >= 7) {
        stayPrice *= weeklyPriceFactor;
      }

      const guestPrice = 0;
      const petPrice = pets > 0 ? petFee : 0;
      const totalPrice = stayPrice + cleaningFee + petPrice;
      const taxes = (cityTax + localTax) * 0.01;
      const afterTax = totalPrice + (totalPrice * taxes);
      console.log('Calculated afterTax in second useEffect:', afterTax);
      setCalculatedPrice(afterTax);
    }
  }, [dateRange, basePrice, weeklyPriceFactor, monthlyPriceFactor, cleaningFee, petFee, pets, cityTax, localTax]);

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= accommodates) {
      setGuests(value);
    } else {
      alert(`The maximum number of guests allowed is ${accommodates}.`);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Booking Form"
      className="bg-white px-4 rounded-lg drop-shadow-2xl shadow-lg w-96"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
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
              <label htmlFor="guests" className="block text-slate-800">Number of Guests</label>
              <input
                type="number"
                id="guests"
                value={guests}
                onChange={handleGuestsChange}
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
          <div className="flex flex-col mx-10 justify-between mt-3">
            <div className='text-justify'>
              {pets > 0 && petFee > 0 && (
                <div className="flex justify-between">
                  <p><strong>Pet Price:</strong></p>
                  <p>${petFee}</p>
                </div>
              )}
              
              {/* <div className="flex justify-between">
                <p><strong></strong></p>
                <p>${basePrice ? (basePrice * Math.ceil((dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / (1000 * 3600 * 24))).toFixed(2) : '0.00'} ({basePrice} * {Math.ceil((dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / (1000 * 3600 * 24))})</p>
              </div> */}
              {Math.ceil((dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / (1000 * 3600 * 24)) >= 7 && (
                <div className="flex justify-between">
                  {/* <p><strong>Weekly Price Factor:</strong></p>
                  <p>{weeklyPriceFactor}</p> */}
                </div>
              )}
              {Math.ceil((dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / (1000 * 3600 * 24)) >= 30 && (
                <div className="flex justify-between">
                  {/* <p><strong>Monthly Price Factor:</strong></p>
                  <p>{monthlyPriceFactor}</p> */}
                </div>
              )}
              <div className="flex justify-between">
                <p><strong>Cleaning Fee:</strong></p>
                <p>${cleaningFee.toFixed(2)}</p>
              </div>
              <div className='border border-x-0 border-y-1 border-slate-800 my-2'> </div>
              <div className="flex justify-between">
                <p><strong>Total Price:</strong></p>
                <p className="text-cyan-950 font-bold">${calculatedPrice !== null ? calculatedPrice.toFixed(2) : '0.00'}</p>
              </div>
              
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
}
export default BookingFormModal;