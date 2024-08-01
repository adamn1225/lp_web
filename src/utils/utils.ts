const apiToken = import.meta.env.VITE_API_TOKEN;
const response = await fetch('https://open-api.guesty.com/v1/listings?limit=100', {
  headers: {
    'Authorization': `Bearer ${apiToken}`
  }
});
const data = await response.json();
const listings = data.results



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
