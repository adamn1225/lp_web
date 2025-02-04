// filepath: /home/adam-noah/Desktop/lp_web/src/components/ui/Modal.tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, fullScreen = false, showCloseButton = false, className = '' }) => {
  useEffect(() => {
    if (isOpen && fullScreen) {
      document.documentElement.classList.add('no-scroll');
      document.body.classList.add('no-scroll');
    } else {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen, fullScreen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${fullScreen ? 'w-full h-full' : ''} ${className}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className={`relative bg-white rounded-lg shadow-lg ${fullScreen ? 'w-full h-full overflow-scroll' : 'w-auto h-fit md:h-auto'}`}>
        {showCloseButton && (
          <button onClick={onClose} className="absolute top-3 right-3 text-secondary hover:text-gray-700">
            <X size={52} />
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