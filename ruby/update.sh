#!/usr/bin/env bash
#
# Ruby
#
# Update all ruby gems.

source $DOTFILES/scripts/utils.sh

if [ $(which gem) ]; then

  # update gems
  e_header "Updating installed ruby gems..."
  exec_task "sudo gem update"

fi

unset $SECTION
exit 0
