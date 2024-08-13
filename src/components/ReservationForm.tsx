import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import ErrorBoundary from './ui/ErrorBoundary';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface ReservationFormProps {
  listingId: string;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ listingId }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    checkIn: '2050-01-01',
    checkOut: '2050-01-06',
    listingId: listingId,
    status: ''
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const hcaptchaRef = useRef<HCaptcha>(null);
  const [isClient, setIsClient] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null); // Declare captchaToken in state

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

    if (!captchaToken) {
      alert('Please complete the hCaptcha');
      return;
    }

    const formattedData = {
      ...formData,
      status: 'inquiry',
      captchaToken: captchaToken, // Include the hCaptcha token
    };

    try {
      const response = await fetch('/.netlify/functions/createGuest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();
      console.log('Response from Netlify function:', data);
      setModalIsOpen(false); // Close the modal on successful submission
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleButtonClick = () => {
    console.log('Button clicked');
    setModalIsOpen(true);
  };

  return (
    <ErrorBoundary>
      <div className="flex justify-center items-center">
        <button 
          onClick={handleButtonClick} 
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg drop-shadow-lg"
        >
          Inquire about this listing
        </button>
        <Modal 
          isOpen={modalIsOpen} 
          onRequestClose={() => setModalIsOpen(false)}
          className="flex justify-center items-center h-screen"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white px-8 py-4 rounded shadow-lg w-full max-w-md">
            <h2 className="text-center px-4 pb-2 text-slate-700 font-semibold text-lg">Let us know about who you are and when you're planning stay and your host will respond instantly!</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='flex justify-center gap-1 w-full mt-3'>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  placeholder="First Name" 
                  className="px-2 py-2 border rounded w-2/3"
                />
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder="Last Name" 
                  className="px-2 py-2 border rounded w-2/3"
                />
              </div>
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                defaultCountry="US"
                placeholder="(---) --- ----"
                className='mx-3 flex justify-center items-center'
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
              {/* hCaptcha */}
              {isClient && (
                <HCaptcha
                  ref={hcaptchaRef}
                  sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                  onVerify={setCaptchaToken}
                />
              )}
              <button
                type="submit"
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg w-full drop-shadow-lg"
              >
                Submit
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default ReservationForm;