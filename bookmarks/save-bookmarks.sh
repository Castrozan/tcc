#!/usr/bin/env bash
# This script extracts the outer TCC folder from Brave's bookmarks file
# and saves it as ./bookmarks/bookmarks.json in the repo.
# It then adds the file to Git and commits it using an optional commit message.
# Usage:
#   ./bookmarks/save-bookmarks.sh "Your custom commit message"
# If no message is provided, it defaults to "docs: bookmarks <current date>".
#
# Ensure that jq is installed and Brave is closed for consistency.

# Define the path to the Brave bookmarks file
BOOKMARKS_FILE="$HOME/.config/BraveSoftware/Brave-Browser/Default/Bookmarks"

# Verify that the bookmarks file exists
if [ ! -f "$BOOKMARKS_FILE" ]; then
    echo "Bookmarks file not found at: $BOOKMARKS_FILE"
    exit 1
fi

# Use a pre-order traversal: if the root object is TCC, use it; otherwise, take the first TCC encountered.
TCC_JSON=$(jq 'if .name == "TCC" then . else first(.. | objects | select(.name? == "TCC")) end' "$BOOKMARKS_FILE")

# Check if a TCC folder was found
if [ -z "$TCC_JSON" ] || [ "$TCC_JSON" = "null" ]; then
    echo "No folder named 'TCC' found in the bookmarks file."
    exit 1
fi

# Save the extracted JSON to a file in the repo
OUTPUT_FILE="./bookmarks/bookmarks.json"
echo "$TCC_JSON" >"$OUTPUT_FILE"
echo "Outer TCC bookmarks exported to $OUTPUT_FILE."

# If the repository is under Git, add and commit the bookmarks file.
if [ -d ".git" ]; then

    # TODO: fix custom message. Its not working.
    # Use the provided commit message, or default to "docs: bookmarks <current date>"
    if [ -z "$1" ]; then
        COMMIT_MSG="docs: bookmarks $(date +'%Y-%m-%d')"
    else
        COMMIT_MSG="$1"
    fi

    git add "$OUTPUT_FILE"
    git commit -m "$COMMIT_MSG"
    echo "Bookmarks file added to Git and committed with message: $COMMIT_MSG"
fi
