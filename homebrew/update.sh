#!/usr/bin/env bash
#
# Homebrew
#
# This updates Homebrew and it's formulaes.

source $DOTFILES/scripts/utils.sh

if [[ $(which brew) ]]; then
    e_header "Updating Homebrew and upgrading formulaes"
    brew update
    brew upgrade --all
    brew cleanup
    e_success "Updated and upgraded homebrew successfully"
fi

exit 0
