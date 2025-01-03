import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { loadScript } from '@guestyorg/tokenization-js';
import type { GuestyTokenizationNamespace, GuestyTokenizationRenderOptions } from '@guestyorg/tokenization-js';
import InquireForm from "./InquireForm";
import { CreditCard } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import TextArea from './TextArea';

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
  const [accommodates, setAccommodates] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [beforeTax, setBeforeTax] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [guestyTokenization, setGuestyTokenization] = useState<GuestyTokenizationNamespace | null>(null);
  const [isInquireModalOpen, setIsInquireModalOpen] = useState(false);
  const [paymentDateTime, setPaymentDateTime] = useState<Date | null>(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState<boolean>(false);
  const [managementFeePercentage, setManagementFeePercentage] = useState<number>(0);

  useEffect(() => {
    const fetchAndCalculatePricing = async () => {
      try {
        const { startDate, endDate } = dateRange[0];
        if (!startDate || !endDate) return;

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

        // Set fetched pricing data
        setBasePrice(data.basePrice || 0);
        setWeeklyPriceFactor(data.weeklyPriceFactor || 1);
        setMonthlyPriceFactor(data.monthlyPriceFactor || 1);
        setCleaningFee(data.cleaningFee || 0);
        setPetFee(data.petFee || 0);
        setCityTax(data.cityTax || 0);
        setLocalTax(data.localTax || 0);
        setAccommodates(data.accommodates || 2);
        setManagementFeePercentage(data.managementFeePercentage || 0);

        // Calculate pricing
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        let stayPrice = 0;

        // Determine daily prices or base price
        for (let i = 0; i < daysDiff; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(currentDate.getDate() + i);
          const formattedDate = currentDate.toISOString().slice(0, 10);
          stayPrice += data.datePrices?.[formattedDate] || data.basePrice;
        }

        // Apply discounts for weekly/monthly stays
        if (daysDiff >= 30) {
          stayPrice *= data.monthlyPriceFactor || 1;
        } else if (daysDiff >= 7) {
          stayPrice *= data.weeklyPriceFactor || 1;
        }

        const petPrice = pets > 0 ? data.petFee || 0 : 0;
        const totalPrice = stayPrice + data.cleaningFee + petPrice;
        const managementFee = totalPrice * (data.managementFeePercentage / 100);
        const beforeTax = totalPrice + managementFee;
        const taxes = (data.cityTax + data.localTax) * 0.01;
        const afterTax = beforeTax + (beforeTax * taxes);

        console.log('Calculated afterTax:', afterTax);
        setCalculatedPrice(afterTax);
        setBeforeTax(beforeTax);
      } catch (error) {
        console.error('Error fetching or calculating pricing:', error);
      }
    };

    fetchAndCalculatePricing();
  }, [listingId, dateRange, pets]);
  useEffect(() => {
    const initializeGuestyTokenization = async () => {
      const options: GuestyTokenizationRenderOptions = {
        containerId: 'payment-container',
        providerId: '65667fb19986e2000e99278f', // Replace with your actual valid provider ID
        amount: calculatedPrice || 0, // Ensure calculatedPrice is a valid number
        currency: 'USD', // Replace with the actual currency
        onStatusChange: (isValid) => {
          setIsFormValid(isValid);
          console.log('Form validity changed:', isValid);
        },
        initialValues: {
          firstName,
          lastName,
        },
      };

      console.log('Loading Guesty Tokenization JS SDK...');
      loadScript()
        .then((guestyTokenization) => {
          console.log('Guesty Tokenization JS SDK loaded:', guestyTokenization);

          const container = document.getElementById(options.containerId);
          if (!container) {
            console.error(`Container with id ${options.containerId} not found.`);
            return;
          }

          guestyTokenization.render(options);
          setGuestyTokenization(guestyTokenization);
          console.log('Guesty Tokenization JS SDK initialized with options:', options);
        })
        .catch((error) => {
          if (error.response) {
            console.error('Error response:', error.response);
          } else if (error.request) {
            console.error('Error request:', error.request);
          }
          console.error('Error message:', error.message);
          console.error('Failed to load the Guesty Tokenization JS SDK script', error);
        });
    };

    if (currentStep === 2 && calculatedPrice !== null) {
      initializeGuestyTokenization();
    }
  }, [currentStep, calculatedPrice, firstName, lastName]);

  const handleSubmit = async () => {
    setLoading(true);
    const guestInfo = {
      firstName,
      lastName,
      phone,
      email,
    };

    const reservationDetails = {
      listingId,
      checkInDate: dateRange[0].startDate.toISOString().slice(0, 10),
      checkOutDate: dateRange[0].endDate.toISOString().slice(0, 10),
    };

    console.log('Parsed guest info:', JSON.stringify(guestInfo, null, 2));
    console.log('Parsed reservation details:', JSON.stringify(reservationDetails, null, 2));

    try {
      // Tokenize payment
      if (!guestyTokenization) {
        throw new Error('Guesty Tokenization is not initialized');
      }

      const paymentMethod = await guestyTokenization.submit();
      console.log('Payment Method:', paymentMethod);

      // Log the paymentMethod object to inspect its structure
      console.log('Payment Method Object:', JSON.stringify(paymentMethod, null, 2));

      // Check if paymentMethod contains the necessary properties
      if (!paymentMethod || !paymentMethod._id) {
        throw new Error('Payment method tokenization failed or missing required information');
      }

      // Include providerId directly in the request body
      const providerId = '65667fb19986e2000e99278f'; // Replace with actual provider ID

      const response = await fetch('/.netlify/functions/createReservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guestInfo, paymentMethod: { ...paymentMethod, providerId }, ...reservationDetails })
      });

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText} - ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Success:', data);

      // Store reservation details
      setReservationId(data._id);
      setConfirmationCode(data.confirmationCode);

      // Proceed to next step
      setCurrentStep(3);
    } catch (error) {
      console.error('Error creating guest or tokenizing payment:', error);
      // Handle error (e.g., show an error message to the user)
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("BookingFormModal dateRange:", dateRange);
    if (dateRange[0]?.startDate) {
      setSelectedStartDate(dateRange[0].startDate);
    }
  }, [dateRange]);

  if (!isModalOpen) return null;

  const displayStartDate = dateRange[0]?.startDate ? dateRange[0].startDate.toLocaleDateString() : "N/A";
  const displayEndDate = dateRange[0]?.endDate ? dateRange[0].endDate.toLocaleDateString() : "N/A";

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

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });


  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Booking Form"
      className="xs:max-h-full md:max-h-full bg-white z-50 px-4 py-6 rounded-lg drop-shadow-2xl shadow-lg md:w-4/5 lg:w-5/6 md:mt-18 overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      appElement={document.getElementById('Top')!}
    >
      <div className="relative flex flex-col justify-center items-center max-h-full">
        {currentStep === 1 && (
          <>
            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="flex flex-col justify-center items-center w-full">



              <div className="w-full xs:px-1 md:px-4">
                <div className='flex  flex-col items-center justify-around'>
                  <div className='flex justify-between gap-4 w-full'>
                    <InquireForm listingId={listingId} buttonText='Chat with an agent' />
                    <button
                      type="button"
                      onClick={() => {
                        closeModal();
                        setIsInquireModalOpen(true); // Open new modal
                      }}
                      className="absolute top-0 right-0 md:mt-4 md:mr-4 bg-cyan-600 text-muted-50 px-4 py-2 font-medium"
                    >
                      Close
                    </button>
                  </div>
                  <h2 className="xs:text-center xs:text-md text-slate-800 text-xl mb-4 underline self-center">Fill out the form below and reserve the date</h2>
                </div>
                <div className='flex gap-4 w-full'>
                  <div className="flex-1">
                    <label htmlFor="guests" className="block text-slate-800">Number of Guests
                      <input
                        type="number"
                        id="guests"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="mt-1 w-full border border-slate-500 rounded-md shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                        min="1"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="pets" className="block text-slate-800">Number of Pets:
                      <input
                        type="number"
                        id="pets"
                        value={pets}
                        onChange={(e) => setPets(Number(e.target.value))}
                        className="mt-1 w-full border border-slate-500 rounded-md shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 placeholder-slate-500/60"
                        min="0"
                      />
                    </label>
                  </div>
                </div>
                <div className="mb-1 flex gap-4 w-full">
                  <div className="flex-1">

                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 w-full border border-slate-500 rounded-md shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 placeholder:text-slate-500"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="flex-1">

                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 w-full border border-slate-500 rounded-md shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 placeholder:text-slate-500"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="mb-1 md:flex gap-4 w-full">
                  <div className="flex-1">
                    <label htmlFor="email" className="block text-slate-800">Email
                      <input
                        type="email"
                        id="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="xs:mb-4 mt-1 w-full border border-slate-500 rounded-md shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 placeholder-slate-500/60 placeholder:text-slate-500"

                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="phone" className="block text-slate-800">Phone
                      <PhoneInput
                        id="phone"
                        value={phone}
                        onChange={setPhone}
                        className="mt-1 w-full border border-slate-500 rounded-md shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
                        defaultCountry="US"
                        placeholder="(---) --- ----"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className='xs:w-full flex flex-col items-center gap-0 w-fit'>
                <div className='flex justify-between w-1/3 '>
                  <div className="mt-4 w-full">
                    {pets > 0 && (
                      <div className="flex justify-between pb-2 text-sm">
                        <span>Pet Fee:</span>
                        <span>{formatter.format(petFee)}</span>
                      </div>
                    )}
                    <div className="text-base flex justify-between ">
                      <span>Base Price:</span>
                      <span>{formatter.format(basePrice)} Per Night</span>
                    </div>
                    <div className="text-base flex justify-between ">
                      <span>Cleaning Fee:</span>
                      <span>{formatter.format(cleaningFee)}</span>
                    </div>
                    <div className="text-base flex justify-between ">
                      <span>Management Fee:</span>
                      <span>{formatter.format(beforeTax * (managementFeePercentage / 100))}</span>
                    </div>
                    <div className="text-base flex justify-between ">
                      <span>Total Before Taxes:</span>
                      <span>{formatter.format(beforeTax)}</span>
                    </div>

                    {dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime() >= 7 * 24 * 60 * 60 * 1000 && (
                      <>
                        <div className="text-base flex justify-between ">
                          <span>Weekly Price Factor:</span>
                          <span>{weeklyPriceFactor}</span>
                        </div>
                        <div className="text-base flex justify-between ">
                          <span>Price without Weekly Factor:</span>
                          <span>${formatter.format(calculatedPrice / weeklyPriceFactor)}</span>
                        </div>
                      </>
                    )}
                    <div className="text-lg flex justify-between pt-2 font-bold border-t border-secondary">
                      <span>Total After Taxes:</span>
                      <span className='mb-4'>{formatter.format(calculatedPrice)}</span>
                    </div>
                  </div>
                </div>
                <TextArea />
                <button
                  className="lp-button flex items-center justify-center gap-2 text-lg text-nowrap font-bold drop-shadow-lg text-white rounded-lg py-2 px-4 mt-4"
                  type="submit"
                  disabled={loading}
                >
                  <CreditCard />  Proceed to Payment
                </button>
              </div>
            </form>
          </>
        )}
        {currentStep === 2 && (
          <div className='w-full justify-center items-center max-h-5/6 overflow-y-scroll'>
            <div id="payment-container" className="my-0 pb-2">
              {/* The payment fields will be fetched and inserted here */}
            </div>
            <div className="flex flex-col md:gap-4 md:mt-3">
              <div className='text-justify md:mx-12'>
                {pets > 0 && petFee > 0 && (
                  <div className="flex justify-between">
                    <p><strong>Pet Price:</strong></p>
                    <p>${petFee}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p><strong>Cleaning Fee:</strong></p>
                  <p>${cleaningFee.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p><strong>Taxes:</strong></p>
                  <p>${beforeTax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p><strong>Management Fee:</strong></p>
                  <p>$</p>
                </div>
                <div className='border border-x-0 border-y-1 border-slate-800 my-2'> </div>
                <div className="flex justify-between">
                  <p><strong>Total Price:</strong></p>
                  <p className="text-cyan-950 font-bold">${calculatedPrice !== null ? calculatedPrice.toFixed(2) : '0.00'}</p>
                </div>
              </div>
              <button
                className="lp-button drop-shadow-lg text-white rounded-lg py-2 px-4 mt-4"
                type="button"
                onClick={handleSubmit}
                disabled={loading || !isFormValid}
              >
                Complete Payment
              </button>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div id="printableArea">
            <div className="text-center mb-4 mt-12">
              <img src="/images/lp-temp.svg" alt="Logo" className="mx-auto" style={{ maxWidth: '200px' }} />
            </div>
            <div className='flex flex-col items-center justify-center'>
              <h2 className="text-slate-800 text-3xl mb-4 underline">Booking Complete</h2>
              <p className="text-slate-800 text-xl mb-4 underline">Thank you for your booking!</p>
              <div className="text-slate-800 flex flex-col gap-3 justify-center text-lg mb-4 mt-6">
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
        <Modal
          isOpen={isInquireModalOpen}
          onRequestClose={() => setIsInquireModalOpen(false)}
          contentLabel="Inquire Form"
          className="bg-white z-50 px-4 py-12 rounded-lg drop-shadow-2xl shadow-lg w-2/6 h-6/6 my-12"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          appElement={document.getElementById('Top')!}
        >
          <div className="relative flex flex-col justify-center items-center max-h-full overflow-y-auto">
            <h2 className="text-slate-800 text-2xl mb-4">Have more questions about this listing?</h2>
            <div className='flex justify-normal'>
              <InquireForm listingId={listingId} buttonText='Chat with an agent' />
            </div>
            <button
              onClick={() => setIsInquireModalOpen(false)}
              className="mt-4 bg-gray-700 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </Modal>
  );
}

export default BookingFormModal;