import React, { useState } from 'react';
import Modal from './Modal'; // Adjust the import path as needed

const ImageGallery = ({ pictures }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const openModal = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage('');
    };

    return (
        <>
            <div className="grid grid-cols-12 space-x-2 gap-2 space-y-2 max-w-full md:w-full">
                {pictures.slice(1).map((picture, index) => (
                    <img
                        key={index}
                        className="object-cover md:w-full max-h-24 shadow-md flex-1 cursor-pointer"
                        src={picture.original}
                        alt={`Sub image ${index + 1}`}
                        width={2000}
                        height={1333}
                        data-zoom
                        loading="lazy"
                        onClick={() => openModal(picture.original)}
                    />
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} imageSrc={selectedImage} />
        </>
    );
};

export default ImageGallery;