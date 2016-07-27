#!/usr/bin/env bash
#
# NPM
#
# Installs useful npm packages.

source $DOTFILES/scripts/utils.sh

# Check if NPM is installed
if [ $(which npm) ]; then
  e_header "Update npm"
  (sudo npm install -g npm) > /dev/null 2>&1
  e_success

  e_header "Install global npm packages"
  # update NPM
  (sudo npm install -g bower sitemap-generator-cli w3c-validator-cli gulp-cli) > /dev/null 2>&1
  e_success
fi

exit 0
