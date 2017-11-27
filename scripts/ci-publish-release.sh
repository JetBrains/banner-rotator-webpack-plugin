#!/usr/bin/env bash

set -e -x

git config user.email "builder@circleci.com"
git config user.name "Circle CI"

# Make semantic release
$(npm bin)/standard-version --message 'chore(release): %s [skip ci]' --no-verify

# Publish to NPM
$(npm bin)/ci-publish

# Push to github only if package successfully published to NPM
git push --follow-tags origin master
