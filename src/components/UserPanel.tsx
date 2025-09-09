import { motion } from 'framer-motion';
import { Mic, MicOff, Headphones, HeadphonesIcon, Settings, Phone, PhoneOff } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { UserAvatar } from './UserAvatar';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function UserPanel() {
  const { currentUser, voiceStates, muteUser, deafenUser } = useAppStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [inCall, setInCall] = useState(false);

  if (!currentUser) return null;

  const userVoiceState = voiceStates.find(vs => vs.userId === currentUser.id);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    muteUser(currentUser.id);
  };

  const handleDeafenToggle = () => {
    setIsDeafened(!isDeafened);
    deafenUser(currentUser.id);
  };

  const handleCallToggle = () => {
    setInCall(!inCall);
  };

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-[60px] bg-discord-bg-tertiary border-t border-discord-bg-elevated flex items-center justify-between px-2"
    >
      {/* User Info */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <UserAvatar user={currentUser} size="sm" showStatus />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-small text-discord-text-primary truncate">
            {currentUser.displayName}
          </div>
          <div className="text-xs text-discord-text-muted truncate">
            {currentUser.statusText || currentUser.username}
          </div>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex items-center gap-1">
        {/* Mic Control */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-8 h-8 rounded hover-scale",
            isMuted && "bg-destructive hover:bg-destructive/80"
          )}
          onClick={handleMuteToggle}
        >
          {isMuted ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>

        {/* Headphones Control */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-8 h-8 rounded hover-scale",
            isDeafened && "bg-destructive hover:bg-destructive/80"
          )}
          onClick={handleDeafenToggle}
        >
          {isDeafened ? (
            <HeadphonesIcon className="h-4 w-4" />
          ) : (
            <Headphones className="h-4 w-4" />
          )}
        </Button>

        {/* Call Control */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-8 h-8 rounded hover-scale",
            inCall && "bg-success hover:bg-success/80"
          )}
          onClick={handleCallToggle}
        >
          {inCall ? (
            <PhoneOff className="h-4 w-4" />
          ) : (
            <Phone className="h-4 w-4" />
          )}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded hover-scale"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}