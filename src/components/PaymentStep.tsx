import React, { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { loadScript } from '@guestyorg/tokenization-js';
import type { GuestyTokenizationNamespace, GuestyTokenizationRenderOptions } from '@guestyorg/tokenization-js';

interface PaymentStepProps {
    calculatedPrice: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    listingId: string;
    dateRange: { startDate: Date; endDate: Date }[];
    setReservationId: (id: string | null) => void;
    setConfirmationCode: (code: string | null) => void;
    setCurrentStep: (step: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
    calculatedPrice,
    firstName,
    lastName,
    email,
    phone,
    listingId,
    dateRange,
    setReservationId,
    setConfirmationCode,
    setCurrentStep,
    setLoading,
    setError,
}) => {
    const [guestyTokenization, setGuestyTokenization] = useState<GuestyTokenizationNamespace | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const initializeGuestyTokenization = async () => {
            const options: GuestyTokenizationRenderOptions = {
                containerId: 'payment-container',
                providerId: '65667fb19986e2000e99278f',
                amount: calculatedPrice || 0,
                currency: 'USD',
                onStatusChange: (isValid) => setIsFormValid(isValid),
                initialValues: { firstName, lastName },
            };

            loadScript()
                .then((guestyTokenization) => {
                    guestyTokenization.render(options);
                    setGuestyTokenization(guestyTokenization);
                })
                .catch((error) => console.error('Failed to load the Guesty Tokenization JS SDK script', error));
        };

        if (calculatedPrice !== null) initializeGuestyTokenization();
    }, [calculatedPrice, firstName, lastName]);

    const handleSubmit = async () => {
        setLoading(true);
        const guestInfo = { firstName, lastName, phone, email };
        const reservationDetails = {
            listingId,
            checkInDate: dateRange[0].startDate.toISOString().slice(0, 10),
            checkOutDate: dateRange[0].endDate.toISOString().slice(0, 10),
        };

        try {
            if (!guestyTokenization) throw new Error('Guesty Tokenization is not initialized');
            const paymentMethod = await guestyTokenization.submit();
            if (!paymentMethod || !paymentMethod._id) throw new Error('Payment method tokenization failed or missing required information');

            const providerId = '65667fb19986e2000e99278f';
            const response = await fetch('/.netlify/functions/createReservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestInfo, paymentMethod: { ...paymentMethod, providerId }, ...reservationDetails }),
            });

            if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText} - ${await response.text()}`);
            const data = await response.json();
            setReservationId(data._id);
            setConfirmationCode(data.confirmationCode);
            setCurrentStep(3);
        } catch (error) {
            console.error('Error creating guest or tokenizing payment:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-step-container">

            <div id="payment-container"></div>
            <button onClick={handleSubmit} disabled={!isFormValid}>Complete Payment</button>
        </div>
    );
};

export default PaymentStep;