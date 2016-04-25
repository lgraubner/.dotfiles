#!/usr/bin/env bash
#
# NPM
#
# Installs useful npm packages.

source $DOTFILES/scripts/utils.sh

# Check if NPM is installed
if [ $(which npm) ]; then
  e_header "Installing global npm packages"

  # update NPM
  sudo npm install -g npm
  sudo npm install -g bower sitemap-generator-cli w3c-validator-cli gulp-cli

  e_success "Dependencies installed successfully"
fi

exit 0
