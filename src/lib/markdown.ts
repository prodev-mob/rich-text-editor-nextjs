import { Editor, Transforms, Range, Element as SlateElement } from 'slate';
import { ELEMENT_TYPES } from './constants';
import { CustomElement } from '@/types/editor';
import { insertInlineCode, insertSpoiler } from './editor';

export const withMarkdown = (editor: Editor) => {
  const { insertText, insertData } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);

      if (text === ' ' && beforeText) {
        if (beforeText.match(/^`[^`]+$/)) {
          const textContent = beforeText.slice(1);
          Transforms.delete(editor, { at: beforeRange });
          insertInlineCode(editor, textContent);
          return;
        }
        if (beforeText.match(/^\|\|[^\|]+\|\|$/)) {
          const textContent = beforeText.slice(2, -2);
          Transforms.delete(editor, { at: beforeRange });
          insertSpoiler(editor, textContent);
          return;
        }
        if (beforeText.match(/^>{1,3}\s/)) {
          Transforms.delete(editor, { at: beforeRange });
          Transforms.setNodes<CustomElement>(
            editor,
            { type: ELEMENT_TYPES.BLOCKQUOTE, children: [{ text: '' }] },
            { match: n => SlateElement.isElement(n) && n.type === ELEMENT_TYPES.PARAGRAPH }
          );
          return;
        }
        if (beforeText.match(/^```[a-z]*$/)) {
          const language = beforeText.slice(3);
          Transforms.delete(editor, { at: beforeRange });
          const codeBlock: CustomElement = {
            type: ELEMENT_TYPES.CODE_BLOCK,
            language: language || undefined,
            children: [{ text: '' }],
          };
          Transforms.insertNodes(editor, codeBlock);
          return;
        }
      }
    }

    insertText(text);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    if (text) {
      const lines = text.split('\n');
      const nodes: CustomElement[] = [];

      lines.forEach((line) => {
        if (line.startsWith('> ') || line.startsWith('>>> ')) {
          nodes.push({
            type: ELEMENT_TYPES.BLOCKQUOTE,
            children: [{ text: line.replace(/^>{1,3}\s/, '') }],
          });
        } else if (line.startsWith('```')) {
          const language = line.slice(3);
          nodes.push({
            type: ELEMENT_TYPES.CODE_BLOCK,
            language: language || undefined,
            children: [{ text: '' }],
          });
        } else if (line.match(/^\|\|[^\|]+\|\|$/)) {
          nodes.push({
            type: ELEMENT_TYPES.SPOILER,
            children: [{ text: line.slice(2, -2) }],
          });
        } else {
          nodes.push({
            type: ELEMENT_TYPES.PARAGRAPH,
            children: [{ text: line }],
          });
        }
      });

      Transforms.insertNodes(editor, nodes);
      return;
    }

    insertData(data);
  };

  return editor;
};