#!/usr/bin/env bash
#
# Ruby
#
# Installs useful gems.

source $DOTFILES/scripts/utils.sh

SECTION="Ruby"

# Check if gem is installed
if [ $(which gem) ]; then
  e_install "gems" $SECTION

  # install gems
  gems="sass jekyll bundler"
  exec_task "sudo gem install "$gems

  e_success "installed "$gems
fi

unset $SECTION
exit 0
