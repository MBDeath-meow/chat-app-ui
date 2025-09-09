import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ServerRail } from './ServerRail';
import { ChannelSidebar } from './ChannelSidebar';
import { ChatView } from './ChatView';
import { MembersPanel } from './MembersPanel';
import { FriendsView } from './FriendsView';
import { UserPanel } from './UserPanel';
import { CommandPalette } from './CommandPalette';
import { useHotkeys } from '@/hooks/useHotkeys';
import { cn } from '@/lib/utils';

export function AppShell() {
  const { 
    currentServerId, 
    currentChannelId, 
    currentDMId, 
    showMembers,
    theme,
    toggleTheme
  } = useAppStore();

  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Hotkeys
  useHotkeys([
    {
      key: 'k',
      ctrlKey: true,
      callback: () => setShowCommandPalette(true)
    },
    {
      key: 'Escape',
      callback: () => setShowCommandPalette(false)
    },
    {
      key: 't',
      ctrlKey: true,
      shiftKey: true,
      callback: () => toggleTheme()
    }
  ]);

  const showChat = currentChannelId || currentDMId;
  const showChannelSidebar = currentServerId && !currentDMId;
  const showFriends = !currentServerId && !currentDMId;

  return (
    <div className={cn("h-screen flex flex-col", theme)}>
      {/* Main Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Server Rail */}
        <div className="w-[72px] bg-discord-bg-tertiary flex flex-col">
          <ServerRail />
        </div>

        {/* Channel Sidebar */}
        {showChannelSidebar && (
          <motion.div
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -240, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-60 bg-discord-bg-secondary"
          >
            <ChannelSidebar />
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {showFriends ? (
            <FriendsView />
          ) : showChat ? (
            <div className="flex h-full">
              {/* Chat View */}
              <div className="flex-1 flex flex-col min-w-0">
                <ChatView />
              </div>

              {/* Members Panel */}
              {showMembers && currentServerId && (
                <motion.div
                  initial={{ x: 240, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 240, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="w-60 bg-discord-bg-secondary border-l border-discord-bg-elevated"
                >
                  <MembersPanel />
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-discord-bg-primary">
              <div className="text-center text-discord-text-muted">
                <h2 className="text-2xl font-semibold mb-2">Выберите канал</h2>
                <p>Выберите канал из списка слева, чтобы начать общение</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Panel */}
      <UserPanel />

      {/* Command Palette */}
      <CommandPalette 
        open={showCommandPalette} 
        onOpenChange={setShowCommandPalette} 
      />
    </div>
  );
}