import { Editor, Element as SlateElement, Transforms, Range, Text, Descendant } from 'slate';
import { ELEMENT_TYPES } from './constants';
import { MentionElement, CustomElement, User } from '@/types/editor';
import { ReactEditor } from 'slate-react';

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof typeof n] === format,
    })
  );

  return !!match;
};

export const withResetEmptyBlock = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (
      SlateElement.isElement(node) &&
      node.type !== ELEMENT_TYPES.PARAGRAPH &&
      Editor.string(editor, path) === ''
    ) {
      Transforms.setNodes(editor, { type: ELEMENT_TYPES.PARAGRAPH }, { at: path });

      const marks = Editor.marks(editor) || {};
      Object.keys(marks).forEach((mark) => {
        if (mark !== 'color') {
          Editor.removeMark(editor, mark);
        }
      });
    }

    normalizeNode([node, path]);
  };

  return editor;
};

// const resetIfEmpty = (editor: Editor) => {
//   if (!editor.selection) return;

//   const [block, path] = Editor.above(editor, {
//     match: (n) => SlateElement.isElement(n),
//   }) || [null, null];

//   if (!block || !path) return;

//   const blockText = Editor.string(editor, path);
//   if (blockText.trim() === '') {
//     Transforms.setNodes(editor, { type: ELEMENT_TYPES.PARAGRAPH }, { at: path });

//     const marks = Editor.marks(editor) || {};
//     Object.keys(marks).forEach((mark) => {
//       if (mark !== 'color') {
//         Editor.removeMark(editor, mark);
//       }
//     });

//     Transforms.select(editor, Editor.start(editor, path));
//   }
// };

export const toggleBlock = (editor: Editor, format: string, level?: number) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === ELEMENT_TYPES.LIST;
  const isCodeBlock = format === ELEMENT_TYPES.CODE_BLOCK;
  const isBlockquote = format === ELEMENT_TYPES.BLOCKQUOTE;
  const isSpoiler = format === ELEMENT_TYPES.SPOILER;

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n.type === ELEMENT_TYPES.LIST ||
        n.type === ELEMENT_TYPES.LIST_ITEM ||
        n.type === ELEMENT_TYPES.CODE_BLOCK ||
        n.type === ELEMENT_TYPES.BLOCKQUOTE ||
        n.type === ELEMENT_TYPES.SPOILER),
    split: true,
  });
  
let newProperties: Partial<CustomElement>;

if (format === ELEMENT_TYPES.HEADING) {
  newProperties = {
    type: isActive ? ELEMENT_TYPES.PARAGRAPH : ELEMENT_TYPES.HEADING,
  };
  if (!isActive && level) {
    // Type-safe assignment
    (newProperties as Partial<CustomElement> & { level: number }).level = level;
  }
} else {
  newProperties = {
    type: (isActive ? ELEMENT_TYPES.PARAGRAPH : format) as CustomElement['type'],
  };
}

  const createBlock = (type: string): CustomElement => {
    switch (type) {
      case ELEMENT_TYPES.LIST:
        return { type: ELEMENT_TYPES.LIST, children: [] };
      case ELEMENT_TYPES.CODE_BLOCK:
        return { type: ELEMENT_TYPES.CODE_BLOCK, children: [{ text: '' }] };
      case ELEMENT_TYPES.BLOCKQUOTE:
        return { type: ELEMENT_TYPES.BLOCKQUOTE, children: [{ text: '' }] };
      case ELEMENT_TYPES.SPOILER:
        return { type: ELEMENT_TYPES.SPOILER, children: [{ text: '' }] };
      default:
        return { type: ELEMENT_TYPES.PARAGRAPH, children: [{ text: '' }] };
    }
  };

  Transforms.setNodes<CustomElement>(editor, newProperties);

  if (!isActive && isList) {
    const block: CustomElement = {
      type: ELEMENT_TYPES.LIST,
      children: [],
    };
    Transforms.wrapNodes(editor, block);
  } else if (!isActive && (isCodeBlock || isBlockquote || isSpoiler)) {
    const block = createBlock(format);
    Transforms.wrapNodes(editor, block);
  }
};

export const isMentionActive = (editor: Editor) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === ELEMENT_TYPES.MENTION,
  });
  return !!match;
};

export const insertMention = (editor: Editor, user: { id: string; name: string }) => {
  if (!editor.selection) return;

  Editor.withoutNormalizing(editor, () => {
    // Get the mention range (e.g., @username) to delete
    const mentionData = getMentionRange(editor, '@');
    if (mentionData && mentionData.range) {
      // Delete the trigger text (e.g., @username)
      Transforms.delete(editor, { at: mentionData.range });
    }

    // Insert the mention node
    const mention: MentionElement = {
      type: ELEMENT_TYPES.MENTION,
      userId: user.id,
      character: user.name,
      children: [{ text: '' }],
    };
    Transforms.insertNodes(editor, mention);

    // Insert a space after the mention
    const [mentionEntry] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === ELEMENT_TYPES.MENTION,
      mode: 'highest',
    });

    if (mentionEntry) {
      const [, mentionPath] = mentionEntry;
      const nextPath = [...mentionPath.slice(0, -1), mentionPath[mentionPath.length - 1] + 1];

      // Insert a text node with a space
      Transforms.insertNodes(editor, { text: ' ' }, { at: nextPath });

      // Move the cursor to the end of the space
      const cursorPoint = Editor.end(editor, nextPath);
      Transforms.select(editor, cursorPoint);

      // Ensure no lingering marks (except color if desired)
      const marks = Editor.marks(editor) || {};
      Object.keys(marks).forEach((mark) => {
        if (mark !== 'color') {
          Editor.removeMark(editor, mark);
        }
      });
    }

    // Ensure the editor is focused
    ReactEditor.focus(editor);
  });
};

export const withMentions = (editor: Editor) => {
  const { isInline, isVoid, insertText } = editor;

  editor.isInline = (element) => {
    return element.type === ELEMENT_TYPES.MENTION || element.type === ELEMENT_TYPES.INLINE_CODE
      ? true
      : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === ELEMENT_TYPES.MENTION ? true : isVoid(element);
  };

  editor.insertText = (text) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const { path, offset } = anchor;

      const [nodeBefore] = Editor.node(
        editor,
        { path, offset: offset - 1 },
        { edge: 'end' }
      );

      if (
        nodeBefore &&
        SlateElement.isElement(nodeBefore) &&
        nodeBefore.type === ELEMENT_TYPES.MENTION
      ) {
        Editor.withoutNormalizing(editor, () => {
          insertText(text);
          const range = Editor.range(editor, { path, offset }, { path, offset: offset + text.length });
          Transforms.setNodes(
            editor,
            { color: 'blue' },
            { match: (n) => Text.isText(n), split: true, at: range }
          );
        });
        return;
      } else {
        Editor.removeMark(editor, 'color');
      }
    }

    insertText(text);
  };

  return editor;
};

export const getMentionRange = (editor: Editor, triggerChar: string = '@') => {
  const { selection } = editor;

  if (!selection || !Range.isCollapsed(selection)) {
    return null;
  }

  const [start] = Range.edges(selection);
  const lineStart = Editor.before(editor, start, { unit: 'line' }) || { path: start.path, offset: 0 };
  const range = Editor.range(editor, lineStart, start);
  const beforeText = Editor.string(editor, range);

  const regex = new RegExp(`(?:^|\\s)${triggerChar}([\\w]*)$`);
  const match = beforeText.match(regex);

  if (!match) {
    return null;
  }

  const matchedText = match[0].trim();
  const search = match[1] || '';
  const matchStart = Editor.before(editor, start, {
    unit: 'character',
    distance: matchedText.length,
  }) || start;
  const matchRange = Editor.range(editor, matchStart, start);

  return {
    range: matchRange,
    trigger: matchedText,
    search,
  };
};

export const insertInlineCode = (editor: Editor, text: string) => {
  const inlineCode: CustomElement = {
    type: ELEMENT_TYPES.INLINE_CODE,
    children: [{ text }],
  };
  Transforms.insertNodes(editor, inlineCode);
  Transforms.move(editor);
};

export const insertSpoiler = (editor: Editor, text: string) => {
  const spoiler: CustomElement = {
    type: ELEMENT_TYPES.SPOILER,
    children: [{ text }],
  };
  Transforms.insertNodes(editor, spoiler);
  Transforms.move(editor);
};

export const serializeToString = (nodes: Descendant[]): string => {
  return nodes
    .map((node) => serializeNode(node))
    .join('\n');
};

const serializeNode = (node: Descendant): string => {
  if (Text.isText(node)) {
    return node.text;
  }

  if (SlateElement.isElement(node)) {
    const children = node.children.map((child) => serializeNode(child)).join('');

    if (node.type === ELEMENT_TYPES.MENTION) {
      return `<column id='${(node as MentionElement).userId}'>${(node as MentionElement).character}</column>`;
    }

    return children;
  }

  return '';
};

export const deserializeFromString = (content: string, users: User[]): Descendant[] => {
  const lines = content.split('\n').filter((line) => line.trim() !== '');
  const nodes: Descendant[] = [];

  lines.forEach((line) => {
    const paragraph: CustomElement = { type: ELEMENT_TYPES.PARAGRAPH, children: [] };
    const mentionRegex = /<column id='([^']+)'>([^<]+)<\/column>/g;
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(line)) !== null) {
      const [fullMatch, userId, name] = match;
      const start = match.index;
      const end = start + fullMatch.length;

      if (start > lastIndex) {
        paragraph.children.push({ text: line.slice(lastIndex, start) });
      }

      const user = users.find((u) => u.id === userId);
      if (user) {
        paragraph.children.push({
          type: ELEMENT_TYPES.MENTION,
          userId,
          character: name,
          children: [{ text: '' }],
        });
      } else {
        paragraph.children.push({ text: `@${name}` });
      }

      lastIndex = end;
    }

    if (lastIndex < line.length) {
      paragraph.children.push({ text: line.slice(lastIndex) });
    }

    if (paragraph.children.length === 0) {
      paragraph.children.push({ text: '' });
    }

    nodes.push(paragraph);
  });

  return nodes.length > 0 ? nodes : [{ type: ELEMENT_TYPES.PARAGRAPH, children: [{ text: '' }] }];
};