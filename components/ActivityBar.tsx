import React from 'react';
import Icon from './Icon';
import { SidebarView } from '../types';

interface ActivityBarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
}

const ActivityBarButton: React.FC<{
  label: string;
  iconName: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, iconName, isActive, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`w-full flex justify-center p-3 my-1 relative ${
      isActive ? 'text-[var(--color-text-white)]' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-white)]'
    }`}
  >
    {isActive && (
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--color-accent)] rounded-r-full"></div>
    )}
    <Icon name={iconName} className="w-6 h-6" />
  </button>
);

const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="w-14 bg-[var(--color-bg-primary)] border-r border-[var(--color-bg-secondary)] flex flex-col items-center">
      <ActivityBarButton
        label="Explorer"
        iconName="file"
        isActive={activeView === 'explorer'}
        onClick={() => onViewChange('explorer')}
      />
      <ActivityBarButton
        label="Plugins"
        iconName="puzzle"
        isActive={activeView === 'plugins'}
        onClick={() => onViewChange('plugins')}
      />
       <ActivityBarButton
        label="MixFlows"
        iconName="sitemap"
        isActive={activeView === 'flows'}
        onClick={() => onViewChange('flows')}
      />
      <ActivityBarButton
        label="Deploy"
        iconName="cloud-arrow-up"
        isActive={activeView === 'deploy'}
        onClick={() => onViewChange('deploy')}
      />
    </div>
  );
};

export default ActivityBar;