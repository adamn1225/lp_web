import React, { useEffect } from 'react';
import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

const SwiperComponent = ({ pictures }) => {
    useEffect(() => {
        Swiper.use([Navigation, Pagination]);
        new Swiper('.swiper-container', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            slidesPerView: 5,
            spaceBetween: 10,
            centeredSlides: false, // Ensure slides are not centered
        });
    }, []);

    return (
        <>
            <div className="relative z-[2] mx-20">
                <div className="swiper-button-prev"></div>
                <div className="swiper-container overflow-hidden">
                    <div className="swiper-wrapper">
                        {/* Slides */}
                        {pictures.map((picture, index) => (
                            <div className="swiper-slide" key={index}>
                                <img
                                    className="w-full h-auto"
                                    src={picture.original}
                                    alt={`Listing image ${index + 1}`}
                                    decoding="async"
                                    data-zoom
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="swiper-pagination mx-auto"></div>
                </div>
                <div className="swiper-button-next"></div>
            </div>

            <style>{`
                .swiper-button-next,
                .swiper-button-prev {
                    color: #0891b2; /* Change this to the desired color */
                    font-weight: 900;
                    width: 55px;
                    height: 55px;
                    border-radius: 50%; /* Optional: Make the buttons circular */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 20;
                }
                .swiper-button-next {
                    right: -70px; /* Adjust this value to position the button outside the container */
                }
                .swiper-button-prev {
                    left: -70px; /* Adjust this value to position the button outside the container */
                }

                .swiper-pagination {
                    position: relative;
                    bottom: 10px; /* Adjust this value to position the pagination bullets */
                    left: 50%;
                    transform: translateX(-0%);
                    z-index: 10;
                }

                .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    display: inline-block;
                    border-radius: 50%;
                    background: #0891b2 !important; /* Change this to the desired color */
                    margin: 0 8px;
                }

                .swiper-container .swiper-pagination .swiper-pagination-bullet {
                    background: #0891b2 !important; /* Change this to the desired color */
                }

                .swiper-container .swiper-pagination .swiper-pagination-bullet-active {
                    background: #0891b2 !important; /* Change this to the desired color */
                }

                .swiper-wrapper {
                    margin-left: 0 !important; /* Ensure the slides start from the beginning */
                }
            `}</style>
        </>
    );
};

export default SwiperComponent;