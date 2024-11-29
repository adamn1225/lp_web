import React from 'react';
import { useInView } from 'react-intersection-observer';

interface Listing {
  _id: string;
  title: string;
  picture: {
    thumbnail: string;
    caption: string;
  };
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
        <a href={property._id}>
          <article className="flex flex-col bg-white pt-4 w shadow-lg shadow-slate-300/30 h-full border border-slate-500/30 rounded-md mx-auto">
            <div className="result-item">
              <img className="w-full object-cover h-64" src={property.picture.thumbnail} alt={property.picture.caption} />
              <div className="p-4 text-normal flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-900">{property.title}</h3>
                <p className="text-sm font-light">{property.address.city}, {property.address.state}</p>
                <div className="border border-stone-300"> </div>
                <div className="flex min-h-min flex-row justify-start align-bottom"><button className="text-slate-900 font-extrabold mb-4">${property.prices.basePrice} Night</button></div>
              </div>
            </div>
          </article>
        </a>
      )}
    </div>
  );
};

export default LazyLoadCard;