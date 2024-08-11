import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    const reservationInfo = JSON.parse(event.body);
    const url = 'https://booking.guesty.com/api/reservations';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json; charset=utf-8',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.GUESTY_BOOKING_API}` // Use the new API token from the environment variable
      },
      body: JSON.stringify({
        reservation: {
          listingId: reservationInfo.listingId,
          checkInDateLocalized: reservationInfo.checkInDateLocalized,
          checkOutDateLocalized: reservationInfo.checkOutDateLocalized,
          guestsCount: reservationInfo.guestsCount
        },
        guest: {
          firstName: reservationInfo.firstName,
          lastName: reservationInfo.lastName
        },
        policy: {
          privacy: {
            isAccepted: true,
            version: 1,
            dateOfAcceptance: new Date().toISOString()
          },
          termsAndConditions: {
            isAccepted: true,
            version: 1,
            dateOfAcceptance: new Date().toISOString()
          }
        }
      })
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText} - ${JSON.stringify(data)}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error creating reservation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};