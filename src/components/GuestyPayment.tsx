import React, { useEffect } from 'react';
import { loadScript } from '@guestyorg/tokenization-js';
import type { GuestyTokenizationNamespace, GuestyTokenizationRenderOptions } from '@guestyorg/tokenization-js';

const GuestyPayment: React.FC = () => {
  useEffect(() => {
    const initializeGuestyTokenization = () => {
      const options: GuestyTokenizationRenderOptions = {
        containerId: 'payment-container',
        providerId: '65667fb19986e2000e99278f', // Replace with your actual valid provider ID
        amount: 100, // Replace with the actual amount
        currency: 'USD', // Replace with the actual currency
        onStatusChange: (isValid: boolean) => {
          console.log('Form validity changed:', isValid);
        }
      };

      console.log('Loading Guesty Tokenization JS SDK...');
      loadScript()
        .then((guestyTokenization: GuestyTokenizationNamespace) => {
          console.log('Guesty Tokenization JS SDK loaded:', guestyTokenization);

          const container = document.getElementById(options.containerId);
          if (!container) {
            console.error(`Container with id ${options.containerId} not found.`);
            return;
          }

          guestyTokenization.render(options);
          console.log('Guesty Tokenization JS SDK initialized with options:', options);
        })
        .catch((error) => {
          if (error.response) {
            console.error('Error response:', error.response);
          } else if (error.request) {
            console.error('Error request:', error.request);
          } else {
            console.error('Error message:', error.message);
          }
          console.error('Failed to load the Guesty Tokenization JS SDK script', error);
        });
    };

    initializeGuestyTokenization();
  }, []);

  return <div className='px-44' id="payment-container"></div>;
};

export default GuestyPayment;