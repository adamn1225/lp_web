import React, { useState, useRef } from 'react';
import Modal from './Modal'; // Adjust the import path as needed
import { ChevronRight, ChevronLeft } from 'lucide-react';

const ImageGallery = ({ pictures }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const scrollPrevious = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className="relative">
                <div className="flex gap-1 overflow-x-hidden no-scrollbar" ref={scrollContainerRef}>
                    {pictures.slice(1).map((picture, index) => (
                        <img
                            key={index}
                            className="object-cover max-h-24 shadow-md flex-1 cursor-pointer"
                            src={picture.original}
                            alt={`Sub image ${index + 1}`}
                            width={2000}
                            height={1333}
                            data-zoom
                            loading="lazy"
                            onClick={() => openModal(index + 1)} // Adjust index to match sliced array
                        />
                    ))}
                </div>
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2"
                    onClick={scrollPrevious}
                >
                    <ChevronLeft />
                </button>
                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2"
                    onClick={scrollNext}
                >
                    <ChevronRight />
                </button>
            </div>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className="relative flex items-center justify-center h-screen">
                        <button
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2"
                            onClick={showPreviousImage}
                        >
                            <ChevronLeft />
                        </button>
                        <img
                            className="object-contain max-h-full"
                            src={pictures[selectedImageIndex].original}
                            alt={`Image ${selectedImageIndex + 1}`}
                        />
                        <button
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2"
                            onClick={showNextImage}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default ImageGallery;