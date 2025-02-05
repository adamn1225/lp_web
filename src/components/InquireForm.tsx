import React, { useState } from 'react';
import Modal from 'react-modal';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Headset } from 'lucide-react';
import axios from 'axios';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

interface ReservationFormProps {
  listingId: string;
  buttonText: string;
}

const InquireForm: React.FC<ReservationFormProps> = ({ listingId, buttonText }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    checkIn: '2050-01-01',
    checkOut: '2050-01-06',
    listingId: listingId,
    status: '',
    message: '',
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [messagePlaceholder, setMessagePlaceholder] = useState('Verify your phone number first');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const formatPhoneNumber = (phoneNumber: string) => {
    const parsedNumber = parsePhoneNumberFromString(phoneNumber);
    return parsedNumber ? parsedNumber.format('E.164') : phoneNumber;
  };

  const sendVerificationCode = async () => {
    const formattedPhone = formatPhoneNumber(formData.phone);
    try {
      await axios.post('/.netlify/functions/sendVerificationCode', { phoneNumber: formattedPhone });
      setVerificationSent(true);
      setVerificationMessage('SMS Verification Code Sent!');
    } catch (error) {
      console.error('Error sending verification code:', error);
      alert('Error sending verification code. Please check the phone number and try again.');
    }
  };

  const verifyCode = async () => {
    const formattedPhone = formatPhoneNumber(formData.phone);
    try {
      const response = await axios.post('/.netlify/functions/verifyCode', { phoneNumber: formattedPhone, code: verificationCode });
      if (response.data.status === 'approved') {
        setIsVerified(true);
        setVerificationMessage('Phone number verified successfully!');
        setMessagePlaceholder('Enter your message'); // Update placeholder after verification
      } else {
        alert('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('Error verifying code. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please verify your phone number first.');
      return;
    }

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

      // Send message
      await fetch('/.netlify/functions/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ conversationId: data.reservationData._id, message: formData.message })
      });

      setModalIsOpen(false); // Close the modal on successful submission
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setModalIsOpen(true)}
        className="lp-button shadow-lg shadow-zinc-100 flex gap-2 mb-6 text-white px-4 py-2 rounded-lg drop-shadow-lg"
      >
        <Headset />  {buttonText}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="flex justify-center items-center h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-white xs:mx-2 xs:px-4 px-8 py-4 rounded shadow-lg w-full max-w-md">
          <h2 className="text-start pr-1 pb-2 text-slate-700 font-semibold text-nowrap text-lg">Let your host know who you are and begin the chat</h2>
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
            {!verificationSent && (
              <button
                type="button"
                onClick={sendVerificationCode}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg w-full drop-shadow-lg"
              >
                Send Verification Code
              </button>
            )}
            {verificationMessage && (
              <p className="text-green-600">{verificationMessage}</p>
            )}
            {verificationSent && !isVerified && (
              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code"
                  className="w-full px-4 py-2 border rounded"
                />
                <button
                  type="button"
                  onClick={verifyCode}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-lg w-full drop-shadow-lg"
                >
                  Verify Code
                </button>
              </div>
            )}
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={messagePlaceholder}
              className="w-full px-4 py-2 border rounded"
              disabled={!isVerified}
            />
            {isVerified && (
              <button
                type="submit"
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg w-full drop-shadow-lg"
              >
                Submit
              </button>
            )}
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

export default InquireForm;