import { motion } from 'framer-motion';
import { useState } from 'react';
import { MoreVertical, Reply, Heart, Pin, Copy, Trash2 } from 'lucide-react';
import { Message, User } from '@/lib/types';
import { UserAvatar } from './UserAvatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

interface MessageItemProps {
  message: Message;
  author?: User;
  showAvatar: boolean;
}

export function MessageItem({ message, author, showAvatar }: MessageItemProps) {
  const { addReaction, togglePin, currentUser } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);

  if (!author) {
    return null;
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleReaction = (emoji: string) => {
    if (currentUser) {
      addReaction(message.id, emoji, currentUser.id);
    }
  };

  const handlePin = () => {
    togglePin(message.id);
  };

  const isOwnMessage = currentUser?.id === author.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group px-4 py-1 message-hover relative",
        showAvatar && "mt-4"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 flex-shrink-0">
          {showAvatar && (
            <UserAvatar user={author} size="md" showStatus />
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          {showAvatar && (
            <div className="flex items-baseline gap-2 mb-1">
              <span 
                className="font-medium text-discord-text-primary hover:underline cursor-pointer"
                style={{ color: author.roles?.[0]?.color }}
              >
                {author.displayName}
              </span>
              <span className="text-xs text-discord-text-muted">
                {formatTime(message.timestamp)}
              </span>
              {message.edited && (
                <span className="text-xs text-discord-text-muted">(изменено)</span>
              )}
              {message.pinned && (
                <Pin className="h-3 w-3 text-warning" />
              )}
            </div>
          )}

          {/* Message Text */}
          <div className="text-discord-text-primary break-words">
            {message.content}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <div 
                  key={attachment.id}
                  className="bg-discord-bg-elevated rounded p-3 max-w-md"
                >
                  <div className="text-small text-discord-text-secondary">
                    📎 {attachment.filename}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction) => (
                <motion.button
                  key={reaction.emoji}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReaction(reaction.emoji)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded bg-discord-bg-elevated hover:bg-discord-bg-tertiary text-small",
                    reaction.users.includes(currentUser?.id || '') && "bg-primary/20 border border-primary/50"
                  )}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-discord-text-muted">{reaction.count}</span>
                </motion.button>
              ))}
              
              {/* Add Reaction Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleReaction('👍')}
                className="flex items-center justify-center w-7 h-7 rounded bg-discord-bg-elevated hover:bg-discord-bg-tertiary text-discord-text-muted hover:text-discord-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              >
                +
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Message Actions */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 right-4 bg-discord-bg-secondary border border-discord-bg-elevated rounded shadow-lg flex"
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => handleReaction('👍')}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
          >
            <Reply className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleReaction('❤️')}>
                Добавить реакцию
              </DropdownMenuItem>
              <DropdownMenuItem>
                Ответить
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePin}>
                {message.pinned ? 'Открепить' : 'Закрепить'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Копировать ссылку
              </DropdownMenuItem>
              {isOwnMessage && (
                <>
                  <DropdownMenuItem>
                    Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}
    </motion.div>
  );
}