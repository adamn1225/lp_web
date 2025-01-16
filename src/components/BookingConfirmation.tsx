import React from 'react';

interface BookingConfirmationProps {
  dateRange: { startDate: Date; endDate: Date }[];
  confirmationCode: string | null;
  reservationId: string | null;
  handlePrint: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  dateRange,
  confirmationCode,
  reservationId,
  handlePrint,
}) => (
  <div>
    <h2>Booking Complete</h2>
    <p>Check-in: {dateRange[0].startDate.toLocaleDateString()}</p>
    <p>Check-out: {dateRange[0].endDate.toLocaleDateString()}</p>
    <p>Confirmation Code: {confirmationCode}</p>
    <p>Reservation ID: {reservationId}</p>
    <button onClick={handlePrint}>Print Confirmation</button>
  </div>
);

export default BookingConfirmation;
