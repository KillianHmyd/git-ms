#!/usr/bin/env bash

DIR=$1
cd $DIR;

git symbolic-ref --short HEAD;
