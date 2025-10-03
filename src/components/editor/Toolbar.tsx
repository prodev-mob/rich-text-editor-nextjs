import { useSlate } from 'slate-react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaCode,
  FaHeading,
  FaQuoteLeft,
} from 'react-icons/fa';
import { MdOutlineVisibilityOff } from 'react-icons/md';
import Button from '@/components/ui/Button';
import { isMarkActive, toggleMark, toggleBlock, isBlockActive } from '@/lib/editor';
import React from 'react';

const Toolbar = React.memo(() => {
  const editor = useSlate();
  const iconClass = "w-4 h-4 text-gray-700";

  const marks = [
    { format: 'bold', icon: FaBold, title: 'Bold' },
    { format: 'italic', icon: FaItalic, title: 'Italic' },
    { format: 'underline', icon: FaUnderline, title: 'Underline' },
    { format: 'code', icon: FaCode, title: 'Inline Code' },
    { format: 'spoiler', icon: MdOutlineVisibilityOff, title: 'Spoiler' },
  ];

  const blocks = [
    { format: 'heading', level: 1, icon: FaHeading, title: 'Heading' },
    // { format: 'list', icon: FaListUl, title: 'Bullet List' },
    { format: 'blockquote', icon: FaQuoteLeft, title: 'Blockquote' },
    // { format: 'code-block', icon: MdOutlineTextFields, title: 'Code Block' },
  ];

  return (
    <div className="flex flex-wrap items-center pr-8 gap-1 p-2 border-b border-gray-300 bg-gray-50 rounded-t-lg">
      {marks.map(({ format, icon: Icon, title }) => (
        <Button
          className="cursor-pointer"
          key={format}
          variant={isMarkActive(editor, format) ? 'default' : 'outline'}
          size="sm"
          onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, format);
          }}
          title={title}
        >
          <Icon className={iconClass} />
        </Button>
      ))}
      <div className="w-px h-6 bg-gray-300 mx-1" />
      {blocks.map(({ format, level, icon: Icon, title }) => (
        <Button
          className="cursor-pointer"
          key={format + (level || '')}
          variant={isBlockActive(editor, format) ? 'default' : 'outline'}
          size="sm"
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBlock(editor, format, level);
          }}
          title={title}
        >
          <Icon className={iconClass} />
        </Button>
      ))}
    </div>
  );
});
Toolbar.displayName = 'Toolbar';

export default Toolbar;