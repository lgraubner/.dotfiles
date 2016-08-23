#!/usr/bin/env bash
#
# System
#
# Installs miscellaneous software.

source $DOTFILES/scripts/utils.sh


# Check if NPM is installed
e_header "Installing Node version manager (nvm)... "
# autosetup
exec_task "curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash"
# refresh configuration
# @TODO refresh

# e_install "node" $SECTION
# exec_task "export NODE_LATEST=$(nvm ls-remote | tail -1 | xargs) && nvm install $NODE_LATEST && nvm alias default $NODE_LATEST"
# e_success

e_header "Installing composer..."

mkdir -p /usr/local/bin
# install composer globally
exec_task "curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer"


e_header "Setting OSX defaults..."

# Finder: show hidden files by default
e_line "Set show invisibles"
defaults write com.apple.finder AppleShowAllFiles -bool true


exit 0
