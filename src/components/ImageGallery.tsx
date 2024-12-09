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
            <div className="relative flex flex-col gap-2 overflow-y-auto no-scrollbar h-full w-auto" ref={scrollContainerRef}>
                {pictures.slice(startIndex + 1, startIndex + 9).map((picture, index) => (
                    <img
                        key={index}
                        className="object-cover max-h-24 w-auto shadow-md flex-1 cursor-pointer"
                        src={picture.original}
                        alt={`Sub image ${index + 1}`}
                        width={1750}
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