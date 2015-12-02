#!/usr/bin/env bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

source $DOTFILES/scripts/utils.sh

# Check for Homebrew
if [ ! $(which brew) ]; then
  e_header "Installing Homebrew"

    # Install the correct homebrew for each OS type
    if is_osx; then
        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    else
        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
    fi

    brew doctor
    brew update

    e_success "Homebrew installed"
fi

# Install homebrew packages
e_header "Installing Homebrew formulaes"
brew install grc coreutils spark node
e_success "Required formulaes installed"

exit 0
