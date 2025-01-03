import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
  showCloseButton?: boolean; // Add prop for close button
  className?: string; // Add className prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, fullScreen = false, showCloseButton = false, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${fullScreen ? 'w-full h-full' : ''} ${className}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className={`relative bg-white rounded-lg shadow-lg ${fullScreen ? 'w-full h-full overflow-auto' : 'w-auto h-2/3 md:h-auto'}`}>
        {showCloseButton && (
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        )}
        <div className="">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;