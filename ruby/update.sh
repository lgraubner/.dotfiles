#!/usr/bin/env bash
#
# Ruby
#
# Update all ruby gems.

source $DOTFILES/scripts/utils.sh

if [ $(which gem) ]; then
  e_header "Updating gems"

  # update gems
  sudo gem update -system
  sudo gem update

  e_success "Updated gems successfully"
fi

exit 0
