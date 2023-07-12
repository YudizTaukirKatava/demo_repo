#!/bin/bash

# Define the remote server details
REMOTE_HOST="3.89.205.58"
REMOTE_USER="ubuntu"
REMOTE_DIR="/home/ubuntu"

# Get the list of deleted files using Git
DELETED_FILES=$(git diff --name-only HEAD HEAD^ --diff-filter=D)

# Connect to the remote server and delete the files
ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_DIR} && rm ${DELETED_FILES}"

echo "Deleted files on the remote server: ${DELETED_FILES}"
