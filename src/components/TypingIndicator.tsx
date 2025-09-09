import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

interface TypingIndicatorProps {
  userIds: string[];
}

export function TypingIndicator({ userIds }: TypingIndicatorProps) {
  const { servers, currentServerId, friends, currentUser } = useAppStore();

  const getUser = (userId: string) => {
    if (userId === currentUser?.id) return currentUser;
    
    // Try to find in current server members
    if (currentServerId) {
      const server = servers.find(s => s.id === currentServerId);
      const member = server?.members.find(m => m.id === userId);
      if (member) return member;
    }
    
    // Try to find in friends
    return friends.find(f => f.id === userId);
  };

  const typingUsers = userIds
    .map(getUser)
    .filter(Boolean)
    .slice(0, 3); // Show max 3 users

  if (typingUsers.length === 0) return null;

  const getUserNames = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]!.displayName} печатает`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]!.displayName} и ${typingUsers[1]!.displayName} печатают`;
    } else {
      return `${typingUsers[0]!.displayName}, ${typingUsers[1]!.displayName} и ещё ${typingUsers.length - 2} печатают`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 py-2 flex items-center gap-2 text-discord-text-muted"
    >
      <div className="flex gap-1">
        {typingUsers.map((user, index) => (
          <div
            key={user!.id}
            className="w-4 h-4 rounded-full bg-discord-bg-elevated flex items-center justify-center text-xs"
          >
            {user!.displayName[0].toUpperCase()}
          </div>
        ))}
      </div>
      
      <span className="text-small">{getUserNames()}</span>
      
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-discord-text-muted rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}