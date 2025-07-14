import React, { useState } from 'react';
import { PROFILES } from '../constants/profiles';
import { ProfileId } from '../types';

interface ProfileSelectorProps {
  activeProfile: ProfileId;
  onApplyProfile: (profileId: ProfileId) => void;
  isProjectOpen: boolean;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ activeProfile, onApplyProfile, isProjectOpen }) => {
  const [selectedProfile, setSelectedProfile] = useState<ProfileId>(activeProfile);

  const handleApply = () => {
    if (isProjectOpen) {
      onApplyProfile(selectedProfile);
    } else {
        alert("Please open a project to apply a profile.");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select 
        value={selectedProfile}
        onChange={(e) => setSelectedProfile(e.target.value as ProfileId)}
        className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-secondary)] rounded-md px-2 py-1 text-sm text-[var(--color-text-primary)] focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
      >
        {Object.entries(PROFILES).map(([id, profile]) => (
          <option key={id} value={id}>{profile.name}</option>
        ))}
      </select>
      <button 
        onClick={handleApply} 
        disabled={!isProjectOpen}
        className="px-3 py-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🎨 Aplicar
      </button>
    </div>
  );
};

export default ProfileSelector;
