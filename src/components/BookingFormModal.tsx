import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import BookingForm from './BookingForm';
import PaymentStep from './PaymentStep';
import BookingConfirmation from './BookingConfirmation';
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
    const [cityTax, setCityTax] = useState<number>(0);
    const [localTax, setLocalTax] = useState<number>(0);
    const [beforeTax, setBeforeTax] = useState<number>(0);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [reservationId, setReservationId] = useState<string | null>(null);
    const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [managementFeePercentage, setManagementFeePercentage] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [amenities, setAmenities] = useState<string[]>([]);

    useEffect(() => {
        const fetchAndCalculatePricing = async () => {
            try {
                const { startDate, endDate } = dateRange[0];
                if (!startDate || !endDate) return;

                const formattedStartDate = startDate.toISOString().slice(0, 10);
                const formattedEndDate = endDate.toISOString().slice(0, 10);

                const response = await fetch(`/.netlify/functions/fetchPricingData?listingId=${listingId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
                if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

                const data = await response.json();
                setBasePrice(data.basePrice || 0);
                setWeeklyPriceFactor(data.weeklyPriceFactor || 1);
                setMonthlyPriceFactor(data.monthlyPriceFactor || 1);
                setCleaningFee(data.cleaningFee || 0);
                setPetFee(data.petFee || 0);
                setCityTax(data.cityTax || 0);
                setLocalTax(data.localTax || 0);
                setAmenities(data.amenities || []);
                setManagementFeePercentage(data.managementFeePercentage || 5);

                const timeDiff = endDate.getTime() - startDate.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                let stayPrice = 0;

                for (let i = 0; i < daysDiff; i++) {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(currentDate.getDate() + i);
                    const formattedDate = currentDate.toISOString().split('T')[0];
                    stayPrice += data.datePrices?.[formattedDate] || data.basePrice;
                }

                // Apply the weekly or monthly factor to the total stay price
                if (daysDiff >= 28) stayPrice *= data.monthlyPriceFactor || 1;
                else if (daysDiff >= 6) stayPrice *= data.weeklyPriceFactor || 1;

                const petPrice = pets > 0 && amenities.some(amenity => amenity.toLowerCase().includes('pets')) ? data.petFee * pets : 0;
                const totalPrice = stayPrice + data.cleaningFee + petPrice;
                const managementFee = totalPrice * (data.managementFeePercentage / 100);
                const beforeTax = totalPrice + managementFee;
                const taxes = (data.cityTax + data.localTax) * 0.01;
                const afterTax = beforeTax + (beforeTax * taxes);

                setCalculatedPrice(afterTax);
                setBeforeTax(beforeTax);
            } catch (error) {
                console.error('Error fetching or calculating pricing:', error);
            }
        };

        fetchAndCalculatePricing();
    }, [listingId, dateRange, pets]);

    const handlePrint = () => {
        const button = document.querySelector('#printableArea button') as HTMLElement;
        if (button) button.style.display = 'none';

        const element = document.getElementById('printableArea');
        html2pdf()
            .from(element)
            .save()
            .then(() => {
                if (button) button.style.display = 'block';
            });
    };

    if (!isModalOpen) return null;

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Booking Form"
            className="xs:max-h-full md:max-h-[96vh] bg-white z-50 px-4 py-6 rounded-lg drop-shadow-2xl shadow-lg md:w-4/5 md:mt-18 overflow-y-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            appElement={document.getElementById('Top')!}
        >
            <div className="relative flex flex-col justify-center items-center max-h-full">
                {currentStep === 1 && (
                    <BookingForm
                        guests={guests}
                        setGuests={setGuests}
                        pets={pets}
                        setPets={setPets}
                        firstName={firstName}
                        setFirstName={setFirstName}
                        lastName={lastName}
                        setLastName={setLastName}
                        email={email}
                        setEmail={setEmail}
                        phone={phone}
                        setPhone={setPhone}
                        petFee={petFee}
                        basePrice={basePrice}
                        cleaningFee={cleaningFee}
                        managementFeePercentage={managementFeePercentage}
                        beforeTax={beforeTax}
                        formatter={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })}
                        onSubmit={() => setCurrentStep(2)}
                        loading={loading}
                        closeModal={closeModal}
                        setIsInquireModalOpen={() => { }}
                        listingId={listingId}
                        dateRange={dateRange}
                        weeklyPriceFactor={weeklyPriceFactor}
                        calculatedPrice={calculatedPrice || 0}
                        amenities={amenities}
                    />
                )}
                {currentStep === 2 && (
                    <>
                        <h2 className='text-3xl font-semibold mt-2 text-center text-secondary underline'>Checkout</h2>
                        <PaymentStep
                            calculatedPrice={calculatedPrice || 0}
                            firstName={firstName}
                            lastName={lastName}
                            email={email}
                            phone={phone}
                            listingId={listingId}
                            dateRange={dateRange}
                            setReservationId={setReservationId}
                            setConfirmationCode={setConfirmationCode}
                            setCurrentStep={setCurrentStep}
                            setLoading={setLoading}
                            setError={setError}
                        />
                    </>

                )}
                {currentStep === 3 && (
                    <BookingConfirmation
                        dateRange={dateRange}
                        confirmationCode={confirmationCode}
                        reservationId={reservationId}
                        handlePrint={handlePrint}
                    />
                )}
            </div>
        </Modal>
    );
};

export default BookingFormModal;