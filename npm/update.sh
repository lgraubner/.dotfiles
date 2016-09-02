#!/usr/bin/env bash
#
# NPM
#
# This updates NPM and it's packages.

source $DOTFILES/scripts/utils.sh

if [ $(which npm) ]; then
  e_header "Updating global npm packages..."
  # update NPM
  exec_task "sudo npm update -g"
  e_line "npm v$(npm -v)"
fi

unset $SECTION
exit 0
