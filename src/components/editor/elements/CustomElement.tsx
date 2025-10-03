import { RenderElementProps } from 'slate-react';
import MentionElement from './MentionElement';
import React from 'react';

const CustomElement = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'mention':
      return (
        <MentionElement attributes={attributes} element={element}>
          {children}
        </MentionElement>
      );
    case 'heading':
      return (
        <h2
          className={`text-2xl font-bold mt-4 mb-2 ${element.level === 2 ? 'text-xl' : ''}`}
          {...attributes}
        >
          {children}
        </h2>
      );
    case 'list':
      return (
        <ul {...attributes}>
          {children}
        </ul>
      );
    case 'list-item':
      return (
        <li {...attributes}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              const el = child as React.ReactElement<{ children: React.ReactNode }>;
              return el.props.children;
            }
            return child;
          })}
        </li>
      );
    case 'spoiler':
      return (
        <span
          className="bg-gray-800 text-gray-800 cursor-pointer hover:text-gray-400 transition-colors"
          onClick={(e) => e.currentTarget.classList.toggle('text-gray-400')}
          {...attributes}
        >
          {children}
        </span>
      );
    case 'blockquote':
      return (
        <blockquote
          className="border-l-4 border-gray-400 pl-[10px] my-2 italic text-gray-600"
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case 'code-block':
      return (
        <pre
          className="bg-gray-900 text-white p-4 rounded my-2 font-mono text-sm overflow-x-auto"
          {...attributes}
        >
          <code>{children}</code>
        </pre>
      );
    case 'inline-code':
      return (
        <code
          className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded font-mono text-sm"
          {...attributes}
        >
          {children}
        </code>
      );
    default:
      const childIsP =
        React.Children.count(children) === 1 &&
        React.isValidElement(children) &&
        (children as React.ReactElement).type === 'p';
      return childIsP ? (
        <div {...attributes}>{children}</div>
      ) : (
        <p className="my-2" {...attributes}>
          {children}
        </p>
      );
  }
};

export default CustomElement;