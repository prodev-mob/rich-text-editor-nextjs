'use client';

import React, { useCallback, useMemo, useState, useRef, useEffect, useDeferredValue } from 'react';
import { createEditor, Descendant, BaseEditor, Editor, Transforms, Range } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { withMentions, getMentionRange, insertMention, serializeToString, deserializeFromString } from '@/lib/editor';
import { SAMPLE_USERS } from '@/lib/constants';
import { User, CustomText, CustomElement as CustomElementType } from '@/types/editor';
import Toolbar from './Toolbar';
import MentionPopup from './elements/MentionPopup';
import CustomElement from './elements/CustomElement';
import { renderLeaf } from './elements/renderLeaf';
import EmojiPicker from '@/components/EmojiPicker';
import { debounce } from 'lodash';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElementType;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

interface RichTextEditorProps {
  value?: Descendant[];
  onChange?: (value: string) => void;
  placeholder?: string;
  users?: User[];
  initialContent?: string;
}

const RichTextEditor = React.memo(({
  onChange,
  placeholder = 'Type a message...',
  users = SAMPLE_USERS,
  initialContent = '',
}: RichTextEditorProps) => {
  const editor = useMemo(() => withMentions(withHistory(withReact(createEditor()))), []);
  const initialEditorValue = useMemo(
    () => (initialContent ? deserializeFromString(initialContent, users) : initialValue),
    [initialContent, users]
  );
  const [mentionTarget, setMentionTarget] = useState<Range | null>(null);
  const [mentionSearch, setMentionSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const deferredMentionTarget = useDeferredValue(mentionTarget);
  const deferredMentionSearch = useDeferredValue(mentionSearch);
  const deferredSelectedIndex = useDeferredValue(selectedIndex);
  const deferredPopupPosition = useDeferredValue(popupPosition);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getMentionPopupPosition = useCallback(() => {
    if (!editor.selection || !ReactEditor.isFocused(editor)) {
      return null;
    }
    try {
      const domRange = ReactEditor.toDOMRange(editor, editor.selection);
      const rect = domRange.getBoundingClientRect();
      return { top: rect.bottom + 8, left: rect.left + 7 };
    } catch (error) {
      console.error('Error calculating mention popup position:', error);
      return null;
    }
  }, [editor]);

  const debouncedUpdatePosition = useMemo(
    () => debounce(() => {
      if (mentionTarget) {
        setPopupPosition(getMentionPopupPosition());
      }
    }, 50),
    [mentionTarget, getMentionPopupPosition]
  );

  const debouncedOnChange = useMemo(
    () => debounce((newValue: Descendant[]) => {
      const serializedContent = serializeToString(newValue);
      onChange?.(serializedContent);
    }, 100),
    [onChange]
  );
  RichTextEditor.displayName = "RichTextEditor";
  const debouncedMentionCheck = useMemo(
    () => debounce((editor: Editor, getMentionPopupPosition: () => { top: number; left: number } | null) => {
      const { selection } = editor;
      if (selection && Range.isCollapsed(selection)) {
        try {
          const mentionData = getMentionRange(editor, '@');
          if (mentionData) {
            setMentionTarget(mentionData.range);
            setMentionSearch(mentionData.search ?? '');
            setSelectedIndex(0);
            setPopupPosition(getMentionPopupPosition());
          } else {
            setMentionTarget(null);
            setMentionSearch('');
            setSelectedIndex(0);
            setPopupPosition(null);
          }
        } catch (error) {
          console.error('Error in getMentionRange:', error);
          setMentionTarget(null);
          setMentionSearch('');
          setSelectedIndex(0);
          setPopupPosition(null);
        }
      } else {
        setMentionTarget(null);
        setMentionSearch('');
        setSelectedIndex(0);
        setPopupPosition(null);
      }
    }, 50),
    []
  );
  useEffect(() => {
    if (!mentionTarget || !scrollRef.current) return;

    const scrollEl = scrollRef.current; // ✅ copy ref once
    const handleScroll = () => debouncedUpdatePosition();

    scrollEl.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);

    return () => {
      scrollEl.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
      debouncedUpdatePosition.cancel();
    };
  }, [mentionTarget, debouncedUpdatePosition]);


  useEffect(() => {
    if (editor && !ReactEditor.isFocused(editor)) {
      ReactEditor.focus(editor);
    }
  }, [editor]);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      // Skip empty or invalid updates
      if (!newValue || newValue.length === 0) {
        newValue = initialValue;
      }
      if (
        newValue.length === 1 &&
        'children' in newValue[0] &&
        Array.isArray(newValue[0].children) &&
        newValue[0].children.length === 0
      ) {
        newValue = initialValue;
      }

      // Trigger debounced onChange
      debouncedOnChange(newValue);

      // Clear marks if editor is empty
      let isEmpty = true;
      try {
        isEmpty = Editor.string(editor, []).trim() === '';
      } catch {
        isEmpty = true;
      }
      if (isEmpty) {
        const marks = Editor.marks(editor) || {};
        Object.keys(marks).forEach((mark) => {
          if (mark !== 'color') {
            Editor.removeMark(editor, mark);
          }
        });
      }


      // Defer mention detection
      debouncedMentionCheck(editor, getMentionPopupPosition);
    },
    [editor, debouncedOnChange, getMentionPopupPosition, debouncedMentionCheck]
  );

  const handleMentionSelect = useCallback(
    (user: User) => {
      if (mentionTarget) {
        Editor.withoutNormalizing(editor, () => {
          Transforms.select(editor, mentionTarget);
          insertMention(editor, user);
          setMentionTarget(null);
          setMentionSearch('');
          setSelectedIndex(0);
          setPopupPosition(null);
          ReactEditor.focus(editor);
        });
      }
    },
    [editor, mentionTarget]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!mentionTarget) return;
      const filteredUsers = users.filter((u) =>
        mentionSearch === ''
          ? true
          : u.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(mentionSearch.toLowerCase())
      );
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) => (prev < filteredUsers.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
        case 'Tab':
          event.preventDefault();
          if (filteredUsers[selectedIndex]) {
            handleMentionSelect(filteredUsers[selectedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setMentionTarget(null);
          setMentionSearch('');
          setSelectedIndex(0);
          setPopupPosition(null);
          ReactEditor.focus(editor);
          break;
      }
    },
    [mentionTarget, mentionSearch, selectedIndex, users, handleMentionSelect, editor]
  );

  return (
    <div className="border border-gray-300 rounded-lg bg-white text-gray-800 relative font-sans">
      <Slate editor={editor} initialValue={initialEditorValue} onChange={handleChange}>
        <Toolbar />
        <div ref={scrollRef} className="p-3 h-[200px] overflow-y-auto overflow-x-hidden">
          <div className="slate-editor break-words">
            <Editable
              renderElement={CustomElement}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              className="focus:outline-none min-h-[80px] placeholder:text-gray-400 placeholder:italic break-words"
            />
          </div>
        </div>
        {deferredMentionTarget && deferredPopupPosition && (
          <MentionPopup
            users={users}
            selectedIndex={deferredSelectedIndex}
            onSelect={handleMentionSelect}
            position={deferredPopupPosition}
            search={deferredMentionSearch}
            onClose={() => {
              setMentionTarget(null);
              setMentionSearch('');
              setSelectedIndex(0);
              setPopupPosition(null);
              ReactEditor.focus(editor);
            }}
          />
        )}
        <div className="absolute top-2 right-2">
          <EmojiPicker editor={editor} />
        </div>
      </Slate>
    </div>
  );
});

export default RichTextEditor;