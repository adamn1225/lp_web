import React, { useState } from 'react';
import Modal from 'react-modal';
import { CreditCard } from 'lucide-react';
import TextArea from './TextArea';

interface AcceptModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onAccept: () => void;
    loading: boolean;
}

const AcceptModal: React.FC<AcceptModalProps> = ({ isOpen, onRequestClose, onAccept, loading }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleAccept = () => {
        if (isChecked) {
            onAccept();
            onRequestClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Accept Terms"
            className="bg-white z-50 xs:w-full md:px-4 py-12 rounded-lg drop-shadow-2xl shadow-lg md:w-2/3 lg:w-1/2 h-6/6 my-12"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            appElement={document.getElementById('Top')!}
        >
            <div className="xs:w-full relative flex flex-col justify-center items-center max-h-full overflow-y-auto">
                <h2 className="text-slate-800 text-3xl mb-4 underline">Accept Terms</h2>
                <TextArea />
                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        id="acceptCheckbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="acceptCheckbox" className="text-slate-800">I accept the terms and conditions</label>
                </div>
                <button
                    className={`bg-slate-500 drop-shadow-lg text-white rounded-lg py-2 px-4 mt-4 ${!isChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="button"
                    onClick={handleAccept}
                    disabled={!isChecked}
                >
                    Accept
                </button>
                <button
                    className="lp-button flex gap-2 text-xl font-bold drop-shadow-lg text-white rounded-lg py-2 px-4 mt-4"
                    type="button"
                    onClick={handleAccept}
                    disabled={!isChecked || loading}
                >
                    <CreditCard />  Proceed to Payment
                </button>
            </div>
        </Modal>
    );
};

export default AcceptModal;