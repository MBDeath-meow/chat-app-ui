import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';

export function MessageList() {
  const { 
    messages, 
    currentChannelId, 
    currentDMId, 
    servers, 
    currentServerId,
    friends,
    currentUser,
    typingUsers
  } = useAppStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChatId = currentChannelId || currentDMId;
  
  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];
  
  const getMessageAuthor = (authorId: string) => {
    if (currentChannelId) {
      // Server message - find user in current server
      const server = servers.find(s => s.id === currentServerId);
      return server?.members.find(m => m.id === authorId);
    } else {
      // DM message - find in friends or current user
      if (authorId === currentUser?.id) return currentUser;
      return friends.find(f => f.id === authorId);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const currentTypingUsers = currentChatId ? typingUsers[currentChatId] || [] : [];

  if (!currentChatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-discord-text-muted">
          <h3 className="text-lg font-semibold mb-2">Добро пожаловать!</h3>
          <p>Выберите канал или начните разговор</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {/* Channel/DM Header */}
      <div className="mb-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-discord-text-primary mb-2">
            Начало разговора
          </h2>
          <p className="text-discord-text-muted">
            Это начало вашего разговора в этом канале
          </p>
        </motion.div>
      </div>

      {/* Messages */}
      <div className="space-y-1">
        <AnimatePresence>
          {currentMessages.map((message, index) => {
            const author = getMessageAuthor(message.authorId);
            const prevMessage = currentMessages[index - 1];
            const showAvatar = !prevMessage || 
                              prevMessage.authorId !== message.authorId ||
                              new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 300000; // 5 minutes

            return (
              <MessageItem
                key={message.id}
                message={message}
                author={author}
                showAvatar={showAvatar}
              />
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        {currentTypingUsers.length > 0 && (
          <TypingIndicator userIds={currentTypingUsers} />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}