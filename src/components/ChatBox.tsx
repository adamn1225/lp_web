import React from 'react';
import SendMessageForm from './ChatBoxForm';
import ConversationPosts from './ConversationPosts';

interface ChatBoxProps {
  conversationId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ conversationId }) => {
  return (
    <div className="chat-box">
      <ConversationPosts conversationId={conversationId} />
      <SendMessageForm conversationId={conversationId} />
    </div>
  );
};

export default ChatBox;