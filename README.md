# Rich Text Editor with Mentions

A powerful, modern rich text editor built with **Slate.js**, **React**, and **TypeScript**. Features @mentions, rich formatting, emoji picker, and comprehensive text editing capabilities similar to Slack and Discord.

## Demo Video

![Demo](https://prodev-mob.github.io/rich-text-editor-nextjs/demo.gif)

---

## Features Included

### Core Functionality
- **@Mention System** - Type @ to mention users with real-time search and filtering
- **Rich Text Formatting** - Bold, italic, underline, inline code
- **Block Elements** - Headings, blockquotes, code blocks, lists
- **Emoji Picker** - 200+ emojis with interactive popup
- **Spoiler Text** - Click-to-reveal hidden content

### User Experience
- **Keyboard Navigation** - Arrow keys, Enter, Tab, Escape for mention selection
- **Real-time Search** - Filter users as you type in the mention popup
- **User Avatars** - Display profile pictures in mention dropdown
- **Responsive Design** - Works seamlessly on mobile and desktop
- **Custom Toolbar** - Easy access to all formatting options
- **Click Outside to Close** - Intuitive popup behavior

### Technical Features
- **TypeScript Support** - Fully typed for better developer experience
- **Performance Optimized** - Debounced updates, React.memo, deferred values
- **Data Serialization** - Convert content to/from string format with mention preservation
- **Extensible Architecture** - Easy to add new features and customize
- **Custom Element Types** - Support for various block and inline elements

---

## Tech Stack

- **Slate.js** - Rich text editing framework
- **React 18** - UI library with hooks
- **Next.js** - React framework
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Headless UI components (Popover)
- **React Icons** - Comprehensive icon library
- **Lodash** - Utility functions for data manipulation
- **Slate React** - React bindings for Slate
- **Slate History** - Undo/redo functionality

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd rich-text-editor

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the editor in action.

---

## Usage

### Basic Implementation

```tsx
'use client';

import { useState } from 'react';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { deserializeFromString } from '@/lib/editor';
import { SAMPLE_USERS } from '@/lib/constants';

export default function MyComponent() {
  const [content, setContent] = useState('');
  
  return (
    <RichTextEditor
      value={deserializeFromString(content, SAMPLE_USERS)}
      onChange={(value) => setContent(value)}
      placeholder="Start typing your message..."
      users={SAMPLE_USERS}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Descendant[]` | `[{ type: 'paragraph', children: [{ text: '' }] }]` | Editor content |
| `onChange` | `(value: string) => void` | - | Callback when content changes |
| `placeholder` | `string` | `"Type a message..."` | Placeholder text |
| `users` | `User[]` | `SAMPLE_USERS` | Array of users for mentions |
| `initialContent` | `string` | `''` | Initial serialized content |

### User Object Structure

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

---

## Keyboard Shortcuts

### Mention Popup
- **Arrow Down** - Navigate to next user
- **Arrow Up** - Navigate to previous user
- **Enter/Tab** - Select highlighted user
- **Escape** - Close mention popup

---

## Data Serialization

The editor uses a custom serialization format to preserve mentions and formatting:

### Serialized Format

```
<column id='user-id'>Username</column> regular text
```

### Example

```tsx
import { serializeToString, deserializeFromString } from '@/lib/editor';

// Serialize editor content
const serialized = serializeToString(editorValue);
// Output: "<column id='1'>John Doe</column> said hello"

// Deserialize to editor format
const deserialized = deserializeFromString(serialized, users);
```

---

## Customization

### Adding Custom Users

```tsx
const myUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  },
  // Add more users...
];

<RichTextEditor users={myUsers} />
```

### Styling

The editor uses Tailwind CSS. You can customize styles by:

    1. Modifying component class names
    2. Updating `tailwind.config.js`
    3. Overriding styles in your CSS

### Adding New Block Types

Extend the `CustomElement` type in `types/editor.ts` and add rendering logic in `CustomElement.tsx`.

---

## Project Structure

```
├── app/
│   └── page.tsx                    # Main page component
├── components/
│   ├── editor/
│   │   ├── RichTextEditor.tsx     # Main editor component
│   │   ├── Toolbar.tsx            # Formatting toolbar
│   │   └── elements/
│   │       ├── CustomElement.tsx  # Block element renderer
│   │       ├── MentionElement.tsx # Mention component
│   │       ├── MentionPopup.tsx   # Mention dropdown
│   │       └── renderLeaf.tsx     # Inline formatting
│   ├── ui/
│   │   ├── Avatar.tsx             # Avatar component
│   │   └── Button.tsx             # Button component
│   └── EmojiPicker.tsx            # Emoji picker
├── lib/
│   ├── constants.ts               # Sample users & constants
│   ├── editor.ts                  # Editor utilities & logic
│   ├── formatting.ts              # Text formatting helpers
│   ├── markdown.ts                # Markdown support
│   └── utils.ts                   # General utilities
└── types/
    └── editor.ts                  # TypeScript definitions
```

---

## Features Checklist

- @mention functionality (like Slack/Discord)
- Rich text formatting (bold, italic, underline)
- Headings, blockquotes, and lists
- Keyboard navigation for mentions
- User avatars in mention popup
- Real-time search in mentions
- Emoji picker with 200+ emojis
- Spoiler text (click to reveal)
- Inline code and code blocks
- TypeScript support
- Tailwind CSS styling
- Custom toolbar with formatting options
- Responsive design (mobile-friendly)
- Performance optimized (debouncing, memoization)
- Data serialization/deserialization
- Click-outside to close mention popup

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Considerations

The editor implements several optimizations:

- **Debounced onChange** (100ms) - Reduces re-renders
- **Debounced mention detection** (50ms) - Smooth mention popup
- **React.memo** - Prevents unnecessary component updates
- **useDeferredValue** - Non-blocking UI updates
- **Lodash utilities** - Efficient data operations

---

## Known Limitations

- No localStorage/sessionStorage support in artifacts
- Limited to in-memory state management
- External scripts must be from cdnjs.cloudflare.com

---

## Acknowledgments

- Built with [Slate.js](https://github.com/ianstormtaylor/slate)
- Inspired by Slack and Discord messaging interfaces
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- UI components from [Radix UI](https://www.radix-ui.com/)