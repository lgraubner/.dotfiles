#!/usr/bin/env bash
#
# System
#
# Installs miscellaneous software.

source $DOTFILES/scripts/utils.sh

# Check if NPM is installed
e_header "Installing nvm"

# autosetup
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash

e_success "nvm installed successfully"

e_header "Installing composer"

mkdir -p /usr/local/bin
# install composer globally
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

e_success "Successfully installed composer"

e_header "setting OSX defaults"

# Finder: show hidden files by default
defaults write com.apple.finder AppleShowAllFiles -bool true

e_success "done"

exit 0
