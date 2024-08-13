import axios from 'axios';

export async function handler(event, context) {
  const { token } = JSON.parse(event.body);
  const secretKey = '6LfJ_iUqAAAAALT8V5YNcWIxTK9u5-eiK9ga0Y5m';

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
}