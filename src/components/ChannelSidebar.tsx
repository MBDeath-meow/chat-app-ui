import { motion } from 'framer-motion';
import { Hash, Volume2, ChevronDown, ChevronRight, Plus, Settings, Search } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ChannelSidebar() {
  const { 
    servers, 
    currentServerId, 
    currentChannelId, 
    setCurrentChannel,
    voiceStates 
  } = useAppStore();
  
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const currentServer = servers.find(s => s.id === currentServerId);
  
  if (!currentServer) return null;

  const toggleCategory = (categoryId: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(categoryId)) {
      newCollapsed.delete(categoryId);
    } else {
      newCollapsed.add(categoryId);
    }
    setCollapsedCategories(newCollapsed);
  };

  const getChannelIcon = (type: 'text' | 'voice') => {
    return type === 'text' ? Hash : Volume2;
  };

  const getUsersInVoiceChannel = (channelId: string) => {
    return voiceStates.filter(vs => vs.channelId === channelId);
  };

  const filteredCategories = currentServer.categories.map(category => ({
    ...category,
    channels: category.channels.filter(channel =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.channels.length > 0);

  return (
    <div className="h-full flex flex-col">
      {/* Server Header */}
      <div className="p-4 border-b border-discord-bg-elevated shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-discord-text-primary truncate">
            {currentServer.name}
          </h2>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-discord-text-muted" />
          <Input
            placeholder="Поиск каналов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-discord-bg-primary border-none text-small"
          />
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredCategories.map((category) => (
          <div key={category.id} className="mb-1">
            {/* Category Header */}
            <Button
              variant="ghost"
              className="w-full justify-between p-1 h-8 text-xs font-semibold text-discord-text-muted hover:text-discord-text-primary uppercase tracking-wide"
              onClick={() => toggleCategory(category.id)}
            >
              <span>{category.name}</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="w-4 h-4">
                  <Plus className="h-3 w-3" />
                </Button>
                {collapsedCategories.has(category.id) ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </div>
            </Button>

            {/* Channels */}
            {!collapsedCategories.has(category.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {category.channels.map((channel) => {
                  const Icon = getChannelIcon(channel.type);
                  const isActive = currentChannelId === channel.id;
                  const usersInVoice = getUsersInVoiceChannel(channel.id);
                  
                  return (
                    <div key={channel.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start gap-2 px-2 py-1 h-8 text-small channel-hover",
                              isActive && "channel-active"
                            )}
                            onClick={() => setCurrentChannel(channel.id)}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate flex-1 text-left">{channel.name}</span>
                            
                            {/* Unread count */}
                            {channel.unreadCount && channel.unreadCount > 0 && (
                              <div className="bg-destructive text-white rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[18px] h-4 flex items-center justify-center">
                                {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                              </div>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{channel.description || channel.name}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Voice Channel Members */}
                      {channel.type === 'voice' && usersInVoice.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="ml-6 mb-1"
                        >
                          {usersInVoice.map((voiceState) => {
                            const user = currentServer.members.find(u => u.id === voiceState.userId);
                            if (!user) return null;
                            
                            return (
                              <div
                                key={user.id}
                                className="flex items-center gap-2 px-2 py-1 text-small text-discord-text-secondary hover:text-discord-text-primary"
                              >
                                <div className="w-5 h-5 rounded-full bg-discord-bg-elevated flex items-center justify-center">
                                  <span className="text-xs">{user.displayName[0]}</span>
                                </div>
                                <span className="truncate">{user.displayName}</span>
                                {voiceState.muted && (
                                  <div className="w-3 h-3 bg-destructive rounded-full" />
                                )}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}