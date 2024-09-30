import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    const { guestInfo, paymentMethod, listingId, checkInDate, checkOutDate } = JSON.parse(event.body);

    console.log('Parsed guest info:', JSON.stringify(guestInfo, null, 2));
    console.log('Parsed payment method:', JSON.stringify(paymentMethod, null, 2));
    console.log('Parsed reservation details:', JSON.stringify({ listingId, checkInDate, checkOutDate }, null, 2));

    if (!process.env.VITE_API_TOKEN) {
      throw new Error('VITE_API_TOKEN environment variable is not set');
    }

    // Create guest
    const guestUrl = 'https://open-api.guesty.com/v1/guests-crud';
    const guestRequestBody = {
      firstName: guestInfo.firstName,
      lastName: guestInfo.lastName,
      phone: guestInfo.phone,
      email: guestInfo.email,
    };

    console.log('Guest Request Body:', JSON.stringify(guestRequestBody, null, 2));

    const guestOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.VITE_API_TOKEN}`
      },
      body: JSON.stringify(guestRequestBody)
    };

    console.log('Guest Request URL:', guestUrl);
    console.log('Guest Request Headers:', JSON.stringify(guestOptions.headers, null, 2));

    const guestResponse = await fetch(guestUrl, guestOptions);
    const guestResponseText = await guestResponse.text();
    console.log('Guest Response text:', guestResponseText);

    if (!guestResponse.ok) {
      throw new Error(`Error: ${guestResponse.status} ${guestResponse.statusText} - ${guestResponseText}`);
    }

    const guestData = JSON.parse(guestResponseText);
    console.log('Guest created:', guestData);

    // Create reservation
    const reservationUrl = 'https://open-api.guesty.com/v1/reservations';
    const reservationRequestBody = {
      listingId,
      checkInDateLocalized: checkInDate,
      checkOutDateLocalized: checkOutDate,
      status: 'inquiry',
      guestId: guestData._id,
      paymentMethod,
    };

    console.log('Reservation Request Body:', JSON.stringify(reservationRequestBody, null, 2));

    const reservationOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.VITE_API_TOKEN}`
      },
      body: JSON.stringify(reservationRequestBody)
    };

    console.log('Reservation Request URL:', reservationUrl);
    console.log('Reservation Request Headers:', JSON.stringify(reservationOptions.headers, null, 2));

    const reservationResponse = await fetch(reservationUrl, reservationOptions);
    const reservationResponseText = await reservationResponse.text();
    console.log('Reservation Response text:', reservationResponseText);

    if (!reservationResponse.ok) {
      throw new Error(`Error: ${reservationResponse.status} ${reservationResponse.statusText} - ${reservationResponseText}`);
    }

    const reservationData = JSON.parse(reservationResponseText);
    console.log('Reservation created:', reservationData);

    // Attach payment method to reservation
    const paymentMethodUrl = `https://open-api.guesty.com/v1/guests/${guestData._id}/payment-methods`;
    const paymentMethodRequestBody = {
      _id: paymentMethod.id, // Assuming paymentMethod contains the tokenized payment method ID
      paymentProviderId: paymentMethod.providerId, // Assuming paymentMethod contains the provider ID
      reservationId: reservationData._id,
    };

    console.log('Payment Method Request Body:', JSON.stringify(paymentMethodRequestBody, null, 2));

    const paymentMethodOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.VITE_API_TOKEN}`
      },
      body: JSON.stringify(paymentMethodRequestBody)
    };

    console.log('Payment Method Request URL:', paymentMethodUrl);
    console.log('Payment Method Request Headers:', JSON.stringify(paymentMethodOptions.headers, null, 2));

    const paymentMethodResponse = await fetch(paymentMethodUrl, paymentMethodOptions);
    const paymentMethodResponseText = await paymentMethodResponse.text();
    console.log('Payment Method Response text:', paymentMethodResponseText);

    if (!paymentMethodResponse.ok) {
      throw new Error(`Error: ${paymentMethodResponse.status} ${paymentMethodResponse.statusText} - ${paymentMethodResponseText}`);
    }

    const paymentMethodData = JSON.parse(paymentMethodResponseText);
    console.log('Payment method attached:', paymentMethodData);

    return {
      statusCode: 200,
      body: JSON.stringify({ guestData, reservationData, paymentMethodData })
    };
  } catch (error) {
    console.error('Error creating guest or reservation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};