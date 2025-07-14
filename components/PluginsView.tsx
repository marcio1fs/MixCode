import React, { useState, useEffect } from 'react';
import { pluginService } from '../services/pluginService';
import { Plugin } from '../types';
import Icon from './Icon';

const PluginsView: React.FC = () => {
    const [plugins, setPlugins] = useState<Plugin[]>([]);

    useEffect(() => {
        setPlugins(pluginService.getPlugins());
    }, []);

    return (
        <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider px-2 pb-2">Plugins</h2>
            <div className="space-y-3">
                {plugins.map(plugin => (
                    <div key={plugin.name} className="bg-[var(--color-bg-tertiary)]/50 p-3 rounded-md">
                        <div className="flex items-center space-x-2 mb-1">
                            <Icon name="puzzle" className="w-5 h-5 text-[var(--color-accent-subtle)]"/>
                            <h3 className="font-semibold text-[var(--color-text-primary)]">{plugin.name}</h3>
                        </div>
                        <p className="text-sm text-[var(--color-text-tertiary)]">{plugin.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PluginsView;