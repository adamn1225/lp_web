export const prefetchAvailability = () => {
    setTimeout(async () => {
        try {
            const response = await fetch('/.netlify/functions/availability?checkIn=2025-01-01&checkOut=2025-01-10&minOccupancy=1');
            if (!response.ok) {
                throw new Error(`Failed to prefetch availability data`);
            }
            const data = await response.json();
            console.log('Prefetched Availability Data:', data); // Debugging log
        } catch (error) {
            console.error('Error prefetching availability data:', error);
        }
    }, 5000); // Delay the fetch by 5 seconds
};