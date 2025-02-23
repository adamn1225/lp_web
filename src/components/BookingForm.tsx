import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import TextArea from './TextArea';
import { CreditCard } from 'lucide-react';

const BookingForm = ({
    guests,
    setGuests,
    pets,
    setPets,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    petFee,
    basePrice,
    cleaningFee,
    managementFeePercentage,
    beforeTax,
    formatter,
    onSubmit,
    loading,
    closeModal,
    setIsInquireModalOpen,
    listingId,
    dateRange,
    weeklyPriceFactor,
    calculatedPrice,
    amenities,
}) => {
    const totalPetFee = pets * petFee;
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (e: any) => {
        setIsChecked(e.target.checked);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Comment out or remove the Netlify function call for testing purposes
        /*
        try {
            const response = await fetch('/.netlify/functions/generatedPdfAndEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone,
                    guests,
                    pets,
                    dateRange,
                    totalAccommodationFare: formatter.format(basePrice * daysDiff),
                    cleaningFee: formatter.format(cleaningFee),
                    managementFee: formatter.format(beforeTax * (managementFeePercentage / 100)),
                    totalBeforeTax: formatter.format(beforeTax),
                    totalAfterTax: formatter.format(calculatedPrice),
                    termsAccepted: isChecked,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Email sent successfully!');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error sending email. Please try again later.');
        }
        */
        // alert('Form submitted successfully!');
        onSubmit(); // Call the onSubmit function to move to the next step
    };

    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalAccommodationFare = basePrice * daysDiff;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full">
            <div className="w-full xs:px-1 md:px-4">
                <div className='flex  flex-col items-center justify-around'>
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
                    {amenities.some((amenity: string) => amenity.toLowerCase().includes('pets')) && (
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
                    )}
                </div>
                <div className="my-1 flex gap-4 w-full">
                    <div className="flex-1">
                        <label htmlFor='firstName' className="block text-slate-800">First Name
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-1 w-full border border-slate-500 rounded-md shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 placeholder:text-slate-500"
                                placeholder="First Name"
                            />
                        </label>
                    </div>
                    <div className="flex-1">
                        <label htmlFor='lastName' className="block text-slate-800">Last Name
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-1 w-full border border-slate-500 rounded-md shadow-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 placeholder:text-slate-500"
                                placeholder="Last name"
                            /></label>
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
            <div className='xs:w-full flex flex-col items-center gap-0 w-full'>
                <div className='flex justify-between gap-4 w-full'>
                    <div className="mt-4 w-full">
                        <div className="text-base flex justify-around mb-6">
                            <span><strong>Check-in: </strong>{dateRange[0].startDate.toLocaleDateString()}</span>
                            <span><strong>Check-out: </strong>{dateRange[0].endDate.toLocaleDateString()}</span>
                        </div>
                        {pets > 0 && (
                            <div className="flex justify-between pb-2 text-sm">
                                <span>Pet Fee:</span>
                                <span>{formatter.format(totalPetFee)}</span> {/* Display the total pet fee */}
                            </div>
                        )}
                        <div className="text-base flex justify-between ">
                            <span>Accommodation Fare:</span>
                            <span>{formatter.format(totalAccommodationFare)}</span>
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
                            <span>Taxes</span>
                            <span>{formatter.format(calculatedPrice - beforeTax)}</span>
                        </div>
                        <div className="text-base flex justify-between ">
                            <span>Total Before Taxes:</span>
                            <span>{formatter.format(beforeTax)}</span>
                        </div>
                        <div className="text-lg flex justify-between pt-2 font-bold border-t border-secondary">
                            <span>Total After Taxes:</span>
                            <span className='mb-4'>{formatter.format(calculatedPrice)}</span>
                        </div>
                    </div>
                </div>
                <TextArea
                    isChecked={isChecked}
                    handleCheckboxChange={handleCheckboxChange}
                    error={!isChecked ? "Please accept the terms and conditions before proceeding" : ""}
                />
                <button
                    className="lp-button flex items-center justify-center gap-2 text-lg text-nowrap font-bold drop-shadow-lg text-white rounded-lg py-2 px-4 mt-2"
                    type="submit"
                    disabled={loading}
                >
                    <CreditCard />  Proceed to Payment
                </button>
            </div>
        </form>
    );
};

export default BookingForm;