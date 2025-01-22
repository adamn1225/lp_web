import React, { useEffect, useState } from 'react';

interface Review {
    _id: string;
    guestId: string;
    overall_rating: number;
    public_review: string;
}

interface AirReviewsProps {
    listingId: string;
}

const AirReviews: React.FC<AirReviewsProps> = ({ listingId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const url = `/.netlify/functions/propertyReviews?propertyId=${listingId}`;
                console.log(`Fetching reviews from URL: ${url}`);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch reviews: ${response.statusText}`);
                }
                const data = await response.json();
                setReviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [listingId]);

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (reviews.length === 0) {
        return <p>No reviews available</p>;
    }

    return (
        <div className="flex flex-wrap items-start justify-start gap-y-8 gap-x-6">
            {reviews.map((review, index) => (
                <div className="relative" key={review._id}>
                    <div className="gap-4 mb-6 flex items-center">
                        <div className="meta">
                            <div className="flex gap-4 justify-start items-center flex-wrap w-1/2">
                                <h4 className="text-slate-950 text-base font-semibold font-sans">
                                    Guest ID: {review.guestId}
                                </h4>
                                <span className="text-muted-700 text-sm">
                                    Rating: {review.overall_rating}
                                </span>
                                <p className="text-slate-950 text-base">
                                    {review.public_review}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AirReviews;