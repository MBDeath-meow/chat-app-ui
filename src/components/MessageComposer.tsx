import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Smile, Gift, Hash } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function MessageComposer() {
  const { 
    currentChannelId, 
    currentDMId, 
    currentUser, 
    addMessage,
    addTypingUser,
    removeTypingUser,
    servers,
    currentServerId
  } = useAppStore();
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const currentChatId = currentChannelId || currentDMId;
  
  const getCurrentChannel = () => {
    if (currentChannelId) {
      return servers
        .find(s => s.id === currentServerId)
        ?.categories
        .flatMap(c => c.channels)
        .find(ch => ch.id === currentChannelId);
    }
    return null;
  };

  const currentChannel = getCurrentChannel();
  
  const placeholder = currentChannel 
    ? `Сообщение в #${currentChannel.name}`
    : currentDMId === 'friends'
    ? 'Выберите друга для отправки сообщения'
    : 'Написать сообщение...';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleTyping = () => {
    if (!isTyping && currentChatId && currentUser) {
      setIsTyping(true);
      addTypingUser(currentChatId, currentUser.id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (currentChatId && currentUser) {
        setIsTyping(false);
        removeTypingUser(currentChatId, currentUser.id);
      }
    }, 3000);
  };

  const handleSubmit = () => {
    if (!message.trim() || !currentChatId || !currentUser) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      content: message.trim(),
      authorId: currentUser.id,
      channelId: currentChatId,
      timestamp: new Date().toISOString(),
      type: 'default' as const,
    };

    addMessage(newMessage);
    setMessage('');

    // Stop typing
    if (isTyping) {
      setIsTyping(false);
      removeTypingUser(currentChatId, currentUser.id);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }

    // Focus back to textarea
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    handleTyping();
  };

  if (currentDMId === 'friends') {
    return (
      <div className="p-4 border-t border-discord-bg-elevated">
        <div className="bg-discord-bg-secondary rounded-lg p-4 text-center text-discord-text-muted">
          <Hash className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Выберите друга из списка слева, чтобы начать переписку</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-4 border-t border-discord-bg-elevated"
    >
      <div className={cn(
        "bg-discord-bg-elevated rounded-lg flex items-end gap-3 p-3 transition-all",
        message.length > 0 && "ring-1 ring-primary/50"
      )}>
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 flex-shrink-0 text-discord-text-muted hover:text-discord-text-primary"
        >
          <Plus className="h-5 w-5" />
        </Button>

        {/* Message Input */}
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={!currentChatId || currentDMId === 'friends'}
            className="min-h-[20px] max-h-[200px] resize-none border-none bg-transparent text-discord-text-primary placeholder:text-discord-text-muted focus-visible:ring-0 p-0"
            style={{ height: '20px' }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Emoji Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-discord-text-muted hover:text-discord-text-primary"
          >
            <Smile className="h-5 w-5" />
          </Button>

          {/* Gift Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-discord-text-muted hover:text-discord-text-primary"
          >
            <Gift className="h-5 w-5" />
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || !currentChatId || currentDMId === 'friends'}
            size="icon"
            className={cn(
              "w-8 h-8 hover-scale",
              message.trim() 
                ? "bg-primary hover:bg-primary-hover text-white" 
                : "bg-discord-bg-tertiary text-discord-text-muted cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Character Count */}
      {message.length > 1800 && (
        <div className="mt-2 text-right">
          <span className={cn(
            "text-xs",
            message.length > 2000 ? "text-destructive" : "text-discord-text-muted"
          )}>
            {message.length}/2000
          </span>
        </div>
      )}
    </motion.div>
  );
}