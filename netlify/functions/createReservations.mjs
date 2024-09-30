import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    const { guestInfo, paymentMethod } = JSON.parse(event.body);

    console.log('Parsed guest info:', JSON.stringify(guestInfo, null, 2));
    console.log('Parsed payment method:', JSON.stringify(paymentMethod, null, 2));

    if (!process.env.VITE_API_TOKEN) {
      throw new Error('VITE_API_TOKEN environment variable is not set');
    }

    // Create guest
    const guestUrl = `${process.env.BASE_URL}guests-crud`;
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

    // Tokenize payment
    const tokenizationUrl = 'https://pay.guesty.com/api/tokenize/v2';
    const tokenizationPayload = {
      paymentMethod,
    };

    console.log('Tokenization Payload:', JSON.stringify(tokenizationPayload, null, 2));

    const tokenizationResponse = await fetch(tokenizationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tokenizationPayload)
    });

    const tokenizationResponseText = await tokenizationResponse.text();
    console.log('Tokenization Response text:', tokenizationResponseText);

    if (!tokenizationResponse.ok) {
      throw new Error(`Error: ${tokenizationResponse.status} ${tokenizationResponse.statusText} - ${tokenizationResponseText}`);
    }

    const tokenizationData = JSON.parse(tokenizationResponseText);
    console.log('Tokenization successful:', tokenizationData);

    return {
      statusCode: 200,
      body: JSON.stringify({ guestData, tokenizationData })
    };
  } catch (error) {
    console.error('Error creating guest or tokenizing payment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};