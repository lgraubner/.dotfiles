#!/usr/bin/env bash
#
# NPM
#
# This updates NPM and it's packages.

source $DOTFILES/scripts/utils.sh

if [ $(which npm) ]; then
  e_header "Update global npm packages"

  # update NPM
  sudo npm update -g

  e_success
fi

exit 0
