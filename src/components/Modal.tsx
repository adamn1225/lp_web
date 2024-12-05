import React from 'react';

const Modal = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-full max-h-full overflow-auto p-4">
                <button
                    className="absolute top-0 right-0 m-4 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2"
                    onClick={onClose}
                >
                    &times;
                </button>
                <img
                    className="max-w-full max-h-screen object-contain"
                    src={imageSrc}
                    alt="Enlarged view"
                />
            </div>
        </div>
    );
};

export default Modal;