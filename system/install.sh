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

exit 0
