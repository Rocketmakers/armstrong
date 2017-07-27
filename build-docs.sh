#!/bin/bash
set -e

export PATH="$HOME/.nodenv/bin:$HOME/.yarn/bin:$PATH"
eval "$(nodenv init -)"

./build-docs.rb "$@"
