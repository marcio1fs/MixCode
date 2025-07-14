import { FileSystemNode } from '../types';

export interface GitStatus {
  branch: string;
  isDirty: boolean;
  stagedFiles: string[];
  unstagedFiles: string[];
  untrackedFiles: string[];
  ahead: number;
  behind: number;
}

export interface GitCommit {
  hash: string;
  author: string;
  date: string;
  message: string;
  files: string[];
}

export interface GitDiff {
  file: string;
  additions: number;
  deletions: number;
  diff: string;
}

class GitService {
  private isGitAvailable: boolean = false;

  constructor() {
    this.checkGitAvailability();
  }

  private async checkGitAvailability(): Promise<void> {
    try {
      const result = await this.executeGitCommand(['--version']);
      this.isGitAvailable = result.success;
    } catch (error) {
      this.isGitAvailable = false;
    }
  }

  private async executeGitCommand(args: string[]): Promise<{ success: boolean; output: string; error?: string }> {
    try {
      const response = await fetch('/api/git/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ args }),
      });

      if (!response.ok) {
        throw new Error(`Git command failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async isGitRepository(): Promise<boolean> {
    if (!this.isGitAvailable) return false;
    
    const result = await this.executeGitCommand(['rev-parse', '--git-dir']);
    return result.success;
  }

  async getStatus(): Promise<GitStatus | null> {
    if (!this.isGitAvailable) return null;

    try {
      const [statusResult, branchResult, aheadBehindResult] = await Promise.all([
        this.executeGitCommand(['status', '--porcelain']),
        this.executeGitCommand(['branch', '--show-current']),
        this.executeGitCommand(['rev-list', '--count', '--left-right', '@{u}...HEAD']),
      ]);

      if (!statusResult.success || !branchResult.success) {
        return null;
      }

      const lines = statusResult.output.split('\n').filter(line => line.trim());
      const stagedFiles: string[] = [];
      const unstagedFiles: string[] = [];
      const untrackedFiles: string[] = [];

      lines.forEach(line => {
        const status = line.substring(0, 2);
        const file = line.substring(3);
        
        if (status === '??') {
          untrackedFiles.push(file);
        } else if (status[0] !== ' ') {
          stagedFiles.push(file);
        } else if (status[1] !== ' ') {
          unstagedFiles.push(file);
        }
      });

      const branch = branchResult.output.trim();
      const [ahead, behind] = aheadBehindResult.success 
        ? aheadBehindResult.output.trim().split('\t').map(Number)
        : [0, 0];

      return {
        branch,
        isDirty: stagedFiles.length > 0 || unstagedFiles.length > 0 || untrackedFiles.length > 0,
        stagedFiles,
        unstagedFiles,
        untrackedFiles,
        ahead,
        behind,
      };
    } catch (error) {
      console.error('Error getting git status:', error);
      return null;
    }
  }

  async getLog(limit: number = 10): Promise<GitCommit[]> {
    if (!this.isGitAvailable) return [];

    try {
      const result = await this.executeGitCommand([
        'log',
        `--max-count=${limit}`,
        '--pretty=format:%H|%an|%ad|%s',
        '--date=short',
        '--name-only',
      ]);

      if (!result.success) return [];

      const commits: GitCommit[] = [];
      const lines = result.output.split('\n');
      let currentCommit: Partial<GitCommit> | null = null;

      for (const line of lines) {
        if (line.includes('|')) {
          if (currentCommit) {
            commits.push(currentCommit as GitCommit);
          }
          
          const [hash, author, date, message] = line.split('|');
          currentCommit = {
            hash,
            author,
            date,
            message,
            files: [],
          };
        } else if (line.trim() && currentCommit) {
          currentCommit.files!.push(line.trim());
        }
      }

      if (currentCommit) {
        commits.push(currentCommit as GitCommit);
      }

      return commits;
    } catch (error) {
      console.error('Error getting git log:', error);
      return [];
    }
  }

  async getDiff(file?: string): Promise<GitDiff[]> {
    if (!this.isGitAvailable) return [];

    try {
      const args = ['diff', '--stat'];
      if (file) {
        args.push(file);
      }

      const result = await this.executeGitCommand(args);
      if (!result.success) return [];

      const diffs: GitDiff[] = [];
      const lines = result.output.split('\n');
      
      for (const line of lines) {
        const match = line.match(/^(.+?)\s+\|\s+(\d+)\s+(\+*)(-*)$/);
        if (match) {
          const [, fileName, changes, additions, deletions] = match;
          diffs.push({
            file: fileName,
            additions: additions.length,
            deletions: deletions.length,
            diff: '', // Full diff would require additional command
          });
        }
      }

      return diffs;
    } catch (error) {
      console.error('Error getting git diff:', error);
      return [];
    }
  }

  async stageFile(file: string): Promise<boolean> {
    if (!this.isGitAvailable) return false;

    try {
      const result = await this.executeGitCommand(['add', file]);
      return result.success;
    } catch (error) {
      console.error('Error staging file:', error);
      return false;
    }
  }

  async unstageFile(file: string): Promise<boolean> {
    if (!this.isGitAvailable) return false;

    try {
      const result = await this.executeGitCommand(['reset', 'HEAD', file]);
      return result.success;
    } catch (error) {
      console.error('Error unstaging file:', error);
      return false;
    }
  }

  async commit(message: string): Promise<boolean> {
    if (!this.isGitAvailable) return false;

    try {
      const result = await this.executeGitCommand(['commit', '-m', message]);
      return result.success;
    } catch (error) {
      console.error('Error committing:', error);
      return false;
    }
  }

  async createBranch(name: string): Promise<boolean> {
    if (!this.isGitAvailable) return false;

    try {
      const result = await this.executeGitCommand(['checkout', '-b', name]);
      return result.success;
    } catch (error) {
      console.error('Error creating branch:', error);
      return false;
    }
  }

  async switchBranch(name: string): Promise<boolean> {
    if (!this.isGitAvailable) return false;

    try {
      const result = await this.executeGitCommand(['checkout', name]);
      return result.success;
    } catch (error) {
      console.error('Error switching branch:', error);
      return false;
    }
  }

  async getBranches(): Promise<string[]> {
    if (!this.isGitAvailable) return [];

    try {
      const result = await this.executeGitCommand(['branch', '--format=%(refname:short)']);
      if (!result.success) return [];

      return result.output.split('\n').filter(branch => branch.trim());
    } catch (error) {
      console.error('Error getting branches:', error);
      return [];
    }
  }

  async getRemoteBranches(): Promise<string[]> {
    if (!this.isGitAvailable) return [];

    try {
      const result = await this.executeGitCommand(['branch', '-r', '--format=%(refname:short)']);
      if (!result.success) return [];

      return result.output.split('\n').filter(branch => branch.trim());
    } catch (error) {
      console.error('Error getting remote branches:', error);
      return [];
    }
  }

  async pull(): Promise<boolean> {
    if (!this.isGitAvailable) return false;

    try {
      const result = await this.executeGitCommand(['pull']);
      return result.success;
    } catch (error) {
      console.error('Error pulling:', error);
      return false;
    }
  }

  async push(): Promise<boolean> {
    if (!this.isGitAvailable) return false;

    try {
      const result = await this.executeGitCommand(['push']);
      return result.success;
    } catch (error) {
      console.error('Error pushing:', error);
      return false;
    }
  }
}

export const gitService = new GitService(); 