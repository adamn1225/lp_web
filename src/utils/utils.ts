import { APP } from "../data/config";
import testListings from "../pages/api/localdev";
import fetchListings from '@/pages/api/fetch-listings.ts';

const listings = await fetchListings();



export function currency(amount: number) {
  return (
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount) + " USD"
  );
}

export function processListing(title: string, _id: string) {
  return (
    title === "" ? listings.title : title,
    _id === "" ?  listings._id :  _id
  )

}
