import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'ru-RU': {
    translation: {
      // Navigation
      servers: 'Серверы',
      channels: 'Каналы',
      friends: 'Друзья',
      settings: 'Настройки',
      
      // Channel types
      textChannel: 'Текстовый канал',
      voiceChannel: 'Голосовой канал',
      
      // Friends
      allFriends: 'Все',
      onlineFriends: 'В сети',
      pendingRequests: 'Запросы',
      blockedUsers: 'Заблокированные',
      addFriend: 'Добавить друга',
      addFriendPlaceholder: 'Введите имя пользователя',
      
      // Messages
      messageInput: 'Введите сообщение...',
      typingIndicator: '{{users}} печатает...',
      
      // Actions
      create: 'Создать',
      join: 'Присоединиться',
      invite: 'Пригласить',
      edit: 'Редактировать',
      delete: 'Удалить',
      reply: 'Ответить',
      pin: 'Закрепить',
      copyLink: 'Копировать ссылку',
      
      // Server actions
      createServer: 'Создать сервер',
      joinServer: 'Присоединиться к серверу',
      createChannel: 'Создать канал',
      
      // Status
      online: 'В сети',
      idle: 'Не активен',
      dnd: 'Не беспокоить',
      offline: 'Не в сети',
      
      // Voice/Video
      mute: 'Отключить микрофон',
      unmute: 'Включить микрофон',
      deafen: 'Отключить звук',
      undeafen: 'Включить звук',
      camera: 'Камера',
      screenShare: 'Демонстрация экрана',
      
      // Settings
      account: 'Аккаунт',
      privacy: 'Приватность',
      notifications: 'Уведомления',
      appearance: 'Внешний вид',
      voice: 'Голос и видео',
      hotkeys: 'Горячие клавиши',
      language: 'Язык',
      
      // Themes
      darkTheme: 'Тёмная тема',
      lightTheme: 'Светлая тема',
      
      // Search
      search: 'Поиск',
      searchMessages: 'Поиск сообщений',
      searchPlaceholder: 'Поиск...',
      
      // Common
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      cancel: 'Отмена',
      save: 'Сохранить',
    }
  },
  'en': {
    translation: {
      // Navigation
      servers: 'Servers',
      channels: 'Channels',
      friends: 'Friends',
      settings: 'Settings',
      
      // Channel types
      textChannel: 'Text Channel',
      voiceChannel: 'Voice Channel',
      
      // Friends
      allFriends: 'All',
      onlineFriends: 'Online',
      pendingRequests: 'Pending',
      blockedUsers: 'Blocked',
      addFriend: 'Add Friend',
      addFriendPlaceholder: 'Enter username',
      
      // Messages
      messageInput: 'Type a message...',
      typingIndicator: '{{users}} is typing...',
      
      // Actions
      create: 'Create',
      join: 'Join',
      invite: 'Invite',
      edit: 'Edit',
      delete: 'Delete',
      reply: 'Reply',
      pin: 'Pin',
      copyLink: 'Copy Link',
      
      // Server actions
      createServer: 'Create Server',
      joinServer: 'Join Server',
      createChannel: 'Create Channel',
      
      // Status
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      offline: 'Offline',
      
      // Voice/Video
      mute: 'Mute',
      unmute: 'Unmute',
      deafen: 'Deafen',
      undeafen: 'Undeafen',
      camera: 'Camera',
      screenShare: 'Screen Share',
      
      // Settings
      account: 'Account',
      privacy: 'Privacy',
      notifications: 'Notifications',
      appearance: 'Appearance',
      voice: 'Voice & Video',
      hotkeys: 'Hotkeys',
      language: 'Language',
      
      // Themes
      darkTheme: 'Dark Theme',
      lightTheme: 'Light Theme',
      
      // Search
      search: 'Search',
      searchMessages: 'Search Messages',
      searchPlaceholder: 'Search...',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru-RU',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;