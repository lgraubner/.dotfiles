#!/usr/bin/env bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

source $DOTFILES/scripts/utils.sh

# Check for Homebrew
if [ ! $(which brew) ]; then
  e_header "Install Homebrew"

    # Install the correct homebrew for each OS type
    if is_osx; then
        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    else
        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
    fi

    brew doctor
    brew update

    e_success
fi

e_header "Install cask"

brew tap caskroom/cask

e_success

# Install homebrew packages
e_header "Install Homebrew formulaes"
brew install grc coreutils spark node ansible
e_success

# TODO: install cask apps

exit 0
