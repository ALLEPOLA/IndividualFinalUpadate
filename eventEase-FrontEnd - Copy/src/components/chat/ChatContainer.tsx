// ChatContainer Component
// Main container that manages chat state and renders ChatIcon and ChatWindow

import React, { useState, useEffect } from 'react';
import { ChatIcon } from './ChatIcon';
import { ChatWindow } from './ChatWindow';

export const ChatContainer: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Listen for custom events to open chat
  useEffect(() => {
    const handleOpenChat = () => {
      setIsChatOpen(true);
    };

    window.addEventListener('openChat', handleOpenChat);
    
    return () => {
      window.removeEventListener('openChat', handleOpenChat);
    };
  }, []);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <ChatIcon onOpenChat={handleOpenChat} />
      <ChatWindow isOpen={isChatOpen} onClose={handleCloseChat} />
    </>
  );
};
