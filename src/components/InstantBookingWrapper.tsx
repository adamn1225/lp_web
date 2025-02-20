import React from 'react';
import { MantineProvider } from '@mantine/core';
import InstantBooking from './InstantBooking';

const InstantBookingWrapper: React.FC<{ listingId: string }> = ({ listingId }) => {
    return (
        <MantineProvider>
            <InstantBooking listingId={listingId} />
        </MantineProvider>
    );
};

export default InstantBookingWrapper;