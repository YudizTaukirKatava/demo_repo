#!/bin/bash

# Get the list of deleted files using Git
DELETED_FILES=$(git diff --name-only --diff-filter=D HEAD^)

# Delete the files on the production server
rm -f ${DELETED_FILES}

echo "Deleted files on the production server: ${DELETED_FILES}"
