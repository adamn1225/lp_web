import React, { useRef, useEffect } from 'react';
import GoogleMap from './GoogleMap';

interface SearchResultsProps {
  available: any[];
  filteredListings: any[];
  dateRange: { startDate: Date; endDate: Date; key: string; }[];
  getGridColsClass: () => string;
  currentListings: any[];
  listingRefs: React.MutableRefObject<{ [key: string]: HTMLAnchorElement | null }>;
  lastListingElementRef: React.MutableRefObject<HTMLAnchorElement | null>;
  handleMarkerClick: (id: string) => void;
  loadMoreListings: () => void;
  resultsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  available,
  filteredListings,
  dateRange,
  getGridColsClass,
  currentListings,
  listingRefs,
  lastListingElementRef,
  handleMarkerClick,
  loadMoreListings,
  resultsContainerRef,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreListings();
      }
    });

    if (lastListingElementRef.current) {
      observerRef.current.observe(lastListingElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreListings]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-0 w-screen h-screen">
      <div ref={resultsContainerRef} className="h-full overflow-y-auto flex flex-col w-full md:w-2/3 max-h-[100vh]">
        <div className="text-center py-4">
          <h2 className="text-xl font-semibold">Available Listings</h2>
          <p className="text-sm text-muted-400">
            {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
          </p>
        </div>
        <div className={`search-results h-full w-full overflow-y-auto grid grid-cols-1 md:${getGridColsClass()} gap-x-6 gap-y-3 self-center px-2`}>
          {currentListings.length > 0 ? (
            currentListings.map((property, index) => {
              const price = property.prices.length > 0 ? property.prices[0].price : property.basePrice; // Get the first date-specific price or fallback to basePrice
              return (
                <a href={property._id} key={property._id} ref={(el) => { listingRefs.current[property._id] = el; if (index === currentListings.length - 1) lastListingElementRef.current = el; }}>
                  <article className="xs:mx-2 flex flex-col bg-white shadow-lg shadow-muted-300/30 w-full h-full mb-4 rounded-xl relative">
                    <div className="relative w-full h-64">
                      <img
                        className="absolute inset-0 w-full h-full object-cover"
                        src={property.pictures[0].original}
                        alt={property.picture.caption}
                      />
                      <div className="absolute inset-0 bg-neutral-950/50" />
                    </div>
                    <div className="p-2 w-full bg-white flex flex-col justify-start flex-grow">
                      <h4 className="font-sans text-wrap font-medium text-xl text-slate-900">
                        {property.title}
                      </h4>
                      <p className="text-sm text-muted-400">
                        {property.address.city}, {property.address.state}
                      </p>
                      <span className="hidden">{property.bedrooms}</span>
                      <hr className="border border-muted-200 dark:border-muted-800 my-2" />
                      <div className="flex items-end h-full">
                        <p className="font-semibold text-base text-nowrap">Starting at ${price} Per Night</p>
                      </div>
                    </div>
                  </article>
                </a>
              );
            })
          ) : (
            <p className="pt-12 text-center">No results - try adjusting the filters or click on Reset Filters</p>
          )}
        </div>
      </div>
      <div className="w-full md:h-full md:pb-20 md:pr-4">
        <GoogleMap listings={filteredListings} onMarkerClick={handleMarkerClick} selectedCity={"North Myrtle Beach"} />
      </div>
    </div>
  );
};

export default SearchResults;