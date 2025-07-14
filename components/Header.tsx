import React from 'react';
import Icon from './Icon';
import DropdownMenu from './DropdownMenu';
import { MenuItem, SessionData, ProfileId } from '../types';
import ProfileSelector from './ProfileSelector';

interface HeaderProps {
    onToggleTerminal: () => void;
    onOpenFileSearch: () => void;
    onNewProject: () => void;
    isProjectOpen: boolean;
    onToggleSessionModal: () => void;
    sessionData: SessionData | null;
    activeProfile: ProfileId;
    onApplyProfile: (profileId: ProfileId) => void;
}

const UserAvatar: React.FC<{ user: { name: string; avatarColor: string } }> = ({ user }) => (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--color-text-white)] border-2 border-[var(--color-bg-secondary)]"
      style={{ backgroundColor: user.avatarColor }}
      title={user.name}
    >
      {user.name.charAt(0).toUpperCase()}
    </div>
);

const Header: React.FC<HeaderProps> = (props) => {
  const { onToggleTerminal, onOpenFileSearch, onNewProject, isProjectOpen, onToggleSessionModal, sessionData, activeProfile, onApplyProfile } = props;

  const fileMenuItems: MenuItem[] = [
    { label: 'New Project...', action: onNewProject, shortcut: 'Ctrl+Alt+N' },
    { label: 'New File', action: () => alert('Action: New File'), shortcut: 'Ctrl+N', disabled: !isProjectOpen },
    { label: 'New Window', action: () => window.open(window.location.href, '_blank', 'noopener,noreferrer'), shortcut: 'Ctrl+Shift+N' },
    { isDivider: true, label: 'divider1', action: () => {} },
    { label: 'Open File...', action: () => alert('Action: Open File'), shortcut: 'Ctrl+O', disabled: true },
    { label: 'Open Folder...', action: () => alert('Action: Open Folder'), disabled: true },
    { isDivider: true, label: 'divider2', action: () => {} },
    { label: 'Save', action: () => alert('Action: Save'), shortcut: 'Ctrl+S', disabled: !isProjectOpen },
    { label: 'Save As...', action: () => alert('Action: Save As'), shortcut: 'Ctrl+Shift+S', disabled: !isProjectOpen },
    { isDivider: true, label: 'divider3', action: () => {} },
    { label: 'Exit', action: () => alert('Action: Exit'), disabled: true },
  ];

  const editMenuItems: MenuItem[] = [
    { label: 'Undo', action: () => alert('Action: Undo'), shortcut: 'Ctrl+Z', disabled: !isProjectOpen },
    { label: 'Redo', action: () => alert('Action: Redo'), shortcut: 'Ctrl+Y', disabled: !isProjectOpen },
    { isDivider: true, label: 'divider1', action: () => {} },
    { label: 'Cut', action: () => alert('Action: Cut'), shortcut: 'Ctrl+X', disabled: !isProjectOpen },
    { label: 'Copy', action: () => alert('Action: Copy'), shortcut: 'Ctrl+C', disabled: !isProjectOpen },
    { label: 'Paste', action: () => alert('Action: Paste'), shortcut: 'Ctrl+V', disabled: !isProjectOpen },
  ];
  
  const selectionMenuItems: MenuItem[] = [
      { label: 'Select All', action: () => alert('Action: Select All'), shortcut: 'Ctrl+A', disabled: !isProjectOpen },
      { label: 'Expand Selection', action: () => alert('Action: Expand Selection'), disabled: !isProjectOpen },
      { label: 'Shrink Selection', action: () => alert('Action: Shrink Selection'), disabled: !isProjectOpen },
  ];

  const viewMenuItems: MenuItem[] = [
    { label: 'Command Palette...', action: onOpenFileSearch, shortcut: 'Ctrl+Shift+P', disabled: !isProjectOpen },
    { label: 'Explorer', action: () => alert('Action: Toggle Explorer'), disabled: true },
    { label: 'Search', action: () => alert('Action: Toggle Search'), disabled: !isProjectOpen },
    { isDivider: true, label: 'divider1', action: () => {} },
    { label: 'Terminal', action: onToggleTerminal, shortcut: 'Ctrl+`' },
    { isDivider: true, label: 'divider2', action: () => {} },
    { label: 'Appearance', action: () => alert('Action: Appearance'), disabled: true },
  ];

  const goMenuItems: MenuItem[] = [
    { label: 'Find File...', action: onOpenFileSearch, shortcut: 'Ctrl+P', disabled: !isProjectOpen },
    { label: 'Go to Symbol...', action: () => {}, shortcut: 'Ctrl+Shift+O', disabled: !isProjectOpen },
    { isDivider: true, label: 'divider1', action: () => {} },
    { label: 'Go to Definition', action: () => {}, shortcut: 'F12', disabled: !isProjectOpen },
    { label: 'Go to Line/Column...', action: () => {}, shortcut: 'Ctrl+G', disabled: !isProjectOpen },
  ];
  
  const runMenuItems: MenuItem[] = [
    { label: 'Start Debugging', action: () => alert('Action: Start Debugging'), shortcut: 'F5', disabled: !isProjectOpen },
    { label: 'Run Without Debugging', action: () => alert('Action: Run Without Debugging'), shortcut: 'Ctrl+F5', disabled: !isProjectOpen },
    { isDivider: true, label: 'divider1', action: () => {} },
    { label: 'Install Dependencies', action: () => alert('Running "npm install"...'), disabled: !isProjectOpen },
  ];

  const terminalMenuItems: MenuItem[] = [
      { label: 'New Terminal', action: onToggleTerminal, shortcut: 'Ctrl+Shift+`' },
      { label: 'Split Terminal', action: () => alert('Action: Split Terminal'), disabled: true },
  ];
  
  const helpMenuItems: MenuItem[] = [
      { label: 'Welcome', action: () => alert('Welcome to MixCode!'), disabled: false },
      { label: 'Documentation', action: () => alert('Opening documentation...'), disabled: true },
      { label: 'Show Release Notes', action: () => alert('Showing release notes...'), disabled: true },
  ];

  return (
    <header className="bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] flex items-center justify-between px-2 h-8 border-b border-[var(--color-border-primary)] text-sm select-none z-20">
      <div className="flex items-center space-x-1">
        <Icon name="mixcode" className="w-6 h-6 text-[var(--color-accent-subtle)] mr-2" />
        <DropdownMenu label="File" items={fileMenuItems} />
        <DropdownMenu label="Edit" items={editMenuItems} />
        <DropdownMenu label="Selection" items={selectionMenuItems} />
        <DropdownMenu label="View" items={viewMenuItems} />
        <DropdownMenu label="Go" items={goMenuItems} />
        <DropdownMenu label="Run" items={runMenuItems} />
        <DropdownMenu label="Terminal" items={terminalMenuItems} />
      </div>
      <div className="flex-1 text-center text-[var(--color-text-tertiary)] font-medium text-xs truncate px-4">
        {/* Active file path could go here */}
      </div>
      <div className="flex items-center space-x-4">
        <ProfileSelector 
            activeProfile={activeProfile}
            onApplyProfile={onApplyProfile}
            isProjectOpen={isProjectOpen}
        />
        <div className="flex items-center">
            {sessionData && (
                <div className="flex -space-x-2 mr-2">
                    {sessionData.users.slice(0, 3).map(user => (
                        <UserAvatar key={user.id} user={user} />
                    ))}
                    {sessionData.users.length > 3 && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--color-text-white)] bg-[var(--color-bg-quaternary)] border-2 border-[var(--color-bg-secondary)]">
                           +{sessionData.users.length - 3}
                        </div>
                    )}
                </div>
            )}
            <button onClick={onToggleSessionModal} title="Live Share" className="relative p-1 rounded-full hover:bg-[var(--color-bg-tertiary)]">
                <Icon name="users" className="w-5 h-5"/>
                {sessionData && (
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-[var(--color-success)] ring-2 ring-[var(--color-bg-secondary)]" />
                )}
            </button>
        </div>
        <DropdownMenu label="Help" items={helpMenuItems} />
      </div>
    </header>
  );
};

export default Header;