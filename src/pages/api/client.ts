onst options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${accessToken}`,
    },
  };

  const response = await fetch('https://open-api.guesty.com/v1/listings?limit=25', options);
  const data = await response.json()
  localList = data.results

  export default localList