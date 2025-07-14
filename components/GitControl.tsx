import React, { useState, useEffect } from 'react';
import { gitService, GitStatus, GitCommit } from '../services/gitService';
import Icon from './Icon';

interface GitControlProps {
  projectPath: string;
}

const GitControl: React.FC<GitControlProps> = ({ projectPath }) => {
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [branches, setBranches] = useState<string[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string>('');

  useEffect(() => {
    loadGitData();
  }, [projectPath]);

  const loadGitData = async () => {
    setIsLoading(true);
    try {
      const [status, log, branchList] = await Promise.all([
        gitService.getStatus(),
        gitService.getLog(5),
        gitService.getBranches(),
      ]);
      
      setGitStatus(status);
      setCommits(log);
      setBranches(branchList);
      setCurrentBranch(status?.branch || '');
    } catch (error) {
      console.error('Error loading git data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageFile = async (file: string) => {
    const success = await gitService.stageFile(file);
    if (success) {
      loadGitData();
    }
  };

  const handleUnstageFile = async (file: string) => {
    const success = await gitService.unstageFile(file);
    if (success) {
      loadGitData();
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    
    const success = await gitService.commit(commitMessage);
    if (success) {
      setCommitMessage('');
      setShowCommitModal(false);
      loadGitData();
    }
  };

  const handleSwitchBranch = async (branch: string) => {
    const success = await gitService.switchBranch(branch);
    if (success) {
      loadGitData();
    }
  };

  const handleCreateBranch = async (branchName: string) => {
    const success = await gitService.createBranch(branchName);
    if (success) {
      loadGitData();
    }
  };

  const handlePull = async () => {
    const success = await gitService.pull();
    if (success) {
      loadGitData();
    }
  };

  const handlePush = async () => {
    const success = await gitService.push();
    if (success) {
      loadGitData();
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <Icon name="git" className="w-4 h-4" />
          <span className="text-sm">Loading Git status...</span>
        </div>
      </div>
    );
  }

  if (!gitStatus) {
    return (
      <div className="p-4">
        <div className="text-center text-sm text-[var(--color-text-tertiary)]">
          <Icon name="git" className="w-8 h-8 mx-auto mb-2" />
          <p>Not a Git repository</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Branch Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="git" className="w-4 h-4" />
          <span className="text-sm font-medium">{currentBranch}</span>
          {gitStatus.ahead > 0 && (
            <span className="text-xs bg-[var(--color-success)] text-white px-1 rounded">
              +{gitStatus.ahead}
            </span>
          )}
          {gitStatus.behind > 0 && (
            <span className="text-xs bg-[var(--color-warning)] text-white px-1 rounded">
              -{gitStatus.behind}
            </span>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={handlePull}
            className="p-1 hover:bg-[var(--color-bg-hover)] rounded"
            title="Pull"
          >
            <Icon name="download" className="w-4 h-4" />
          </button>
          <button
            onClick={handlePush}
            className="p-1 hover:bg-[var(--color-bg-hover)] rounded"
            title="Push"
          >
            <Icon name="upload" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Staged Files */}
      {gitStatus.stagedFiles.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
            Staged Files
          </h4>
          <div className="space-y-1">
            {gitStatus.stagedFiles.map((file) => (
              <div key={file} className="flex items-center justify-between text-sm">
                <span className="truncate">{file}</span>
                <button
                  onClick={() => handleUnstageFile(file)}
                  className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                >
                  Unstage
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unstaged Files */}
      {gitStatus.unstagedFiles.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
            Modified Files
          </h4>
          <div className="space-y-1">
            {gitStatus.unstagedFiles.map((file) => (
              <div key={file} className="flex items-center justify-between text-sm">
                <span className="truncate">{file}</span>
                <button
                  onClick={() => handleStageFile(file)}
                  className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                >
                  Stage
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Untracked Files */}
      {gitStatus.untrackedFiles.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
            Untracked Files
          </h4>
          <div className="space-y-1">
            {gitStatus.untrackedFiles.map((file) => (
              <div key={file} className="flex items-center justify-between text-sm">
                <span className="truncate">{file}</span>
                <button
                  onClick={() => handleStageFile(file)}
                  className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commit Button */}
      {gitStatus.stagedFiles.length > 0 && (
        <button
          onClick={() => setShowCommitModal(true)}
          className="w-full bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-white text-sm py-2 px-3 rounded"
        >
          Commit Changes
        </button>
      )}

      {/* Recent Commits */}
      {commits.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
            Recent Commits
          </h4>
          <div className="space-y-2">
            {commits.slice(0, 3).map((commit) => (
              <div key={commit.hash} className="text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[var(--color-text-quaternary)]">
                    {commit.hash.substring(0, 7)}
                  </span>
                  <span className="text-[var(--color-text-primary)] truncate">
                    {commit.message}
                  </span>
                </div>
                <div className="text-[var(--color-text-tertiary)]">
                  {commit.author} • {commit.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commit Modal */}
      {showCommitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg w-96">
            <h3 className="text-lg font-medium mb-4">Commit Changes</h3>
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Enter commit message..."
              className="w-full h-24 p-2 border border-[var(--color-border-primary)] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] resize-none"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowCommitModal(false)}
                className="px-3 py-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleCommit}
                disabled={!commitMessage.trim()}
                className="px-3 py-1 text-sm bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-white rounded disabled:opacity-50"
              >
                Commit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitControl; 