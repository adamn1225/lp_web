import React from 'react'
import allListings2 from '../../pages/api/guestyPage2'



export default function ListingSetTwo() {
    
  return (
    
       <>
       {allListings2.map(function(listing) {
        return (
            
            <a href={listing._id}>
            <article className="flex flex-col bg-white shadow-lg shadow-muted-300/30 h-full border border-muted-200">
                <div className="bg-muted-100 dark:bg-muted-800 ">
                <img className="h-full md:h-full w-full object-cover" id="string" src={listing.pictures[0].original} />
              </div>
              <div className="p-5 bg-white flex flex-col justify-evenly h-full">
            <div className="">
              <h4 className="font-sans font-bold text-xl text-muted-900">
                {listing.title} 
              </h4>
              <h3 className="font-sans font-bold text-xl text-muted-900">
               "` ${listing.prices.basePrice}/ Day`"
              </h3>
              <p className="text-sm text-muted-400">
                
                {listing.address.city}, {listing.address.state}
              </p>
            </div>
            <hr className="border-t border-muted-200 dark:border-muted-800 my-5" />
            <div className="h-max grid grid-cols-2 flex flex-row justify-center items-center">
          
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-muted-900 dark:text-white">
        
                  <p className="text-xl font-bold">{listing.beds}</p>
                </div>
       
                <p className="text-md text-muted-400">Bedrooms</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-muted-900 dark:text-white">
                  
                  <p className="text-xl font-bold">{listing.bathrooms}</p>
                </div>
       
                <p className="text-md text-muted-400">Bathroom</p>
              </div>
       
            </div>
          </div>
        </article>
       </a>
       )
    })}
    </>
  );
};