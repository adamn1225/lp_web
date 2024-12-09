import React from 'react';
import { useInView } from 'react-intersection-observer';

interface Listing {
  _id: string;
  title: string;
  pictures: {
    original: string;
  }[];
  publicDescription: {
    summary: string;
  };
  address: {
    city: string;
    state: string;
  };
  prices: {
    basePrice: number;
    currency: string;
  };
  bedrooms: number;
  bathrooms: number;
}

const LazyLoadCard: React.FC<{ property: Listing }> = ({ property }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView && (
        <a href={`/${property._id}`}>
          <article className="xs:mx-2 flex flex-col bg-white shadow-lg shadow-muted-300/30 h-full rounded-xl overflow-hidden relative pb-12"> {/* Add padding to the bottom */}
            <div className="relative w-full h-48"> {/* Set a fixed height for the image container */}
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src={property.pictures[0].original}
                alt={property.title}
              />
              <div className="absolute inset-0 bg-neutral-950/50" />
            </div>
            <div className="p-2 w-full bg-white flex flex-col justify-start flex-grow">
              <h4 className="font-sans text-wrap font-medium text-lg text-slate-900">
                {property.title}
              </h4>
              <p className="text-sm text-muted-400">
                {property.address.city}, {property.address.state}
              </p>
              <hr className="border border-muted-200 dark:border-muted-800 my-2" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end">
              <button className="lp-button mb-1">View Listing</button>
            </div>
          </article>
        </a>
      )}
    </div>
  );
};

export default LazyLoadCard;