#!/usr/bin/env bash

DIR=$1
cd $DIR;

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" = "$REMOTE" ]; then
    STATUS="Up-to-date"
  elif [ "$LOCAL" = "$BASE" ]; then
    STATUS="Need to pull"
  elif [ "$REMOTE" = "$BASE" ]; then
    STATUS="Need to push"
  else
    STATUS="Diverged"
fi
  echo ${STATUS}
