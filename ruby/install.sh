#!/usr/bin/env bash
#
# Ruby
#
# Installs useful gems.

source $DOTFILES/scripts/utils.sh

# Check if gem is installed
if [ $(which gem) ]; then
  e_install "Ruby gems"

  # install gems
  exec_task "sudo gem install sass jekyll bundler"

  e_success
fi

exit 0
