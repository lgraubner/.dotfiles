#!/usr/bin/env bash
#
# Ruby
#
# Update all ruby gems.

source $DOTFILES/scripts/utils.sh

if [ $(which gem) ]; then
  e_header "Update ruby"

  # update gems
  e_line "updating ruby gems..."
  exec_task "sudo gem update"

  e_success
fi

unset $SECTION
exit 0
