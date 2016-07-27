#!/usr/bin/env bash
#
# Ruby
#
# Installs useful gems.

source $DOTFILES/scripts/utils.sh

SECTION="Ruby"

# Check if gem is installed
if [ $(which gem) ]; then
  e_install $SECTION "gems"

  # install gems
  exec_task "sudo gem install sass jekyll bundler"

  e_success
fi

unset $SECTION
exit 0
