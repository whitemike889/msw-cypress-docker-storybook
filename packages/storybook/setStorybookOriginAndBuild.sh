#!/bin/bash

# Set STORYBOOK_ORIGIN based on BRANCH_NAME
if [ "$BRANCH_NAME" == "master" ]; then
  STORYBOOK_ORIGIN="/test-repo"
else
  STORYBOOK_ORIGIN="/test-repo/$BRANCH_NAME"
fi

# Export the environment variable
export STORYBOOK_ORIGIN
echo "STORYBOOK_ORIGIN: $STORYBOOK_ORIGIN"

yarn run build-storybook
