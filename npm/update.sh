#!/usr/bin/env bash
#
# NPM
#
# This updates NPM and it's packages.

source $DOTFILES/scripts/utils.sh

if [ $(which npm) ]; then
  e_header "Updating global npm packages"

  # update NPM
  sudo npm install -g npm bower jshint sitemap-generator

  e_success "Updated npm packages successfully"
fi

exit 0
