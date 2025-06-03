
.PHONY: save-bookmarks
save-bookmarks:
	@echo "Saving outer TCC bookmarks..."
	@chmod +x bookmarks/save-bookmarks.sh
	@bookmarks/save-bookmarks.sh "$(COMMIT_MSG)"
