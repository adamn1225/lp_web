const apiToken = import.meta.env.VITE_API_TOKEN;
import listings from '../pages/api/gapi'



export function currency(amount: number) {
  return (
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount) + " USD"
  );
}

export function processListing(title: any, _id: any) {
  return (
    title === "" ? listings.title : title,
    _id === "" ?  listings._id :  _id
  )

}
