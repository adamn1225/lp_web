const options: RequestInit = {
  method: 'GET',
 headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${process.env.REFRESH_TOKEN}`,
        },
};


const listings = await fetch('https://open-api.guesty.com/v1/listings?limit=100&skip=0', options)
const data = await listings.json();
const allListings = data.results


export default allListings