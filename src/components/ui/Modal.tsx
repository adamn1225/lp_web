import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-zinc-100 h-fit rounded-lg p-4 w-11/12 max-w-md">
                <button onClick={onClose} className="relative top-1 right-1 text-3xl text-secondary hover:text-gray-700">
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;