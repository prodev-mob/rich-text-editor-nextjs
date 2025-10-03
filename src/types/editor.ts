import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface MentionElement {
  type: 'mention';
  userId: string;
  character: string;
  children: CustomText[];
}

export interface ParagraphElement {
  type: 'paragraph';
  children: (CustomText | CustomElement)[]; // Allow both CustomText and inline CustomElement
}

export interface ListElement {
  type: 'list';
  children: CustomElement[];
}

export interface ListItemElement {
  type: 'list-item';
  children: (CustomText | CustomElement)[]; // Allow inline elements in list items
}

export interface HeadingElement {
  type: 'heading';
  level: number;
  children: (CustomText | CustomElement)[];
}

export interface SpoilerElement {
  type: 'spoiler';
  children: (CustomText | CustomElement)[];
}

export interface BlockquoteElement {
  type: 'blockquote';
  children: (CustomText | CustomElement)[];
}

export interface CodeBlockElement {
  type: 'code-block';
  language?: string;
  children: (CustomText | CustomElement)[];
}

export interface InlineCodeElement {
  type: 'inline-code';
  children: CustomText[];
}

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | ListElement
  | ListItemElement
  | InlineCodeElement
  | CodeBlockElement
  | BlockquoteElement
  | SpoilerElement
  | MentionElement;

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  spoiler?: boolean;
  strikethrough?: boolean;
  color?: string;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type { Descendant };