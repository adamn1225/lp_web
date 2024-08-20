import React, { useState } from 'react';
import Modal from 'react-modal';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';  // Import the custom PhoneInput component

interface ReservationFormProps {
  listingId: string;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ listingId }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '', // Assuming you need an email field
    checkIn: '2050-01-01',
    checkOut: '2050-01-06',
    listingId: listingId,
    status: ''
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData({
      ...formData,
      phone: value || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      status: 'inquiry'
    };

    try {
      const response = await fetch('/.netlify/functions/createGuest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();
      console.log('Response from Netlify function:', data);
      setModalIsOpen(false); // Close the modal on successful submission
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleButtonClick = () => {
    setFormData(prevState => ({
      ...prevState,
      status: 'inquiry'
    }));
  };

  return (
    <div className="flex justify-center items-center">
      <button 
        onClick={() => setModalIsOpen(true)} 
        className="bg-cyan-600 mb-6 text-white px-4 py-2 rounded-lg drop-shadow-lg"
      >
        Inquire about this listing
      </button>
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)}
        className="flex justify-center items-center h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-white xs:mx-2 xs:px-4 px-8 py-4 rounded shadow-lg w-full max-w-md">
          <h2 className="text-center px-4 pb-2 text-slate-700 font-semibold text-lg">Let us know about who you are and when you're planning stay and your host will respond instantly!</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-1">
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                placeholder="First Name" 
                className="w-full px-4 py-2 border rounded"
              />
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                placeholder="Last Name" 
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <PhoneInput
              value={formData.phone}
              onChange={handlePhoneChange}
              defaultCountry="US"
              placeholder="(---) --- ----"
            />
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="hidden w-full px-4 py-2 border rounded"
            />
            <input 
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              placeholder="Check-In Date"
              className="hidden w-full px-4 py-2 border rounded"
            />
            <input 
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              placeholder="Check-Out Date"
              className="hidden w-full px-4 py-2 border rounded"
            />
            <input 
              type="text" 
              name="listingId" 
              value={formData.listingId} 
              onChange={handleChange} 
              placeholder="Listing ID" 
              className="hidden w-full px-4 py-2 border rounded"
            />
            <h2 className="text-center px-4 pb-2 text-slate-700 font-semibold text-lg">Get a Verification Code</h2>
            <button 
              type="submit" 
              onClick={handleButtonClick} 
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg w-full drop-shadow-lg"
            >
              Submit
            </button>
          </form>
          <button 
            onClick={() => setModalIsOpen(false)} 
            className="mt-4 bg-gray-700 text-white px-4 py-2 rounded w-full"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ReservationForm;