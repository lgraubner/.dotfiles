#!/usr/bin/env bash
#
# Ruby
#
# Installs useful gems.

source $DOTFILES/scripts/utils.sh

# Check if gem is installed
if [ $(which gem) ]; then
  e_header "Installing gems"

  # install gems
  sudo gem install sass jekyll bundler

  e_success "Gems installed successfully"
fi

exit 0
