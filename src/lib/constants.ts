import type { User } from '@/types/editor';

export const ELEMENT_TYPES = {
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  LIST: 'list',
  LIST_ITEM: 'list-item',
  MENTION: 'mention',
  SPOILER: 'spoiler',
  BLOCKQUOTE: 'blockquote',
  CODE_BLOCK: 'code-block',
  INLINE_CODE: 'inline-code',
} as const;

export const SAMPLE_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '5',
    name: 'Alex Brown',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '7',
    name: 'Daniel Lee',
    email: 'daniel@example.com',
    avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '8',
    name: 'Olivia Martinez',
    email: 'olivia@example.com',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '9',
    name: 'Ethan Clark',
    email: 'ethan@example.com',
    avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: '10',
    name: 'Sophia Turner',
    email: 'sophia@example.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
  },
];