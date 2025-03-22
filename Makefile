# Claude Desktop config paths
CLAUDE_CONFIG_HOST := ${HOME}/.config/Claude/claude_desktop_config.json
CLAUDE_CONFIG_REPO := ${PWD}/mcp/claude_desktop_config.json

.PHONY: apply-claude-config
apply-claude-config:
	@echo "Creating backup of existing Claude config..."
	@if [ -f "$(CLAUDE_CONFIG_HOST)" ]; then \
		mv "$(CLAUDE_CONFIG_HOST)" "$(CLAUDE_CONFIG_HOST).backup"; \
	fi
	@echo "Creating symlink for Claude config..."
	@mkdir -p "${HOME}/.config/Claude"
	@ln -sf "$(CLAUDE_CONFIG_REPO)" "$(CLAUDE_CONFIG_HOST)"
	@echo "Claude config applied successfully!" 

.PHONY: save-bookmarks
save-bookmarks:
	@echo "Saving TCC bookmarks..."
	@chmod +x bookmarks/save-bookmarks.sh
	@sh bookmarks/save-bookmarks.sh
