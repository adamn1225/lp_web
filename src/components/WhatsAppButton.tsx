import React from 'react';

const WhatsAppButton: React.FC = () => {
    const handleClick = () => {
        window.open('https://wa.me/1234567890?text=Hello!%20How%20can%20I%20help%20you?', '_blank');
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '30px' }}>
            <button onClick={handleClick} className="whatsapp-button">
                <img src="/images/whatsapp_icon.png" alt="WhatsApp" style={{ width: '75px', height: '75px' }} />
            </button>
        </div>
    );
};

export default WhatsAppButton;