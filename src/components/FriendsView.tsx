import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, UserPlus, Search, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAvatar } from './UserAvatar';
import { cn } from '@/lib/utils';

export function FriendsView() {
  const { 
    friends, 
    friendRequests, 
    blockedUsers,
    setCurrentDM,
    directMessages,
    currentUser
  } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newFriendInput, setNewFriendInput] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter(friend => friend.status !== 'offline');

  const handleSendMessage = (friendId: string) => {
    // Find existing DM or create new one
    let dm = directMessages.find(dm => 
      dm.participants.includes(friendId) && 
      dm.participants.includes(currentUser?.id || '')
    );
    
    if (dm) {
      setCurrentDM(dm.id);
    } else {
      // Create new DM (in real app, this would be an API call)
      const newDMId = `dm_${Date.now()}`;
      setCurrentDM(newDMId);
    }
  };

  const FriendItem = ({ friend, showMessageButton = true }: { friend: any, showMessageButton?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-3 border-b border-discord-bg-elevated hover:bg-discord-bg-elevated/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <UserAvatar user={friend} size="md" showStatus />
        <div>
          <h4 className="font-medium text-discord-text-primary">
            {friend.displayName}
          </h4>
          <p className="text-small text-discord-text-muted">
            {friend.username}
          </p>
          {friend.statusText && (
            <p className="text-xs text-discord-text-muted">
              {friend.statusText}
            </p>
          )}
        </div>
      </div>
      
      {showMessageButton && (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => handleSendMessage(friend.id)}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-discord-bg-primary">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-discord-bg-elevated">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-discord-text-muted" />
          <h1 className="font-semibold text-discord-text-primary">Друзья</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-discord-text-muted" />
            <Input
              placeholder="Поиск друзей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-60 bg-discord-bg-secondary border-none"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Tabs defaultValue="all" className="h-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 mb-6">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="online">В сети</TabsTrigger>
            <TabsTrigger value="pending">Запросы</TabsTrigger>
            <TabsTrigger value="blocked">Заблокированы</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-discord-text-primary">
                  Все друзья — {filteredFriends.length}
                </h2>
              </div>
              
              <div className="bg-discord-bg-secondary rounded-lg overflow-hidden">
                {filteredFriends.length === 0 ? (
                  <div className="p-8 text-center text-discord-text-muted">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Друзей не найдено</p>
                  </div>
                ) : (
                  filteredFriends.map(friend => (
                    <FriendItem key={friend.id} friend={friend} />
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="online" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-discord-text-primary">
                  В сети — {onlineFriends.length}
                </h2>
              </div>
              
              <div className="bg-discord-bg-secondary rounded-lg overflow-hidden">
                {onlineFriends.length === 0 ? (
                  <div className="p-8 text-center text-discord-text-muted">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ни один из друзей не в сети</p>
                  </div>
                ) : (
                  onlineFriends.map(friend => (
                    <FriendItem key={friend.id} friend={friend} />
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-discord-text-primary">
                  Входящие запросы — {friendRequests.length}
                </h2>
              </div>

              {/* Add Friend */}
              <div className="bg-discord-bg-secondary rounded-lg p-4">
                <h3 className="font-medium text-discord-text-primary mb-3">
                  Добавить друга
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите имя пользователя"
                    value={newFriendInput}
                    onChange={(e) => setNewFriendInput(e.target.value)}
                    className="flex-1 bg-discord-bg-primary border-none"
                  />
                  <Button disabled={!newFriendInput.trim()}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Отправить запрос
                  </Button>
                </div>
              </div>
              
              <div className="bg-discord-bg-secondary rounded-lg overflow-hidden">
                {friendRequests.length === 0 ? (
                  <div className="p-8 text-center text-discord-text-muted">
                    <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Нет входящих запросов</p>
                  </div>
                ) : (
                  friendRequests.map(request => (
                    <FriendItem key={request.id} friend={request} showMessageButton={false} />
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="blocked" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-discord-text-primary">
                  Заблокированные — {blockedUsers.length}
                </h2>
              </div>
              
              <div className="bg-discord-bg-secondary rounded-lg overflow-hidden">
                {blockedUsers.length === 0 ? (
                  <div className="p-8 text-center text-discord-text-muted">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Заблокированных пользователей нет</p>
                  </div>
                ) : (
                  blockedUsers.map(user => (
                    <FriendItem key={user.id} friend={user} showMessageButton={false} />
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}