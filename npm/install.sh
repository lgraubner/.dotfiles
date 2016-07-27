#!/usr/bin/env bash
#
# NPM
#
# Installs useful npm packages.

source $DOTFILES/scripts/utils.sh

# Check if NPM is installed
if [ $(which npm) ]; then
  e_update "npm"
  exec_task "sudo npm install -g npm"
  e_success

  e_install "Global npm packages"
  # update NPM
  exec_task "sudo npm install -g bower sitemap-generator-cli w3c-validator-cli gulp-cli"
  e_success
fi

exit 0
