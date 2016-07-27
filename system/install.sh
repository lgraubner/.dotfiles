#!/usr/bin/env bash
#
# System
#
# Installs miscellaneous software.

source $DOTFILES/scripts/utils.sh

SECTION="System"

# Check if NPM is installed
e_install $SECTION "nvm"
# autosetup
exec_task "curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash"
e_success

e_install $SECTION "composer"

mkdir -p /usr/local/bin
# install composer globally
exec_task "curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer"

e_success

e_header "Set OSX defaults"

# Finder: show hidden files by default
defaults write com.apple.finder AppleShowAllFiles -bool true

e_success

exit 0
