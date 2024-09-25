import React from 'react';

interface AlertProps {
    message: string;
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
                <div className="flex justify-between items-center">
                    <p className="text-red-600 font-semibold">{message}</p>
                    <button onClick={onClose} className="text-red-600 font-bold">&times;</button>
                </div>
            </div>
        </div>
    );
};

export default Alert;