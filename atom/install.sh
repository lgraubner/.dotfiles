#!/usr/bin/env bash
#
# Atom
#
# Installs useful Atom packages.
#

source $DOTFILES/scripts/utils.sh

# Check if NPM is installed
if [ $(which apm) ]; then
  e_header "Installing atom packages"

  # update NPM
  apm install autocomplete-php color-picker docblockr emmet linter linter-jshint minimap travis-ci-status

  e_success "Packages installed successfully"
fi

exit 0
