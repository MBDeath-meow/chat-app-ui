import { Server, User, Message, DirectMessage, AppState } from './types';

const avatarUrls = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
];

const russianNames = [
  'Алексей_dev', 'Мария_UI', 'Дмитрий_code', 'Елена_design', 'Андрей_tech',
  'Светлана_art', 'Игорь_games', 'Наталья_music', 'Владимир_photo', 'Ирина_video',
  'Сергей_stream', 'Юлия_draw', 'Александр_code', 'Екатерина_ui', 'Михаил_dev',
  'Ольга_design', 'Павел_tech', 'Анна_creative', 'Роман_gaming', 'Виктория_art',
  'Константин_dev', 'Любовь_design', 'Максим_stream', 'Татьяна_music', 'Валерий_photo'
];

const channelNames = {
  general: ['общий', 'приветствие', 'объявления', 'правила', 'новости'],
  dev: ['разработка', 'код-ревью', 'баги', 'фичи', 'релизы', 'тестирование'],
  design: ['дизайн', 'ui-kit', 'макеты', 'иконки', 'типографика'],
  random: ['случайное', 'мемы', 'флуд', 'оффтоп', 'юмор'],
  voice: ['общение', 'созвоны', 'стримы', 'игры', 'музыка']
};

const messageTemplates = [
  'Привет всем! Как дела?',
  'Кто-нибудь может помочь с этой задачей?',
  'Отличная работа над последним релизом!',
  'Не забудьте про встречу в 15:00',
  'Нашел интересную статью, делюсь ссылкой',
  'Кофе-брейк через 10 минут, кто с нами?',
  'Проверьте, пожалуйста, мой PR',
  'Завтра планируем демо новой фичи',
  'Кто играл в новую игру? Впечатления?',
  'Хорошие выходные! До встречи в понедельник',
  'Нужна помощь с дизайном кнопки',
  'Код выглядит отлично, одобряю!',
  'Не могу подключиться к серверу, у кого-то такая же проблема?',
  'Завершили спринт досрочно, отлично!',
  'Кто-то видел новое обновление?',
  '🎉 Поздравляю с успешным релизом!',
  'Делюсь скриншотом прогресса',
  'Вопрос по API, можем обсудить?',
  'Планируем хакатон на следующих выходных',
  'Кто хочет поработать над pet-проектом?'
];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    username: russianNames[i % russianNames.length],
    displayName: russianNames[i % russianNames.length].split('_')[0],
    avatar: avatarUrls[i % avatarUrls.length],
    status: randomChoice(['online', 'idle', 'dnd', 'offline'] as const),
    joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

function generateMessages(channelId: string, users: User[], count: number = 25): Message[] {
  return Array.from({ length: count }, (_, i) => {
    const author = randomChoice(users);
    const timestamp = new Date(Date.now() - (count - i) * 60000 + Math.random() * 30000);
    
    return {
      id: generateId(),
      content: randomChoice(messageTemplates),
      authorId: author.id,
      channelId,
      timestamp: timestamp.toISOString(),
      type: 'default' as const,
      reactions: Math.random() > 0.7 ? [
        {
          emoji: randomChoice(['👍', '❤️', '😄', '🎉', '👀']),
          count: Math.floor(Math.random() * 5) + 1,
          users: [randomChoice(users).id]
        }
      ] : [],
      pinned: Math.random() > 0.9
    };
  });
}

export function generateMockData(): Pick<AppState, 'currentUser' | 'servers' | 'friends' | 'directMessages' | 'messages'> {
  const users = generateUsers(25);
  const currentUser = users[0];
  
  const servers: Server[] = [
    {
      id: generateId(),
      name: 'React Разработчики',
      icon: '⚛️',
      ownerId: users[1].id,
      memberCount: 15,
      members: users.slice(0, 15),
      roles: [
        { id: generateId(), name: 'Админ', color: '#ff0000', permissions: ['admin'] },
        { id: generateId(), name: 'Модератор', color: '#00ff00', permissions: ['moderate'] },
        { id: generateId(), name: 'Разработчик', color: '#0000ff', permissions: ['developer'] }
      ],
      categories: [
        {
          id: generateId(),
          name: 'ИНФОРМАЦИЯ',
          channels: [
            { id: generateId(), name: 'объявления', type: 'text', position: 0, unreadCount: 2 },
            { id: generateId(), name: 'правила', type: 'text', position: 1 },
            { id: generateId(), name: 'новости', type: 'text', position: 2, unreadCount: 5 }
          ]
        },
        {
          id: generateId(),
          name: 'РАЗРАБОТКА',
          channels: [
            { id: generateId(), name: 'общий', type: 'text', position: 0, unreadCount: 12 },
            { id: generateId(), name: 'код-ревью', type: 'text', position: 1 },
            { id: generateId(), name: 'баги', type: 'text', position: 2, unreadCount: 3 },
            { id: generateId(), name: 'фичи', type: 'text', position: 3 }
          ]
        },
        {
          id: generateId(),
          name: 'ГОЛОСОВЫЕ',
          channels: [
            { id: generateId(), name: 'общение', type: 'voice', position: 0 },
            { id: generateId(), name: 'созвоны', type: 'voice', position: 1 },
            { id: generateId(), name: 'стримы', type: 'voice', position: 2 }
          ]
        }
      ]
    },
    {
      id: generateId(),
      name: 'Дизайн Комьюнити',
      icon: '🎨',
      ownerId: users[2].id,
      memberCount: 12,
      members: users.slice(5, 17),
      roles: [
        { id: generateId(), name: 'Лид', color: '#purple', permissions: ['lead'] },
        { id: generateId(), name: 'Дизайнер', color: '#pink', permissions: ['design'] }
      ],
      categories: [
        {
          id: generateId(),
          name: 'ДИЗАЙН',
          channels: [
            { id: generateId(), name: 'общий', type: 'text', position: 0 },
            { id: generateId(), name: 'ui-kit', type: 'text', position: 1, unreadCount: 1 },
            { id: generateId(), name: 'макеты', type: 'text', position: 2 },
            { id: generateId(), name: 'иконки', type: 'text', position: 3 }
          ]
        },
        {
          id: generateId(),
          name: 'ОБРАТНАЯ СВЯЗЬ',
          channels: [
            { id: generateId(), name: 'фидбек', type: 'text', position: 0 },
            { id: generateId(), name: 'идеи', type: 'text', position: 1, unreadCount: 7 }
          ]
        }
      ]
    },
    {
      id: generateId(),
      name: 'Геймеры',
      icon: '🎮',
      ownerId: users[3].id,
      memberCount: 20,
      members: users.slice(10, 25),
      roles: [
        { id: generateId(), name: 'Про-геймер', color: '#gold', permissions: ['pro'] },
        { id: generateId(), name: 'Стример', color: '#purple', permissions: ['stream'] }
      ],
      categories: [
        {
          id: generateId(),
          name: 'ИГРЫ',
          channels: [
            { id: generateId(), name: 'общий', type: 'text', position: 0, unreadCount: 25 },
            { id: generateId(), name: 'поиск-команды', type: 'text', position: 1, unreadCount: 8 },
            { id: generateId(), name: 'стримы', type: 'text', position: 2 }
          ]
        },
        {
          id: generateId(),
          name: 'ГОЛОСОВЫЕ',
          channels: [
            { id: generateId(), name: 'игры', type: 'voice', position: 0 },
            { id: generateId(), name: 'чилл', type: 'voice', position: 1 }
          ]
        }
      ]
    }
  ];

  // Generate messages for all channels
  const messages: Record<string, Message[]> = {};
  servers.forEach(server => {
    server.categories.forEach(category => {
      category.channels.forEach(channel => {
        if (channel.type === 'text') {
          messages[channel.id] = generateMessages(channel.id, server.members);
        }
      });
    });
  });

  // Generate direct messages
  const directMessages: DirectMessage[] = [
    { id: generateId(), participants: [currentUser.id, users[1].id], unreadCount: 3 },
    { id: generateId(), participants: [currentUser.id, users[2].id] },
    { id: generateId(), participants: [currentUser.id, users[3].id, users[4].id], unreadCount: 1 }
  ];

  // Generate messages for DMs
  directMessages.forEach(dm => {
    const participants = users.filter(u => dm.participants.includes(u.id));
    messages[dm.id] = generateMessages(dm.id, participants, 15);
  });

  return {
    currentUser,
    servers,
    friends: users.slice(1, 8),
    directMessages,
    messages
  };
}