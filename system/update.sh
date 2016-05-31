#!/usr/bin/env bash
#
# System
#
# This updates system software.

source $DOTFILES/scripts/utils.sh

e_header "Updating nvm"

# update nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash

e_success "Updated nvm successfully"

e_header "Updating composer itself"
# update composer
composer self-update

e_success "Updated composer successfully"

exit 0
