#!/usr/bin/env bash
#
# System
#
# This updates system software.

source $DOTFILES/scripts/utils.sh

e_header "Update nvm"

# update nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash

e_success

e_header "Update composer"
# update composer
composer self-update
e_success

exit 0
