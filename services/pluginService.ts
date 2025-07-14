import { Plugin, FileContext, PluginSuggestion, PluginsConfig } from '../types';

class PluginService {
    private plugins: Plugin[] = [];

    registerPlugin(plugin: Plugin) {
        console.log(`Registering plugin: ${plugin.name}`);
        this.plugins.push(plugin);
    }
    
    getPlugins(): Plugin[] {
        return this.plugins;
    }

    async runOnCodeChangeHooks(context: FileContext, config: PluginsConfig): Promise<PluginSuggestion[]> {
        const allSuggestions: PluginSuggestion[] = [];
        const enabledPlugins = this.plugins.filter(p => config[p.name]?.enabled);

        for (const plugin of enabledPlugins) {
            if (plugin.hooks.onCodeChange) {
                try {
                    const suggestions = await plugin.hooks.onCodeChange(context);
                    allSuggestions.push(...suggestions);
                } catch (error) {
                    console.error(`Error running onCodeChange hook for plugin ${plugin.name}:`, error);
                }
            }
        }
        return allSuggestions;
    }
    
    async runOnOpenFileHooks(context: FileContext, config: PluginsConfig): Promise<{ aiPrompt: string } | null> {
        const enabledPlugins = this.plugins.filter(p => config[p.name]?.enabled);

        for (const plugin of enabledPlugins) {
            if (plugin.hooks.onOpenFile) {
                try {
                    const result = await plugin.hooks.onOpenFile(context);
                    if (result) {
                        // Return the result from the first plugin that provides one
                        return result;
                    }
                } catch (error) {
                     console.error(`Error running onOpenFile hook for plugin ${plugin.name}:`, error);
                }
            }
        }
        return null;
    }
}

export const pluginService = new PluginService();