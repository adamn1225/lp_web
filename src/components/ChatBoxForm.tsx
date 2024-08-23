import React, { useState } from 'react';

interface ChatBoxFormProps {
  conversationId: string;
}

const ChatBoxForm: React.FC<ChatBoxFormProps> = ({ conversationId }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Message cannot be empty');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/.netlify/functions/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId, message }),
      });
      const data = await response.json();
      console.log('Message sent:', data);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-box-form flex flex-col">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        disabled={isSending}
      />
      <button className='lp-button mb-6 mt-2 font-bold text-sm drop-shadow-lg text-white rounded-full h-11 transition-all duration-300 py-4 px-4 w-full flex items-center place-item-center justify-center cursor-pointer hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300"' type="submit" disabled={isSending}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default ChatBoxForm;