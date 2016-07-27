#!/usr/bin/env bash
#
# Homebrew
#
# This updates Homebrew and it's formulaes.

source $DOTFILES/scripts/utils.sh

if [[ $(which brew) ]]; then
    e_header "Update Homebrew"

    # reset permissions for node
    sudo chown -R $(whoami) /usr/local

    brew update
    e_success

    e_header "Update Homebrew formulaes"
    brew upgrade --all
    brew cleanup
    e_success
fi

exit 0
