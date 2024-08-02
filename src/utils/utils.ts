import listings from '../pages/api/gapi';

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
  return {
    title: title === "" ? listings.title : title,
    _id: _id === "" ? listings._id : _id
  };
}