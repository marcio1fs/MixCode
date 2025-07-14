import { FileSystemNode } from '../types';

export interface Breakpoint {
  id: string;
  line: number;
  column: number;
  enabled: boolean;
  condition?: string;
  hitCount: number;
}

export interface DebugSession {
  id: string;
  status: 'running' | 'paused' | 'stopped' | 'starting';
  currentLine?: number;
  currentFile?: string;
  callStack: CallStackFrame[];
  variables: Variable[];
  breakpoints: Breakpoint[];
}

export interface CallStackFrame {
  name: string;
  file: string;
  line: number;
  column: number;
}

export interface Variable {
  name: string;
  value: string;
  type: string;
  scope: 'local' | 'global' | 'closure';
  children?: Variable[];
}

export interface DebugConfig {
  type: 'node' | 'chrome' | 'python';
  request: 'launch' | 'attach';
  name: string;
  program?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  port?: number;
}

class DebuggerService {
  private sessions: Map<string, DebugSession> = new Map();
  private currentSessionId: string | null = null;

  async createSession(config: DebugConfig): Promise<string> {
    const sessionId = `debug-${Date.now()}`;
    
    const session: DebugSession = {
      id: sessionId,
      status: 'starting',
      callStack: [],
      variables: [],
      breakpoints: [],
    };

    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;

    try {
      // Simular inicialização do debugger
      await this.initializeDebugger(config);
      session.status = 'running';
    } catch (error) {
      session.status = 'stopped';
      throw error;
    }

    return sessionId;
  }

  private async initializeDebugger(config: DebugConfig): Promise<void> {
    // Simular inicialização baseada no tipo
    switch (config.type) {
      case 'node':
        await this.initializeNodeDebugger(config);
        break;
      case 'chrome':
        await this.initializeChromeDebugger(config);
        break;
      case 'python':
        await this.initializePythonDebugger(config);
        break;
      default:
        throw new Error(`Unsupported debugger type: ${config.type}`);
    }
  }

  private async initializeNodeDebugger(config: DebugConfig): Promise<void> {
    // Simular inicialização do debugger Node.js
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async initializeChromeDebugger(config: DebugConfig): Promise<void> {
    // Simular inicialização do debugger Chrome
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async initializePythonDebugger(config: DebugConfig): Promise<void> {
    // Simular inicialização do debugger Python
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async addBreakpoint(sessionId: string, line: number, column: number = 1, condition?: string): Promise<Breakpoint> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    const breakpoint: Breakpoint = {
      id: `bp-${Date.now()}`,
      line,
      column,
      enabled: true,
      condition,
      hitCount: 0,
    };

    session.breakpoints.push(breakpoint);
    return breakpoint;
  }

  async removeBreakpoint(sessionId: string, breakpointId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    session.breakpoints = session.breakpoints.filter(bp => bp.id !== breakpointId);
  }

  async toggleBreakpoint(sessionId: string, breakpointId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    const breakpoint = session.breakpoints.find(bp => bp.id === breakpointId);
    if (breakpoint) {
      breakpoint.enabled = !breakpoint.enabled;
    }
  }

  async continue(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    if (session.status === 'paused') {
      session.status = 'running';
      // Simular continuação da execução
      await this.simulateExecution(session);
    }
  }

  async stepOver(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    if (session.status === 'paused') {
      // Simular step over
      session.currentLine = (session.currentLine || 0) + 1;
      await this.simulateExecution(session);
    }
  }

  async stepInto(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    if (session.status === 'paused') {
      // Simular step into
      await this.simulateExecution(session);
    }
  }

  async stepOut(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    if (session.status === 'paused') {
      // Simular step out
      await this.simulateExecution(session);
    }
  }

  async pause(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    if (session.status === 'running') {
      session.status = 'paused';
    }
  }

  async stop(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    session.status = 'stopped';
    this.sessions.delete(sessionId);
    
    if (this.currentSessionId === sessionId) {
      this.currentSessionId = null;
    }
  }

  async getVariables(sessionId: string): Promise<Variable[]> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    // Simular variáveis do debugger
    return [
      {
        name: 'i',
        value: '5',
        type: 'number',
        scope: 'local',
      },
      {
        name: 'arr',
        value: '[1, 2, 3, 4, 5]',
        type: 'array',
        scope: 'local',
        children: [
          { name: '0', value: '1', type: 'number', scope: 'local' },
          { name: '1', value: '2', type: 'number', scope: 'local' },
          { name: '2', value: '3', type: 'number', scope: 'local' },
        ],
      },
      {
        name: 'result',
        value: 'undefined',
        type: 'undefined',
        scope: 'local',
      },
    ];
  }

  async getCallStack(sessionId: string): Promise<CallStackFrame[]> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    // Simular call stack
    return [
      {
        name: 'main',
        file: 'app.js',
        line: 15,
        column: 1,
      },
      {
        name: 'processArray',
        file: 'utils.js',
        line: 8,
        column: 1,
      },
      {
        name: 'forEach',
        file: 'native',
        line: 0,
        column: 0,
      },
    ];
  }

  async evaluateExpression(sessionId: string, expression: string): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Debug session ${sessionId} not found`);
    }

    // Simular avaliação de expressão
    try {
      // Em um debugger real, isso seria avaliado no contexto atual
      const result = eval(expression);
      return String(result);
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private async simulateExecution(session: DebugSession): Promise<void> {
    // Simular execução e verificação de breakpoints
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const hitBreakpoint = session.breakpoints.find(bp => 
      bp.enabled && bp.line === session.currentLine
    );

    if (hitBreakpoint) {
      hitBreakpoint.hitCount++;
      session.status = 'paused';
    }
  }

  getCurrentSession(): DebugSession | null {
    if (!this.currentSessionId) return null;
    return this.sessions.get(this.currentSessionId) || null;
  }

  getAllSessions(): DebugSession[] {
    return Array.from(this.sessions.values());
  }

  async createDefaultConfig(file: FileSystemNode): Promise<DebugConfig> {
    const extension = file.path.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'ts':
        return {
          type: 'node',
          request: 'launch',
          name: 'Debug JavaScript',
          program: file.path,
        };
      case 'py':
        return {
          type: 'python',
          request: 'launch',
          name: 'Debug Python',
          program: file.path,
        };
      default:
        return {
          type: 'node',
          request: 'launch',
          name: 'Debug Application',
          program: file.path,
        };
    }
  }
}

export const debuggerService = new DebuggerService(); 