import React, { useEffect } from 'react';
import { prefetchAvailability } from '../utils/prefetchAvailability';

const PrefetchAvailability = () => {
    useEffect(() => {
        prefetchAvailability();
    }, []);

    return null; // This component does not render anything
};

export default PrefetchAvailability;