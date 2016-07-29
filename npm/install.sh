#!/usr/bin/env bash
#
# NPM
#
# Installs useful npm packages.

source $DOTFILES/scripts/utils.sh

SECTION="NPM"

# Check if NPM is installed
if [ $(which npm) ]; then
  e_update "npm" $SECTION
  exec_task "sudo npm install -g npm"
  e_success

  e_install "packages" $SECTION
  # update NPM
  packages="sitemap-generator-cli w3c-validator-cli gulp-cli"
  exec_task "sudo npm install -g "$packages
  e_success "installed "$packages
fi

unset $SECTION
exit 0
