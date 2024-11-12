import React, { useEffect, useState } from 'react';
import Swiper, { Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';

const SwiperComponent = ({ pictures }) => {
    const [currentSlide, setCurrentSlide] = useState(1);

    useEffect(() => {
        Swiper.use([Pagination]);
        const swiper = new Swiper('.swiper-container', {
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            slidesPerView: 1, // Show only one slide at a time
            spaceBetween: 10,
            centeredSlides: false, // Ensure slides are not centered
            on: {
                slideChange: function () {
                    setCurrentSlide(this.activeIndex + 1);
                },
            },
        });
    }, []);

    return (
        <>
            <div className="relative z-[2]">
                <div className="swiper-container overflow-hidden">
                    <div className="swiper-wrapper">
                        {/* Slides */}
                        {pictures.map((picture, index) => (
                            <div className="swiper-slide" key={index}>
                                <img
                                    className="w-full"
                                    src={picture.original}
                                    alt={`Listing image ${index + 1}`}
                                    decoding="async"
                                    data-zoom
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="slide-counter">
                    {currentSlide} of {pictures.length}
                </div>
            </div>

            <style>{`
                .swiper-container {
                    width: 100%;
                    height: 100%;
                }

                .swiper-container .swiper-pagination .swiper-pagination-bullet {
                    background: #0891b2 !important; /* Change this to the desired color */
                    margin: 0 !important;
                }

                .swiper-container .swiper-pagination .swiper-pagination-bullet-active {
                    background: #0891b2 !important; /* Change this to the desired color */
                }

                .swiper-wrapper {
                    margin: 0 !important; /* Ensure the slides start from the beginning */
                }

                .swiper-slide img {
                    width: 100%; /* Ensure the images take up the full width of the slide */
                    height: auto;
                }

                .slide-counter {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.5);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 14px;
                    z-index: 10;
                }
            `}</style>
        </>
    );
};

export default SwiperComponent;