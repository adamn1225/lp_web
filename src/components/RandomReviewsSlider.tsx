import React, { useEffect, useState } from 'react';

const RandomReviewsGrid = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchInitialReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch('/data/reviews.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch initial reviews`);
            }
            const data = await response.json();
            console.log('Fetched Initial Reviews:', data); // Debugging log
            setReviews(data);
        } catch (error) {
            console.error('Error fetching initial reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRandomReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/.netlify/functions/randomReviews?count=3`);
            if (!response.ok) {
                throw new Error(`Failed to fetch random reviews`);
            }
            const data = await response.json();
            console.log('Fetched Random Reviews:', data); // Debugging log
            setReviews(data);
        } catch (error) {
            console.error('Error fetching random reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialReviews();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.34 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <div className="bg-secondary rounded-lg shadow-lg max-w-screen w-full h-fit pt-8 md:pt-32 pb-6 px-4 md:px-32">
            <span className="text-white underline underline-offset-8 text-lg md:text-2xl font-semibold inline-flex w-full justify-center mb-4">
                What our guests are saying</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-slate-200 p-4 rounded-lg shadow-md">
                        <div className="flex items-center mb-2">
                            <strong className='pr-1'>Rating:</strong> {renderStars(review.overall_rating)}
                        </div>
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