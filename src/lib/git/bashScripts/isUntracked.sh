#!/usr/bin/env bash
DIR=$1

cd $DIR;
git diff-index --quiet HEAD -- || echo "true"
