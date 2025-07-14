

import React, { useState, useEffect } from 'react';
import { FileSystemNode } from '../types';
import Icon from './Icon';

interface DeploymentViewProps {
  rootNode: FileSystemNode | null;
  onDeploy: () => void;
}

interface DeployConfig {
    name?: string;
    type?: string;
    entrypoint?: string;
    method?: string;
    port?: string;
    env?: string[];
    post_deploy?: string[];
}

// Simple regex-based parser for the demo
const parseConfig = (content: string): DeployConfig => {
    const config: DeployConfig = {};
    config.name = content.match(/^name:\s*(.*)/m)?.[1];
    config.type = content.match(/^type:\s*(.*)/m)?.[1];
    config.entrypoint = content.match(/^entrypoint:\s*(.*)/m)?.[1];
    config.method = content.match(/^\s*method:\s*(.*)/m)?.[1];
    config.port = content.match(/^\s*port:\s*(.*)/m)?.[1];
    
    const envBlock = content.match(/env:([\s\S]*?)post_deploy:/m)?.[1] || content.match(/env:([\s\S]*)/m)?.[1];
    if (envBlock) {
        config.env = envBlock.trim().split('\n').map(line => line.trim()).filter(Boolean);
    }

    const postDeployBlock = content.match(/post_deploy:([\s\S]*)/m)?.[1];
    if (postDeployBlock) {
        config.post_deploy = postDeployBlock.trim().split('\n').map(line => line.trim().replace(/^-/, '').trim()).filter(Boolean);
    }
    
    return config;
};

const InfoCard: React.FC<{ label: string; value?: string | string[]; children?: React.ReactNode }> = ({ label, value, children }) => {
    if (!value && !children) return null;
    return (
        <div>
            <h4 className="text-xs font-semibold uppercase text-[var(--color-text-quaternary)] tracking-wider">{label}</h4>
            <div className="mt-1 bg-[var(--color-bg-tertiary)]/50 p-3 rounded-md text-sm">
                {children || (
                     Array.isArray(value) 
                     ? <pre className="whitespace-pre-wrap font-mono text-[var(--color-info-text)]"><code>{value.join('\n')}</code></pre>
                     : <span className="text-[var(--color-text-secondary)]">{value}</span>
                )}
            </div>
        </div>
    );
};


const DeploymentView: React.FC<DeploymentViewProps> = ({ rootNode, onDeploy }) => {
    const [config, setConfig] = useState<DeployConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (rootNode?.children) {
            const configFile = rootNode.children.find(node => node.name === 'mixcode.yaml' && node.type === 'file');
            if (configFile?.content) {
                setConfig(parseConfig(configFile.content));
            } else {
                setConfig(null);
            }
        } else {
            setConfig(null);
        }
        setIsLoading(false);
    }, [rootNode]);
    
    if (!rootNode) {
         return (
             <div className="p-4 text-center text-[var(--color-text-quaternary)]">
                Open a project to see deployment options.
            </div>
         );
    }

    if (isLoading) {
        return <div className="p-4 text-[var(--color-text-quaternary)]">Loading...</div>;
    }

    if (!config) {
        return (
             <div className="p-4 text-center text-[var(--color-text-quaternary)]">
                <p>No <code className="bg-[var(--color-bg-tertiary)] p-1 rounded-sm text-xs">mixcode.yaml</code> file found in the project root.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider px-2 pb-2">Deployment</h2>
            <div className="p-2 space-y-4">
                <InfoCard label="Project Name" value={config.name} />
                <InfoCard label="Type" value={config.type} />
                <InfoCard label="Entrypoint" value={config.entrypoint} />
                <InfoCard label="Deploy Method" value={config.method} />
                <InfoCard label="Port" value={config.port} />
                <InfoCard label="Environment" value={config.env} />
                <InfoCard label="Post-Deploy Steps">
                    {config.post_deploy && (
                        <ul className="space-y-1 font-mono text-[var(--color-info-text)] text-xs">
                           {config.post_deploy.map((step, i) => <li key={i}>{`> ${step}`}</li>)}
                        </ul>
                    )}
                </InfoCard>

                <div className="pt-4">
                     <button 
                        onClick={onDeploy}
                        className="w-full flex items-center justify-center space-x-2 bg-[var(--color-accent)] text-[var(--color-accent-text)] px-4 py-2 rounded-md hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2 focus:ring-offset-[var(--color-ring-offset)]"
                    >
                        <Icon name="cloud-arrow-up" className="w-5 h-5" />
                        <span>Deploy Project</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeploymentView;