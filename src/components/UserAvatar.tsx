import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User } from '@/lib/types';

interface UserAvatarProps {
  user: User;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl'
};

const statusSizes = {
  xs: 'w-2 h-2',
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
  xl: 'w-4 h-4'
};

const statusColors = {
  online: 'bg-discord-status-online',
  idle: 'bg-discord-status-idle',
  dnd: 'bg-discord-status-dnd',
  offline: 'bg-discord-status-offline'
};

export function UserAvatar({ 
  user, 
  size = 'md', 
  showStatus = false, 
  className 
}: UserAvatarProps) {
  return (
    <div className={cn("relative flex-shrink-0", className)}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={cn(
          "rounded-full bg-discord-bg-elevated flex items-center justify-center font-medium overflow-hidden",
          sizeClasses[size]
        )}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-discord-text-primary">
            {user.displayName?.[0]?.toUpperCase() || '?'}
          </span>
        )}
      </motion.div>

      {showStatus && (
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-discord-bg-primary",
            statusSizes[size],
            statusColors[user.status]
          )}
        />
      )}
    </div>
  );
}