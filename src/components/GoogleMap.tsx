import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

interface Listing {
    _id: string;
    address: {
        lat: number;
        lng: number;
        full: string;
    };
}

interface GoogleMapProps {
    listings: Listing[];
}

const GoogleMap: React.FC<GoogleMapProps> = ({ listings }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.initMap = () => {
            if (mapRef.current && listings.length > 0) {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: listings[0].address.lat, lng: listings[0].address.lng },
                    zoom: 15,
                });

                listings.forEach((listing) => {
                    new window.google.maps.Marker({
                        position: { lat: listing.address.lat, lng: listing.address.lng },
                        map,
                        title: listing.address.full,
                    });
                });
            }
        };

        if (window.google && window.google.maps) {
            window.initMap();
        }
    }, [listings]);

    return <div ref={mapRef} className="w-full h-full" />; // Set full width and height for the map
};

export default GoogleMap;