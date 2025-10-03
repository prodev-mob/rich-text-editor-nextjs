import { Editor, Element as SlateElement, Transforms } from 'slate';
import { ELEMENT_TYPES } from './constants';
import { CustomElement, ListElement } from '@/types/editor';

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
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof typeof n] === format,
    })
  );

  return !!match;
};

export const toggleBlock = (editor: Editor, format: string, level?: number) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === ELEMENT_TYPES.LIST;

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n.type === ELEMENT_TYPES.LIST || n.type === ELEMENT_TYPES.LIST_ITEM),
    split: true,
  });

  let newProperties: Partial<CustomElement>;
  
 if (format === ELEMENT_TYPES.HEADING) {
  newProperties = {
    type: isActive ? ELEMENT_TYPES.PARAGRAPH : ELEMENT_TYPES.HEADING,
  };
  if (!isActive && level) {
    // Properly type level for headings
    (newProperties as Partial<CustomElement> & { level: number }).level = level;
  }
  } else {
    newProperties = {
      type: (isActive ? ELEMENT_TYPES.PARAGRAPH : format) as CustomElement['type'],
    };
  }

  Transforms.setNodes<CustomElement>(editor, newProperties);

  if (!isActive && isList) {
    const block: ListElement = { 
      type: ELEMENT_TYPES.LIST, 
      children: [] 
    };
    Transforms.wrapNodes(editor, block);
  }
};

export const CustomEditor = {
  ...Editor,
};