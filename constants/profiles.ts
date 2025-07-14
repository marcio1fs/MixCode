import { PluginsConfig, SidebarView, ProfileId, Theme } from '../types';

type RightPaneView = 'chat' | 'radar';

export interface Profile {
  name: string;
  plugins: PluginsConfig;
  theme: Theme;
  defaultSidebarView: SidebarView;
  defaultRightPaneView: RightPaneView;
}

export const PROFILES: Record<ProfileId, Profile> = {
  analitico: {
    name: 'Analítico',
    plugins: {
      "Smart Linter": { enabled: true },
      "Code Diagrammer": { enabled: false }
    },
    theme: 'dark',
    defaultSidebarView: 'explorer',
    defaultRightPaneView: 'radar',
  },
  criativo: {
    name: 'Criativo',
    plugins: {
      "Smart Linter": { enabled: false },
      "Code Diagrammer": { enabled: true }
    },
    theme: 'solarized',
    defaultSidebarView: 'explorer',
    defaultRightPaneView: 'chat',
  },
  agil: {
    name: 'Ágil',
    plugins: {
      "Smart Linter": { enabled: true },
      "Code Diagrammer": { enabled: false }
    },
    theme: 'light',
    defaultSidebarView: 'flows',
    defaultRightPaneView: 'chat',
  },
};
