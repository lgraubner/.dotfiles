#!/usr/bin/env bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

source $ZSH/scripts/utils.sh

# Check for Homebrew
if [ ! $(which brew) ]; then
  _running "Installing Homebrew"
  echo ''

  # Install the correct homebrew for each OS type
  if [ "$(uname)" = "Darwin" ]; then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  elif [ "$(expr substr $(uname -s) 1 5)" = "Linux" ]; then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
  fi

  echo ''
  _success "Homebrew installed"
fi

# Install homebrew packages
_running "Installing Homebrew formulaes"
echo ''
brew install grc coreutils spark node
echo ''
_success "Required formulaes installed"

exit 0
