#!/usr/bin/env bash
#
# System
#
# Installs miscellaneous software.

source $DOTFILES/scripts/utils.sh

# Check if NPM is installed
e_install "nvm"
# autosetup
(curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash) > /dev/null 2>&1
e_success

e_install "composer"

mkdir -p /usr/local/bin
# install composer globally
(curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer) > /dev/null 2>&1

e_success

e_header "Set OSX defaults"

# Finder: show hidden files by default
defaults write com.apple.finder AppleShowAllFiles -bool true

e_success

exit 0
