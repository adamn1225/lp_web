import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { loadScript } from '@guestyorg/tokenization-js';
import type { GuestyTokenizationNamespace, GuestyTokenizationRenderOptions } from '@guestyorg/tokenization-js';
import InquireForm from "./InquireForm";
import { CreditCard } from 'lucide-react';
import html2pdf from 'html2pdf.js';

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
  taxes: number;
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
  taxes,
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
  const [accommodates, setAccommodates] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [beforeTax, setBeforeTax] = useState<number>(0);
  const [reservationId, setReservationId] = useState<string>('66fb0b7b9181120100a8066f');
  const [confirmationCode, setConfirmationCode] = useState<string>('nRXxlqj3D');
  const [paymentDateTime, setPaymentDateTime] = useState<Date | null>(null);

  const handlePrint = () => {
    const button = document.querySelector('#printableArea button') as HTMLElement;
    if (button) button.style.display = 'none'; // Hide the button

    const element = document.getElementById('printableArea');
    html2pdf()
      .from(element)
      .save()
      .then(() => {
        if (button) button.style.display = 'block'; // Show the button again
      });
  };

  const simulatePaymentCompletion = () => {
    setCurrentStep(3);
    setReservationId('66fb0b7b9181120100a8066f');
    setConfirmationCode('nRXxlqj3D');
    setDateRange([{ startDate: new Date(), endDate: new Date(new Date().setDate(new Date().getDate() + 7)) }]);
    setPaymentDateTime(new Date()); // Set the current date and time
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Booking Form"
      className="bg-white z-50 px-4 py-12 rounded-lg drop-shadow-2xl shadow-lg md:w-2/6 h-6/6 my-12"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      appElement={document.getElementById('Top')!}
    >
      <div className="relative flex flex-col justify-center items-center max-h-full overflow-y-auto">
        {currentStep === 1 && (
          <>
            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="flex flex-col justify-center items-center">
              {/* Your form fields here */}
              <button
                className="lp-button drop-shadow-lg text-white rounded-lg py-2 px-4 mt-4"
                type="submit"
              >
                Complete Payment
              </button>
            </form>
          </>
        )}
        {currentStep === 3 && (
          <div id="printableArea">
            <div className="text-center mb-4">
              <img src="/images/lp-temp.svg" alt="Logo" className="mx-auto" style={{ maxWidth: '200px' }} />
            </div>
            <div className='flex flex-col items-center justify-center'>
              <h2 className="text-slate-800 text-3xl mb-4 underline">Booking Complete</h2>
              <p className="text-slate-800 text-xl mb-4 underline">Thank you for your booking!</p>
              <div className="text-slate-800 flex flex-col justify-center text-lg mb-4 mt-6">
                <div className='flex gap-6 justify-between '><p><strong>Check-in Date:</strong></p> <span>{dateRange[0].startDate.toLocaleDateString()}</span></div>
                <div className='flex gap-6 justify-between '><p><strong>Check-out Date:</strong></p> <span>{dateRange[0].endDate.toLocaleDateString()} </span></div>
                <div className='flex gap-6 justify-between '><p><strong>Confirmation Code:</strong></p><span> {confirmationCode}</span></div>
                <div className='flex gap-6 justify-between '><span><strong>Reservation Number:</strong></span> <span>{reservationId}</span></div>
                {paymentDateTime && (
                  <div className='flex gap-6 justify-between '><span><strong>Payment Date and Time:</strong></span> <span>{paymentDateTime.toLocaleString()}</span></div>
                )}
              </div>
              <button
                className="bg-slate-500 drop-shadow-lg text-white rounded-lg py-2 px-4 mt-4"
                type="button"
                onClick={handlePrint}
              >
                Print Confirmation
              </button>
            </div>
          </div>
        )}
        <button
          className="lp-button drop-shadow-lg text-white rounded-lg py-2 px-4 mt-4"
          type="button"
          onClick={simulatePaymentCompletion}
        >
          Simulate Payment Completion
        </button>
      </div>
    </Modal>
  );
};

export default BookingFormModal;