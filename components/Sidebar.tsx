import React from 'react';
import { FileSystemNode, SidebarView } from '../types';
import FileExplorer from './FileExplorer';
import PluginsView from './PluginsView';
import DeploymentView from './DeploymentView';
import MixFlowView from './MixFlowView';

interface SidebarProps {
  activeView: SidebarView;
  rootNode: FileSystemNode | null;
  activeFile: string;
  onFileSelect: (file: FileSystemNode) => void;
  onOpenFolder: () => void;
  onDeploy: () => void;
  onGenerateProjectMap: () => void;
  onArchitectureReview: () => void;
  onGenerateTechDebtRadar: () => void;
  onForgeModule: () => void;
  // MixFlow props
  selectedFlow: string;
  onFlowChange: (flow: string) => void;
  onRunFlow: () => void;
  flowOutput: string;
  isFlowRunning: boolean;
}


const Sidebar: React.FC<SidebarProps> = (props) => {
  const { activeView, rootNode, activeFile, onFileSelect, onOpenFolder, onDeploy, onGenerateProjectMap, onArchitectureReview, onGenerateTechDebtRadar, onForgeModule } = props;
  
  return (
    <div className="w-64 bg-[var(--color-bg-secondary)] p-2 overflow-y-auto flex flex-col">
      {activeView === 'explorer' && (
        <FileExplorer
          rootNode={rootNode}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
          onOpenFolder={onOpenFolder}
          onGenerateProjectMap={onGenerateProjectMap}
          onArchitectureReview={onArchitectureReview}
          onGenerateTechDebtRadar={onGenerateTechDebtRadar}
          onForgeModule={onForgeModule}
        />
      )}
      {activeView === 'plugins' && (
        <PluginsView />
      )}
      {activeView === 'deploy' && (
        <DeploymentView rootNode={rootNode} onDeploy={onDeploy} />
      )}
      {activeView === 'flows' && (
        <MixFlowView
          selectedFlow={props.selectedFlow}
          onFlowChange={props.onFlowChange}
          onRunFlow={props.onRunFlow}
          output={props.flowOutput}
          isFlowRunning={props.isFlowRunning}
        />
      )}
    </div>
  );
};

export default Sidebar;