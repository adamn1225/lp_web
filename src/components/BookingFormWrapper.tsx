import React, { useState } from 'react';
import MockBookingFormModal from './MockBookingFormModal';

const BookingFormWrapper: React.FC<{ listingId: string }> = ({ listingId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [guests, setGuests] = useState(1);
    const [pets, setPets] = useState(0);
    const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date() }]);
    const [occupancy, setOccupancy] = useState(1);
    const [taxes, setTaxes] = useState(0);

    const closeModal = () => setIsModalOpen(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <>
            <button onClick={openModal}>Open Booking Form</button>
            <MockBookingFormModal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                guests={guests}
                setGuests={setGuests}
                pets={pets}
                setPets={setPets}
                dateRange={dateRange}
                setDateRange={setDateRange}
                listingId={listingId}
                occupancy={occupancy}
                setOccupancy={setOccupancy}
                taxes={taxes}
            />
        </>
    );
};

export default BookingFormWrapper;