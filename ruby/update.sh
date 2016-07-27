#!/usr/bin/env bash
#
# Ruby
#
# Update all ruby gems.

source $DOTFILES/scripts/utils.sh

if [ $(which gem) ]; then
  e_update "ruby gems"

  # update gems
  exec_task "sudo gem update"

  e_success
fi

exit 0
