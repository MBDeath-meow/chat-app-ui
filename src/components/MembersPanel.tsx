import { motion } from 'framer-motion';
import { Crown, Shield, Users } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { UserAvatar } from './UserAvatar';
import { cn } from '@/lib/utils';

export function MembersPanel() {
  const { servers, currentServerId } = useAppStore();
  
  const currentServer = servers.find(s => s.id === currentServerId);
  
  if (!currentServer) return null;

  // Group members by role and status
  const groupedMembers = currentServer.members.reduce((groups, member) => {
    const role = member.roles?.[0] || { name: 'Участники', color: '#99aab5' };
    const roleKey = role.name;
    
    if (!groups[roleKey]) {
      groups[roleKey] = {
        role,
        online: [],
        offline: []
      };
    }
    
    if (member.status === 'offline') {
      groups[roleKey].offline.push(member);
    } else {
      groups[roleKey].online.push(member);
    }
    
    return groups;
  }, {} as Record<string, any>);

  const getRoleIcon = (roleName: string) => {
    if (roleName.includes('Админ') || roleName.includes('Владелец')) {
      return Crown;
    }
    if (roleName.includes('Модератор') || roleName.includes('Лид')) {
      return Shield;
    }
    return Users;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-discord-bg-elevated">
        <h3 className="font-semibold text-discord-text-primary">
          Участники — {currentServer.memberCount}
        </h3>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-2">
        {Object.entries(groupedMembers).map(([roleName, group]) => {
          const RoleIcon = getRoleIcon(roleName);
          const totalMembers = group.online.length + group.offline.length;
          
          return (
            <div key={roleName} className="mb-6">
              {/* Role Header */}
              <div className="flex items-center gap-2 px-2 py-1 mb-2">
                <RoleIcon className="h-3 w-3" style={{ color: group.role.color }} />
                <span 
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: group.role.color }}
                >
                  {roleName} — {totalMembers}
                </span>
              </div>

              {/* Online Members */}
              {group.online.map((member: any, index: number) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-discord-bg-elevated transition-colors cursor-pointer group"
                >
                  <UserAvatar user={member} size="sm" showStatus />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-medium text-small truncate"
                        style={{ color: group.role.color }}
                      >
                        {member.displayName}
                      </span>
                    </div>
                    {member.statusText && (
                      <p className="text-xs text-discord-text-muted truncate">
                        {member.statusText}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Offline Members */}
              {group.offline.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer px-2 py-1 text-xs text-discord-text-muted hover:text-discord-text-secondary">
                    Не в сети — {group.offline.length}
                  </summary>
                  <div className="mt-1">
                    {group.offline.map((member: any, index: number) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-discord-bg-elevated transition-colors cursor-pointer opacity-50"
                      >
                        <UserAvatar user={member} size="sm" showStatus />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-small text-discord-text-muted truncate">
                            {member.displayName}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}