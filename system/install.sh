#!/usr/bin/env bash
#
# System
#
# Installs miscellaneous software.

source $DOTFILES/scripts/utils.sh


# activate stable node versionm
e_header "Activating stable node version "
# autosetup
exec_task "n stable"

e_header "Installing composer..."

mkdir -p /usr/local/bin
# install composer globally
exec_task "curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer"


e_header "Setting OSX defaults..."

# Finder: show hidden files by default
e_line "Set show invisibles"
defaults write com.apple.finder AppleShowAllFiles -bool true


exit 0
