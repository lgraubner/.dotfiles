#!/usr/bin/env bash
#
# Ruby
#
# Update all ruby gems.

source $DOTFILES/scripts/utils.sh

SECTION="Ruby"

if [ $(which gem) ]; then
  e_update "gems" $SECTION

  # update gems
  e_line "update ruby gems"
  exec_task "sudo gem update"

  e_success
fi

unset $SECTION
exit 0
