import React, { useEffect, useState } from 'react';

const RandomReviewsGrid = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRandomReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/.netlify/functions/randomReviews?count=3`);
            if (!response.ok) {
                throw new Error(`Failed to fetch random reviews`);
            }
            const data = await response.json();
            console.log('Fetched Reviews:', data); // Debugging log
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomReviews();
    }, []);

    return (
        <div className="bg-secondary rounded-lg shadow-lg max-w-screen w-full h-fit pt-32 pb-6 px-32">
            <span className="text-white underline underline-offset-8 text-lg md:text-2xl font-semibold inline-flex w-full justify-center mb-4">
                What our guests are saying</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-primary p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold text-lg">{review.guestFullName}</h3>
                        <p className="text-sm">{review.public_review}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <button
                    onClick={fetchRandomReviews}
                    className={`bg-white text-secondary opacity-80 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-secondary-dark ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'See More Reviews'}
                </button>
            </div>
        </div>
    );
};

export default RandomReviewsGrid;