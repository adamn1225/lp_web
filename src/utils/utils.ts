import { APP } from "../data/config";
import allListings from "../pages/api/guesty.ts"
import allListings2 from "../pages/api/guestyPage2.ts"
import allListings2 from '../pages/api/guestyPage2';
import allListings from '../pages/api/guesty';
// set page title
export function setTitle(title: string) {
  return title === "" ? APP.name : APP.name + " - " + title;
}

//set page sescription
export function setDescription(desc: string) {
  return desc === "" ? APP.description : desc;
}

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
  const array = [allListings, allListings2]
  return (
    title === "" ? array.title || allListings2.title : title,
    _id === "" ? array._id || allListings2._id :  _id
  )
}
