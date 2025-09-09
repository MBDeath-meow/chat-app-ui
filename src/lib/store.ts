import { create } from 'zustand';
import { AppState, User, Server, Message, Channel } from './types';
import { generateMockData } from './mockData';

interface AppStore extends AppState {
  // Actions
  setCurrentUser: (user: User) => void;
  setCurrentServer: (serverId: string) => void;
  setCurrentChannel: (channelId: string) => void;
  setCurrentDM: (dmId: string) => void;
  addMessage: (message: Message) => void;
  toggleTheme: () => void;
  setLanguage: (language: string) => void;
  toggleMembers: () => void;
  toggleThread: () => void;
  setSearchQuery: (query: string) => void;
  addTypingUser: (channelId: string, userId: string) => void;
  removeTypingUser: (channelId: string, userId: string) => void;
  muteUser: (userId: string) => void;
  deafenUser: (userId: string) => void;
  joinVoiceChannel: (channelId: string, userId: string) => void;
  leaveVoiceChannel: (userId: string) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  togglePin: (messageId: string) => void;
  addFriend: (user: User) => void;
  removeFriend: (userId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  markChannelRead: (channelId: string) => void;
}

const mockData = generateMockData();

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  currentUser: mockData.currentUser,
  servers: mockData.servers,
  currentServerId: mockData.servers[0]?.id,
  currentChannelId: mockData.servers[0]?.categories[0]?.channels[0]?.id,
  directMessages: mockData.directMessages,
  currentDMId: undefined,
  messages: mockData.messages,
  voiceStates: [],
  theme: 'dark',
  language: 'ru-RU',
  friends: mockData.friends,
  friendRequests: [],
  blockedUsers: [],
  typingUsers: {},
  searchQuery: '',
  showMembers: true,
  showThread: false,
  activeThread: undefined,

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setCurrentServer: (serverId) => set({ 
    currentServerId: serverId,
    currentDMId: undefined 
  }),
  
  setCurrentChannel: (channelId) => {
    const state = get();
    const channel = state.servers
      .find(s => s.id === state.currentServerId)
      ?.categories
      .flatMap(c => c.channels)
      .find(ch => ch.id === channelId);
    
    if (channel) {
      set({ 
        currentChannelId: channelId,
        currentDMId: undefined 
      });
    }
  },
  
  setCurrentDM: (dmId) => set({ 
    currentDMId: dmId,
    currentChannelId: undefined 
  }),
  
  addMessage: (message) => set((state) => ({
    messages: {
      ...state.messages,
      [message.channelId]: [
        ...(state.messages[message.channelId] || []),
        message
      ]
    }
  })),
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'dark' ? 'light' : 'dark'
  })),
  
  setLanguage: (language) => set({ language }),
  
  toggleMembers: () => set((state) => ({
    showMembers: !state.showMembers
  })),
  
  toggleThread: () => set((state) => ({
    showThread: !state.showThread
  })),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  addTypingUser: (channelId, userId) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [channelId]: [...(state.typingUsers[channelId] || []), userId]
        .filter((id, index, arr) => arr.indexOf(id) === index)
    }
  })),
  
  removeTypingUser: (channelId, userId) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [channelId]: (state.typingUsers[channelId] || [])
        .filter(id => id !== userId)
    }
  })),
  
  muteUser: (userId) => set((state) => ({
    voiceStates: state.voiceStates.map(vs => 
      vs.userId === userId ? { ...vs, muted: !vs.muted } : vs
    )
  })),
  
  deafenUser: (userId) => set((state) => ({
    voiceStates: state.voiceStates.map(vs => 
      vs.userId === userId ? { ...vs, deafened: !vs.deafened } : vs
    )
  })),
  
  joinVoiceChannel: (channelId, userId) => set((state) => ({
    voiceStates: [
      ...state.voiceStates.filter(vs => vs.userId !== userId),
      { userId, channelId, muted: false, deafened: false, speaking: false }
    ]
  })),
  
  leaveVoiceChannel: (userId) => set((state) => ({
    voiceStates: state.voiceStates.filter(vs => vs.userId !== userId)
  })),
  
  addReaction: (messageId, emoji, userId) => set((state) => ({
    messages: Object.fromEntries(
      Object.entries(state.messages).map(([channelId, msgs]) => [
        channelId,
        msgs.map(msg => 
          msg.id === messageId 
            ? {
                ...msg,
                reactions: [
                  ...(msg.reactions || []).filter(r => r.emoji !== emoji),
                  {
                    emoji,
                    count: ((msg.reactions || []).find(r => r.emoji === emoji)?.count || 0) + 1,
                    users: [
                      ...((msg.reactions || []).find(r => r.emoji === emoji)?.users || []),
                      userId
                    ].filter((id, index, arr) => arr.indexOf(id) === index)
                  }
                ]
              }
            : msg
        )
      ])
    )
  })),
  
  togglePin: (messageId) => set((state) => ({
    messages: Object.fromEntries(
      Object.entries(state.messages).map(([channelId, msgs]) => [
        channelId,
        msgs.map(msg => 
          msg.id === messageId 
            ? { ...msg, pinned: !msg.pinned }
            : msg
        )
      ])
    )
  })),
  
  addFriend: (user) => set((state) => ({
    friends: [...state.friends, user],
    friendRequests: state.friendRequests.filter(req => req.id !== user.id)
  })),
  
  removeFriend: (userId) => set((state) => ({
    friends: state.friends.filter(friend => friend.id !== userId)
  })),
  
  blockUser: (userId) => set((state) => {
    const user = state.friends.find(friend => friend.id === userId);
    return {
      blockedUsers: user ? [...state.blockedUsers, user] : state.blockedUsers,
      friends: state.friends.filter(friend => friend.id !== userId)
    };
  }),
  
  unblockUser: (userId) => set((state) => ({
    blockedUsers: state.blockedUsers.filter(user => user.id !== userId)
  })),
  
  markChannelRead: (channelId) => set((state) => ({
    servers: state.servers.map(server => ({
      ...server,
      categories: server.categories.map(category => ({
        ...category,
        channels: category.channels.map(channel => 
          channel.id === channelId 
            ? { ...channel, unreadCount: 0 }
            : channel
        )
      }))
    }))
  }))
}));