const options: RequestInit = {
  method: 'GET',
  headers: {
    accept: 'application/json; charset=utf-8',
    authorization: import.meta.env.SECRET_OPEN_PASSWORD

  }
};


const listings = await fetch('https://open-api.guesty.com/v1/listings?limit=100&skip=0', options)
const data = await listings.json();
const allListings = data.results


export default allListings