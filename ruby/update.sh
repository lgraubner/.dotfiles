#!/usr/bin/env bash
#
# Ruby
#
# Update all ruby gems.

source $DOTFILES/scripts/utils.sh

if [ $(which gem) ]; then
  e_header "Update ruby gems"

  # update gems
  (sudo gem update) > /dev/null 2>&1

  e_success
fi

exit 0
