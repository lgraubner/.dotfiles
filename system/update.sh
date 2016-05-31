#!/usr/bin/env bash
#
# System
#
# This updates system software.

source $DOTFILES/scripts/utils.sh

e_header "Updating global npm packages"

# update nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
# update composer
composer self-update

e_success "Updated nvm successfully"

exit 0
