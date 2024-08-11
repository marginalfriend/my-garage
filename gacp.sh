#!/bin/bash

# Check if a commit message was provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide a commit message."
    echo "Usage: $0 <commit message>"
    exit 1
fi

# Combine all arguments into a single commit message
commit_message="$*"

# Git add all changes
git add .

# Git commit with the provided message
git commit -m "$commit_message"

# Git push
git push

echo "Changes added, committed, and pushed successfully."