#!/usr/bin/env bash

FILE_PATH=$1
FOLDER_ID="1rdoVa_Y_GAwOfIFzpKHfiGFHKurCXTtx"

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "File $FILE_PATH not found!"
    exit 1
fi

# Create a timestamp for versioning
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Create temporary directory
TEMP_DIR=$(mktemp -d)

# Extract filename without path
FILENAME=$(basename "$FILE_PATH")
FILENAME_BASE="${FILENAME%.*}"
FILENAME_EXT="${FILENAME##*.}"

# Create versioned filename
VERSIONED_FILENAME="${FILENAME_BASE}_${TIMESTAMP}.${FILENAME_EXT}"
VERSIONED_PATH="$TEMP_DIR/$VERSIONED_FILENAME"

# Copy the file to the temporary directory with versioned name
cp "$FILE_PATH" "$VERSIONED_PATH"

# Upload the versioned file
gdrive files upload --parent $FOLDER_ID "$VERSIONED_PATH"

# Check if the upload was successful
if [ ! $? -eq 0 ]; then
    echo "Upload failed!"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Clean up
rm -rf "$TEMP_DIR"
