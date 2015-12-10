#!/usr/bin/env bash
#
# Ruby
#
# Update all ruby gems.

source $DOTFILES/scripts/utils.sh

if [ $(which gem) ]; then
  e_header "Updating gems"

  # update gems and cleanup
  sudo gem update && sudo gem cleanup

  e_success "Updated gems successfully"
fi

exit 0
