import fs from 'fs/promises';
import path from 'path';

export interface McpServerConfig {
    name: string;
    command: string;
    args: string[];
}

export interface ClaudeConfig {
    mcpServers: Record<
        string,
        {
            command: string;
            args: string[];
        }
    >;
}

export class ConfigManager {
    private configPath: string;

    constructor() {
        this.configPath = path.join(
            process.env.HOME || '',
            '.config',
            'Claude',
            'claude_desktop_config.json'
        );
    }

    async readConfig(): Promise<ClaudeConfig> {
        try {
            const configData = await fs.readFile(this.configPath, 'utf-8');
            return JSON.parse(configData);
        } catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
                // Return default config if file doesn't exist
                return { mcpServers: {} };
            }
            throw error;
        }
    }

    async writeConfig(config: ClaudeConfig): Promise<void> {
        const configDir = path.dirname(this.configPath);
        await fs.mkdir(configDir, { recursive: true });
        await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
    }
}
