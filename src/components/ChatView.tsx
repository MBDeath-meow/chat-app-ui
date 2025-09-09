import { motion } from 'framer-motion';
import { Hash, Volume2, Pin, Users, Search, AtSign } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { cn } from '@/lib/utils';

export function ChatView() {
  const { 
    servers, 
    currentServerId, 
    currentChannelId, 
    currentDMId,
    directMessages,
    friends,
    toggleMembers,
    showMembers
  } = useAppStore();

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

  const getCurrentDM = () => {
    if (currentDMId && currentDMId !== 'friends') {
      return directMessages.find(dm => dm.id === currentDMId);
    }
    return null;
  };

  const currentChannel = getCurrentChannel();
  const currentDM = getCurrentDM();
  
  if (!currentChannel && !currentDM && currentDMId !== 'friends') {
    return (
      <div className="flex-1 flex items-center justify-center bg-discord-bg-primary">
        <div className="text-center text-discord-text-muted">
          <h2 className="text-2xl font-semibold mb-2">Выберите канал</h2>
          <p>Выберите канал из списка слева, чтобы начать общение</p>
        </div>
      </div>
    );
  }

  const getHeaderTitle = () => {
    if (currentChannel) {
      return currentChannel.name;
    }
    if (currentDM) {
      const otherUsers = currentDM.participants
        .filter(id => id !== useAppStore.getState().currentUser?.id)
        .map(id => friends.find(f => f.id === id)?.displayName)
        .filter(Boolean);
      return otherUsers.join(', ');
    }
    return 'Друзья';
  };

  const getHeaderIcon = () => {
    if (currentChannel) {
      return currentChannel.type === 'text' ? Hash : Volume2;
    }
    return AtSign;
  };

  const HeaderIcon = getHeaderIcon();

  return (
    <div className="flex-1 flex flex-col h-full bg-discord-bg-primary">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-12 flex items-center justify-between px-4 border-b border-discord-bg-elevated shadow-sm"
      >
        <div className="flex items-center gap-2">
          <HeaderIcon className="h-5 w-5 text-discord-text-muted" />
          <h1 className="font-semibold text-discord-text-primary">
            {getHeaderTitle()}
          </h1>
          {currentChannel?.topic && (
            <>
              <div className="w-px h-4 bg-discord-bg-elevated" />
              <span className="text-small text-discord-text-muted truncate max-w-md">
                {currentChannel.topic}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Pin className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Search className="h-4 w-4" />
          </Button>
          {currentServerId && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "w-8 h-8",
                showMembers && "bg-discord-bg-elevated"
              )}
              onClick={toggleMembers}
            >
              <Users className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList />
        <MessageComposer />
      </div>
    </div>
  );
}