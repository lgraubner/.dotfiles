#!/usr/bin/env bash
#
# NPM
#
# Installs useful npm packages.

source ~/.dotfiles/scripts/utils.sh

# Check if NPM is installed
if [ $(which npm) ]; then
  _running "Updating NPM"
  echo ''

  # update NPM
  sudo npm install -g npm

  echo ''
  _success "Updated NPM successfully"
  _running "Installing dependencies"

  echo ''
  sudo npm install -g bower jshint sitemap-generator
  echo ''

  _success "Dependencies installed successfully"
fi

exit 0
