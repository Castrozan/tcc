#!/usr/bin/env bash
# This script extracts the outer TCC folder from Brave's bookmarks file
# and saves it as ./bookmarks/bookmarks.json in the repo.
# Ensure that jq is installed and Brave is closed for consistency.

BOOKMARKS_FILE="$HOME/.config/BraveSoftware/Brave-Browser/Default/Bookmarks"

if [ ! -f "$BOOKMARKS_FILE" ]; then
    echo "Bookmarks file not found at: $BOOKMARKS_FILE"
    exit 1
fi

# If the root object is TCC, return it directly.
# Otherwise, perform a pre-order traversal and return the first occurrence.
TCC_JSON=$(jq 'if .name == "TCC" then . else first(.. | objects | select(.name? == "TCC")) end' "$BOOKMARKS_FILE")

if [ -z "$TCC_JSON" ] || [ "$TCC_JSON" = "null" ]; then
    echo "No folder named 'TCC' found in the bookmarks file."
    exit 1
fi

OUTPUT_FILE="./bookmarks/bookmarks.json"
echo "$TCC_JSON" >"$OUTPUT_FILE"
echo "Outer TCC bookmarks exported to $OUTPUT_FILE."
