import React, { useState, useEffect, useRef } from 'react';
import { SessionData, User } from '../types';
import Icon from './Icon';

interface LiveShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: () => void;
  onJoinSession: (sessionId: string) => void;
  onLeaveSession: () => void;
  sessionData: SessionData | null;
  currentUser: User;
}

const UserAvatar: React.FC<{ user: User }> = ({ user }) => (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[var(--color-text-white)] flex-shrink-0"
      style={{ backgroundColor: user.avatarColor }}
      title={user.name}
    >
      {user.name.charAt(0).toUpperCase()}
    </div>
);

const LiveShareModal: React.FC<LiveShareModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
  onJoinSession,
  onLeaveSession,
  sessionData,
  currentUser
}) => {
  const [joinId, setJoinId] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !sessionData) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setJoinId('');
    }
  }, [isOpen, sessionData]);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoinSession(joinId);
  };
  
  const handleCopyToClipboard = () => {
    if (sessionData?.sessionId) {
        navigator.clipboard.writeText(sessionData.sessionId);
        alert('Session ID copied to clipboard!');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[var(--color-bg-secondary)] rounded-lg shadow-2xl border border-[var(--color-border-primary)]"
        onClick={e => e.stopPropagation()}
      >
        {!sessionData ? (
          // --- View when NOT in a session ---
          <div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Live Share Session</h2>
              <p className="text-[var(--color-text-tertiary)] mb-6 text-sm">Join a session to collaborate with your team in real-time or start a new one.</p>
              
              <form onSubmit={handleJoinSubmit} className="mb-6">
                <label htmlFor="sessionId" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Join with Session ID
                </label>
                <div className="flex space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        id="sessionId"
                        value={joinId}
                        onChange={(e) => setJoinId(e.target.value)}
                        placeholder="Enter session ID"
                        className="flex-1 w-full bg-[var(--color-bg-tertiary)] border-[var(--color-border-secondary)] rounded-md px-4 py-2 text-[var(--color-text-primary)] focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)]"
                    />
                    <button type="submit" className="px-4 py-2 rounded-md font-semibold text-[var(--color-accent-text)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ring-offset)] focus:ring-[var(--color-ring)] disabled:opacity-50" disabled={!joinId.trim()}>
                        Join
                    </button>
                </div>
              </form>

              <div className="flex items-center text-[var(--color-text-quaternary)] my-4">
                  <div className="flex-grow border-t border-[var(--color-border-primary)]"></div>
                  <span className="flex-shrink mx-4 text-xs">OR</span>
                  <div className="flex-grow border-t border-[var(--color-border-primary)]"></div>
              </div>

              <button
                onClick={onStartSession}
                className="w-full px-4 py-2.5 rounded-md font-semibold text-[var(--color-text-white)] bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ring-offset)] focus:ring-[var(--color-success)] flex items-center justify-center space-x-2"
              >
                <Icon name="users" className="w-5 h-5"/>
                <span>Start New Session</span>
              </button>
            </div>
          </div>
        ) : (
          // --- View when IN a session ---
          <div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Live Session Active</h2>
              <p className="text-[var(--color-text-tertiary)] mb-4 text-sm">You are collaborating in real-time.</p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Share Session ID</label>
                <div className="flex">
                    <input
                        type="text"
                        readOnly
                        value={sessionData.sessionId}
                        className="flex-1 w-full bg-[var(--color-bg-primary)] border-[var(--color-border-primary)] rounded-l-md px-4 py-2 text-[var(--color-text-primary)] font-mono"
                    />
                    <button onClick={handleCopyToClipboard} className="px-4 py-2 bg-[var(--color-bg-quaternary)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] rounded-r-md font-semibold">Copy</button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Participants ({sessionData.users.length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {sessionData.users.map(user => (
                        <div key={user.id} className="flex items-center space-x-3 p-2 bg-[var(--color-bg-tertiary)]/50 rounded-md">
                            <UserAvatar user={user} />
                            <span className="text-[var(--color-text-primary)]">{user.name} {user.id === currentUser.id ? '(You)' : ''}</span>
                        </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="bg-black/10 px-6 py-3 flex justify-between items-center rounded-b-lg">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-md font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Close
                </button>
                <button
                onClick={onLeaveSession}
                className="px-4 py-2 rounded-md font-semibold text-[var(--color-text-white)] bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-ring-offset)] focus:ring-[var(--color-danger)]"
                >
                Leave Session
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveShareModal;