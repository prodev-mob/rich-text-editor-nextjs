/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { User } from '@/types/editor';

interface MentionPopupProps {
  users: User[];
  selectedIndex: number;
  onSelect: (user: User) => void;
  position: { top: number; left: number };
  search: string;
  onClose: () => void; // callback to close popup
}

const MentionPopup = memo(({ users, selectedIndex, onSelect, position, search, onClose }: MentionPopupProps) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll selected item into view
  useEffect(() => {
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const filteredUsers = React.useMemo(
    () =>
      users.filter((u) => {
        if (search === '') return true;
        return (
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        );
      }),
    [users, search]
  );

  if (filteredUsers.length === 0) {
    return createPortal(
      <div
        ref={popupRef}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          zIndex: 1000,
        }}
        className="bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 w-72 overflow-y-auto p-2"
      >
        <div className="text-sm text-gray-500">No users found</div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      ref={popupRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 1000,
      }}
      className="bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 w-72 overflow-y-auto"
    >
      {filteredUsers.map((user, index) => (
        <div
          key={user.id}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className={`p-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${
            index === selectedIndex ? 'bg-gray-100' : ''
          }`}
          onClick={() => onSelect(user)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {user.avatar && (
            <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
          )}
          <div>
            <div className="text-sm font-medium text-gray-800">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
});

MentionPopup.displayName = 'MentionPopup';

export default MentionPopup;
