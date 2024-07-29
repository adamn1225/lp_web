const options: RequestInit = {
  method: 'GET',
 headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        },
};
  
  
  const listings = await fetch('https://open-api.guesty.com/v1/listings?skip=16', options)
  const data = await listings.json();
  const listings2 = data.results

export default listings2