
import React, { useState, useRef, useEffect } from 'react';
import { MenuItem } from '../types';

interface DropdownMenuProps {
  label: string;
  items: MenuItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-0.5 rounded cursor-pointer ${isOpen ? 'bg-[var(--color-bg-tertiary)]' : 'hover:bg-[var(--color-bg-tertiary)]/80'}`}
      >
        {label}
      </div>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-60 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-md shadow-lg py-1 z-30">
          {items.map((item, index) => {
            if (item.isDivider) {
              return <div key={item.label} className="border-t border-[var(--color-border-primary)] my-1" />;
            }
            return (
              <div
                key={item.label}
                onClick={() => !item.disabled && handleItemClick(item.action)}
                className={`flex justify-between items-center px-3 py-1.5 text-sm ${
                  item.disabled
                    ? 'text-[var(--color-text-quaternary)] cursor-not-allowed'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] cursor-pointer'
                }`}
              >
                <span>{item.label}</span>
                {item.shortcut && <span className="text-xs text-[var(--color-text-tertiary)]">{item.shortcut}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;