import { motion } from 'framer-motion';
import { Plus, Hash } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function ServerRail() {
  const { servers, currentServerId, setCurrentServer, setCurrentDM } = useAppStore();

  const handleServerClick = (serverId: string) => {
    setCurrentServer(serverId);
  };

  const handleDirectMessagesClick = () => {
    setCurrentDM('friends');
  };

  return (
    <div className="flex flex-col items-center py-3 gap-2 h-full">
      {/* Direct Messages Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-12 h-12 rounded-3xl bg-discord-bg-primary hover:bg-primary hover:rounded-2xl transition-all duration-200",
                !currentServerId && "bg-primary rounded-2xl"
              )}
              onClick={handleDirectMessagesClick}
            >
              <Hash className="h-6 w-6" />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Личные сообщения</p>
        </TooltipContent>
      </Tooltip>

      {/* Separator */}
      <div className="w-8 h-0.5 bg-discord-bg-elevated rounded-full" />

      {/* Server List */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {servers.map((server, index) => (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-12 h-12 rounded-3xl bg-discord-bg-primary hover:bg-primary hover:rounded-2xl transition-all duration-200 relative group",
                    currentServerId === server.id && "bg-primary rounded-2xl"
                  )}
                  onClick={() => handleServerClick(server.id)}
                >
                  {server.icon ? (
                    <span className="text-2xl">{server.icon}</span>
                  ) : (
                    <span className="font-semibold text-lg">
                      {server.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  
                  {/* Unread indicator */}
                  {server.categories.some(cat => 
                    cat.channels.some(ch => ch.unreadCount && ch.unreadCount > 0)
                  ) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        {server.categories
                          .flatMap(cat => cat.channels)
                          .reduce((sum, ch) => sum + (ch.unreadCount || 0), 0)}
                      </span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{server.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Add Server Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-3xl bg-discord-bg-primary hover:bg-success hover:rounded-2xl transition-all duration-200"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Добавить сервер</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}