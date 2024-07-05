const options: RequestInit = {
    method: 'GET',
    headers: {
      accept: 'application/json; charset=utf-8',
      authorization: 'Bearer '
    }
  };
  


  const listings = await fetch('https://open-api.guesty.com/v1/listings', options)
  const data = await listings.json();
  const allListings = data.results[0]

export default allListings

