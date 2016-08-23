#!/usr/bin/env bash
#
# NPM
#
# This updates NPM and it's packages.

source $DOTFILES/scripts/utils.sh

if [ $(which npm) ]; then
  e_header "Update npm"
  e_line "updating global npm packages..."
  # update NPM
  exec_task "sudo npm update -g"
  e_success
fi

unset $SECTION
exit 0
