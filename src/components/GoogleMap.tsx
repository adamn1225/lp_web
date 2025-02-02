import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

interface Listing {
    _id: string;
    title: string;
    picture: {
        thumbnail: string;
        caption: string;
    };
    address: {
        lat: number;
        lng: number;
        full: string;
        street: string;
        city: string;
        state: string;
        zipcode: string;
    };
    prices: {
        basePrice: number;
    };
}

interface GoogleMapProps {
    listings: Listing[];
    onMarkerClick: (id: string) => void;
    selectedCity: string;
}

const cityCoordinates: { [key: string]: { lat: number, lng: number } } = {
    "North Myrtle Beach": { lat: 33.8160, lng: -78.6800 },
    "Little River": { lat: 33.8732, lng: -78.6142 },
    "Myrtle Beach": { lat: 33.6891, lng: -78.8867 },
    "Surfside Beach": { lat: 33.6064, lng: -78.9730 },
    "Murrells Inlet": { lat: 33.5519, lng: -79.0417 },
};

const GoogleMap: React.FC<GoogleMapProps> = ({ listings, onMarkerClick, selectedCity }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markers = useRef<any[]>([]);

    useEffect(() => {
        window.initMap = () => {
            if (mapRef.current) {
                const cityCoords = cityCoordinates[selectedCity] || { lat: 33.8160, lng: -78.6800 }; // Default to Myrtle Beach
                mapInstance.current = new window.google.maps.Map(mapRef.current, {
                    center: cityCoords,
                    zoom: 12,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: window.google.maps.ControlPosition.TOP_RIGHT,
                        mapTypeIds: [
                            window.google.maps.MapTypeId.ROADMAP,
                            window.google.maps.MapTypeId.SATELLITE,
                            window.google.maps.MapTypeId.HYBRID,
                            window.google.maps.MapTypeId.TERRAIN
                        ]
                    }
                });
            }
        };

        if (window.google && window.google.maps) {
            window.initMap();
        }
    }, [selectedCity]);

    useEffect(() => {
        if (mapInstance.current) {
            // Clear existing markers
            markers.current.forEach(marker => marker.setMap(null));
            markers.current = [];

            // Add new markers
            listings.forEach((listing) => {
                const marker = new window.google.maps.Marker({
                    position: { lat: listing.address.lat, lng: listing.address.lng },
                    map: mapInstance.current,
                    title: listing.address.full,
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                        <div class="custom-info-window text-secondary flex flex-col justify-center gap-2">
                            <h3 class="font-semibold text-base">${listing.title}</h3>
                            <p class="font-medium text-sm">${listing.address.street} <br /> ${listing.address.city}, ${listing.address.state} ${listing.address.zipcode}</p>
                            <p class="text-xs"><strong class="font-semibold">Starting at:</strong> <span class="font-normal">$${listing.prices.basePrice} Night</p></span>
                            <img src="${listing.picture.thumbnail}" alt="${listing.picture.caption}" style="width:100px;height:auto;"/>
                            <a href="#${listing._id}" class="info-window-link">
                                <button class="info-window-button font-bold text-base">View Listing</button>
                            </a>
                        </div>
                    `,
                });

                marker.addListener('click', () => {
                    infoWindow.open(mapInstance.current, marker);
                    onMarkerClick(listing._id);
                });

                markers.current.push(marker);
            });
        }
    }, [listings, onMarkerClick]);

    return <div ref={mapRef} className="h-full w-full" />;
};

export default GoogleMap;