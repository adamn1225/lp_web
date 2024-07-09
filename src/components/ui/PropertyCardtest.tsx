import { useEffect, useState } from "react";

const options: RequestInit = {
    method: 'GET',
    headers: {
      accept: 'application/json; charset=utf-8',
      authorization: 'Bearer eyJraWQiOiI1OVBtSUFVdG91YjNQS1RWaE1VRF9JZ0E1WUd6QUN4djhPMlkteTdnS1JjIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnBvLWZCYTdkOEYzRVR3YUc1TkNVZjRDRk95WkR5elN0ZkUtQ0R5cnpQZE0iLCJpc3MiOiJodHRwczovL2xvZ2luLmd1ZXN0eS5jb20vb2F1dGgyL2F1czFwOHFyaDUzQ2NRVEk5NWQ3IiwiYXVkIjoiaHR0cHM6Ly9vcGVuLWFwaS5ndWVzdHkuY29tIiwiaWF0IjoxNzIwMTE1NDAwLCJleHAiOjE3MjAyMDE4MDAsImNpZCI6IjBvYWhrcDM1bXh2ZktuV2hMNWQ3Iiwic2NwIjpbIm9wZW4tYXBpIl0sInJlcXVlc3RlciI6IkVYVEVSTkFMIiwiYWNjb3VudElkIjoiNjUzYjBmOGQ3ZTg5ODJkZWZhZmFhZjViIiwic3ViIjoiMG9haGtwMzVteHZmS25XaEw1ZDciLCJ1c2VyUm9sZXMiOlt7InJvbGVJZCI6eyJwZXJtaXNzaW9ucyI6WyJhZG1pbiJdfX1dLCJyb2xlIjoidXNlciIsImNsaWVudFR5cGUiOiJvcGVuYXBpIiwiaWFtIjoidjMiLCJhY2NvdW50TmFtZSI6IkxpbmUgcHJvcGVydGllcyBJbmMiLCJuYW1lIjoiQVBJIEZvciBXZWJzaXRlICJ9.GtkFU4D0ecOKSFm-TwHS6Dfb5TapHbJjjDs8Q_i5ksi-JuhWC2Xle8ke7JpGnTBPQhEykf7ox-tEQQEJaGajWYefdZM3BOd-SPDc4q6cITd69RyG5c3_plei4ku_vzktk4GJx4itnR6vTdynVZrd7dM4HU78Y0XrJr4zqWLRo508B3rsFQZMljFgsmW5gs4p0i51gfdX9BUxYQNsCz4rmb8nb2gQ1Az5Xhd480JfrohdQXBcXSW6X_DkgmvVyOBt2emlg6i2JHjPDc0voUN3ssNWv3uZTHMsHTGvAgQA7rjwMSoEbC-8bH-TDyH36dUgPb_Lc5uixdeap6lTTWGZYQ'
    }
  };

export const GuestyAPI = () => {
  const [imgData, setimgData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://open-api.guesty.com/v1/listings');
        if (!response.ok) {
          throw new Error('Failed to fetch Guesty data');
        }
        const data = await response.json();
        setimgData(data);
      } catch (error) {
        console.error('Error fetching Guesty data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <article className="flex flex-col gap-2 flex-grow">
      <header className="flex w-full flex-row justify-between gap-2">
        <h3 className="text-xl text-neutral-950">
          API Testing (<a className="hover:text-blue-500 after:content-['_↗']" href="https://api.coindesk.com/v1/bpi/currentprice.json" target="_blank" rel="noreferrer"> CoinDeskAPI</a>)
        </h3>
      </header>
      <p className="w-auto max-w-[60ch] leading-6 text-base">Displaying live BTC values, first API test!</p>
      
      <article>
      {
        (imgData.pictures.map(({original, caption}) => (
                  <li>
                    <img src={original} />
                  </li>
                )
              ))
              } 
      </article>

    </article>
  );
};