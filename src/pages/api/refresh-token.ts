import * as dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: any, res: any): Promise<void> {
  try {
    const response = await fetch('https://lp-web-xi.vercel.app/api/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REFRESH_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}