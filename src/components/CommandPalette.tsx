import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Hash, Users, Settings, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { 
    servers, 
    friends, 
    setCurrentServer, 
    setCurrentChannel, 
    setCurrentDM 
  } = useAppStore();
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    // Servers
    ...servers.map(server => ({
      id: `server-${server.id}`,
      title: server.name,
      subtitle: `${server.memberCount} участников`,
      icon: <span className="text-lg">{server.icon}</span>,
      action: () => {
        setCurrentServer(server.id);
        onOpenChange(false);
      },
      category: 'Серверы'
    })),
    
    // Channels
    ...servers.flatMap(server =>
      server.categories.flatMap(category =>
        category.channels.map(channel => ({
          id: `channel-${channel.id}`,
          title: `#${channel.name}`,
          subtitle: server.name,
          icon: <Hash className="h-4 w-4" />,
          action: () => {
            setCurrentServer(server.id);
            setCurrentChannel(channel.id);
            onOpenChange(false);
          },
          category: 'Каналы'
        }))
      )
    ),
    
    // Friends
    ...friends.map(friend => ({
      id: `friend-${friend.id}`,
      title: friend.displayName,
      subtitle: friend.username,
      icon: <MessageCircle className="h-4 w-4" />,
      action: () => {
        // Find or create DM
        setCurrentDM('friends'); // Simplified for demo
        onOpenChange(false);
      },
      category: 'Друзья'
    })),
    
    // Quick actions
    {
      id: 'friends-view',
      title: 'Друзья',
      subtitle: 'Открыть список друзей',
      icon: <Users className="h-4 w-4" />,
      action: () => {
        setCurrentDM('friends');
        onOpenChange(false);
      },
      category: 'Навигация'
    },
    {
      id: 'settings',
      title: 'Настройки',
      subtitle: 'Открыть настройки пользователя',
      icon: <Settings className="h-4 w-4" />,
      action: () => {
        // TODO: Open settings modal
        onOpenChange(false);
      },
      category: 'Навигация'
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
    command.category.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    if (!groups[command.category]) {
      groups[command.category] = [];
    }
    groups[command.category].push(command);
    return groups;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filteredCommands[selectedIndex]?.action();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl bg-discord-bg-secondary border-discord-bg-elevated">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="overflow-hidden"
        >
          {/* Search Input */}
          <div className="p-4 border-b border-discord-bg-elevated">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-discord-text-muted" />
              <Input
                placeholder="Поиск серверов, каналов, друзей..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-discord-bg-primary border-none text-discord-text-primary placeholder:text-discord-text-muted focus-visible:ring-1 focus-visible:ring-primary"
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="p-8 text-center text-discord-text-muted">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ничего не найдено</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category} className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-discord-text-muted uppercase tracking-wide">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {commands.map((command, commandIndex) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                        <motion.button
                          key={command.id}
                          whileHover={{ backgroundColor: 'hsl(var(--bg-elevated))' }}
                          onClick={command.action}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors",
                            isSelected && "bg-discord-bg-elevated"
                          )}
                        >
                          <div className="flex-shrink-0 text-discord-text-muted">
                            {command.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-discord-text-primary truncate">
                              {command.title}
                            </div>
                            {command.subtitle && (
                              <div className="text-small text-discord-text-muted truncate">
                                {command.subtitle}
                              </div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-discord-bg-elevated bg-discord-bg-tertiary">
            <div className="flex items-center justify-between text-xs text-discord-text-muted">
              <div className="flex items-center gap-4">
                <span>↑↓ навигация</span>
                <span>Enter выбрать</span>
                <span>Esc закрыть</span>
              </div>
              <span>Ctrl+K для быстрого поиска</span>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}