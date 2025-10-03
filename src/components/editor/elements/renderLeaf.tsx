import React from 'react';
import { RenderLeafProps } from 'slate-react';

export const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let el = children;

  if (leaf.bold) {
    el = <strong>{el}</strong>;
  }
  if (leaf.italic) {
    el = <em>{el}</em>;
  }
  if (leaf.underline) {
    el = <u>{el}</u>;
  }
  if (leaf.code) {
    el = <code className="bg-gray-200 px-1 py-0.5 rounded">{el}</code>;
  }
  if (leaf.spoiler) {
    el = (
      <span
        className="bg-gray-800 text-gray-800 cursor-pointer hover:text-gray-400 transition-colors"
        onClick={(e) => e.currentTarget.classList.toggle('text-gray-400')}
      >
        {el}
      </span>
    );
  }

  if (leaf.color) {
    el = <span style={{ color: leaf.color }}>{el}</span>;
  }

  return <span {...attributes}>{el}</span>;
};