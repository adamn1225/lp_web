const options: RequestInit = {
  method: 'GET',
  headers: {
    accept: 'application/json; charset=utf-8',
    authorization: import.meta.env.SECRET_ACCESS_TOKEN
  }
};


const x = await fetch('https://open-api.guesty.com/v1/listings?limit=30&skip=0', options)
const data = await x.json();
const testListings = data.results

export default testListings