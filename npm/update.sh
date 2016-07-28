#!/usr/bin/env bash
#
# NPM
#
# This updates NPM and it's packages.

source $DOTFILES/scripts/utils.sh

SECTION="NPM"

if [ $(which npm) ]; then
  e_update "packages" $SECTION
  # update NPM
  exec_task "sudo npm update -g"
  e_success
fi

unset $SECTION
exit 0
