export const prefetchAvailability = () => {
    // Check if the data has already been prefetched
    if (localStorage.getItem('availabilityPrefetched')) {
        console.log('Availability data already prefetched');
        return;
    }

    setTimeout(async () => {
        try {
            const response = await fetch('/.netlify/functions/availability?checkIn=2025-01-01&checkOut=2025-01-10&minOccupancy=1');
            if (!response.ok) {
                throw new Error(`Failed to prefetch availability data`);
            }
            const data = await response.json();
            console.log('Prefetched Availability Data:', data); // Debugging log

            // Only store essential information in local storage
            const essentialData = {
                checkIn: '2025-01-01',
                checkOut: '2025-01-10',
                minOccupancy: 1,
                listings: data.results.map(listing => ({
                    id: listing._id,
                    title: listing.title,
                    price: listing.prices.basePrice
                }))
            };

            // Set the flag in local storage to indicate that the data has been prefetched
            localStorage.setItem('availabilityPrefetched', 'true');
            localStorage.setItem('prefetchedAvailabilityData', JSON.stringify(essentialData));
        } catch (error) {
            console.error('Error prefetching availability data:', error);
        }
    }, 5000); // Delay the fetch by 5 seconds
};