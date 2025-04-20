import { Request, Response } from 'express';
import { ConfigManager, McpServerConfig } from '../../config/configManager.js';
import { body, validationResult } from 'express-validator';

export class McpServerController {
    private validator = [
        body('name').isString().notEmpty(),
        body('command').isString().notEmpty(),
        body('args').isArray(),
        body('args.*').isString()
    ];

    constructor(private configManager: ConfigManager) {}

    async getServers(req: Request, res: Response, next: any): Promise<Response> {
        try {
            const config = await this.configManager.readConfig();
            const servers = Object.entries(config.mcpServers).map(([name, server]) => ({
                name,
                command: server.command,
                args: server.args
            }));

            return res.status(200).json({
                success: true,
                data: servers
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve MCP servers'
            });
        }
    }

    async putServer(req: Request, res: Response, next: any): Promise<Response> {
        try {
            // Run validation
            await Promise.all(this.validator.map((validation) => validation.run(req)));
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const serverConfig: McpServerConfig = req.body;
            const config = await this.configManager.readConfig();

            config.mcpServers[serverConfig.name] = {
                command: serverConfig.command,
                args: serverConfig.args
            };

            await this.configManager.writeConfig(config);

            return res.status(200).json({
                success: true,
                message: `Server ${serverConfig.name} registered successfully`
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to register MCP server'
            });
        }
    }

    async deleteServer(req: Request, res: Response, next: any): Promise<Response> {
        try {
            const { name } = req.params;
            const config = await this.configManager.readConfig();

            if (!config.mcpServers[name]) {
                return res.status(404).json({
                    success: false,
                    error: `Server ${name} not found`
                });
            }

            delete config.mcpServers[name];
            await this.configManager.writeConfig(config);

            return res.status(200).json({
                success: true,
                message: `Server ${name} removed successfully`
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to remove MCP server'
            });
        }
    }
}
