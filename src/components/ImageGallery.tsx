import React, { useState, useRef } from 'react';
import Modal from './Modal'; // Adjust the import path as needed
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ pictures }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    const openModal = (index) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImageIndex(0);
    };

    const showNextImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex + 1) % pictures.length);
    };

    const showPreviousImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex - 1 + pictures.length) % pictures.length);
    };

    const scrollNext = () => {
        setStartIndex((prevIndex) => Math.min(prevIndex + 1, pictures.length - 9));
    };

    const scrollPrevious = () => {
        setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    return (
        <>
            <div className="relative top-0 flex flex-col gap-1 justify-center overflow-y-auto no-scrollbar h-[34.5rem] w-auto" ref={scrollContainerRef}>
                {pictures.slice(startIndex + 1, startIndex + 10).map((picture, index) => (
                    <img
                        key={index}
                        className="object-cover max-h-40 w-64 shadow-md flex-1 cursor-pointer gallery-image"
                        src={picture.original}
                        alt={`Sub image ${index + 1}`}
                        width={1650}
                        height={1000}
                        data-zoom
                        loading="lazy"
                        onClick={() => openModal(startIndex + index + 1)} // Adjust index to match sliced array
                    />
                ))}
                <button
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-2"
                    onClick={scrollPrevious}
                >
                    <ChevronUp />
                </button>
                <button
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-2"
                    onClick={scrollNext}
                >
                    <ChevronDown />
                </button>
            </div>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className=''>
                        <button
                            className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2"
                            onClick={showPreviousImage}
                        >
                            <ChevronLeft />
                        </button>
                        <div className="relative flex items-center justify-center h-2/3">

                            <img
                                className="object-contain max-h-[600px]"
                                src={pictures[selectedImageIndex].original}
                                alt={`Image ${selectedImageIndex + 1}`}
                            />

                        </div>
                        <button
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2"
                            onClick={showNextImage}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </Modal>
            )}
            <style>
                {`
                    .gallery-image {
                        max-height: 100px; /* Adjust this value to match the desired height */
                    }

                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }

                    .no-scrollbar {
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;  /* Firefox */
                    }
                `}
            </style>
        </>
    );
};

export default ImageGallery;