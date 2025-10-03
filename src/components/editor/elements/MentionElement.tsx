import { RenderElementProps } from 'slate-react';
import { MentionElement as MentionElementType } from '@/types/editor';

interface MentionElementProps extends RenderElementProps {
  element: MentionElementType;
}

const MentionElement = ({ attributes, children, element }: MentionElementProps) => {
  return (
    <span
      {...attributes}
      contentEditable={false}
      className="inline-flex items-center bg-blue-100 text-blue-800 rounded px-1 py-0.5 my-0.5 mx-0.5 align-baseline"
    >
      @{element.character}
      {children}
    </span>
  );
};

export default MentionElement;