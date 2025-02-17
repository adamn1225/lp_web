import fs from 'fs';
import path from 'path';

export async function handler(event) {
    try {
        const reviewsPath = path.resolve('/home/adam-noah/Desktop/lp_web/data/reviews.json');
        const reviewsData = fs.readFileSync(reviewsPath, 'utf-8');
        const reviews = JSON.parse(reviewsData);

        return {
            statusCode: 200,
            body: JSON.stringify(reviews)
        };
    } catch (error) {
        console.error(`Error reading reviews: ${error.message}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}