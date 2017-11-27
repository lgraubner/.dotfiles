#!/bin/bash

set -e

# load logging functions
source $DOTFILES/lib/utils.sh

trap 'e_error "\nAn error occured. Aborting."' ERR

e_line "\nUpdating software. May require root password."

# reset permissions to avoid update problems
e_header "Updating brew and formulaes"
sudo chown -R $(whoami) $(brew --prefix)/*

# update homebrew
brew update

# update brew formulaes
brew upgrade

# cleanup
brew cleanup

# update global node packages
e_header "Updating global node packages"
if [ $(which npm) ]; then
  npm update -g
fi

# update composer
e_header "Updating composer"
composer self-update

e_success "Software is up to date. Your system is ready to use!"
