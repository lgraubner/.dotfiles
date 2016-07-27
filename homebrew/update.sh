#!/usr/bin/env bash
#
# Homebrew
#
# This updates Homebrew and it's formulaes.

source $DOTFILES/scripts/utils.sh

if [[ $(which brew) ]]; then
    e_update "Homebrew"
    # reset permissions for node
    sudo chown -R $(whoami) /usr/local
    exec_task "brew update"
    e_success

    e_update "Homebrew formulaes"
    exec_task "brew upgrade --all && brew cleanup"
    e_success
fi

exit 0
