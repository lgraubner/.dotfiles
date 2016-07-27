#!/usr/bin/env bash
#
# Homebrew
#
# This updates Homebrew and it's formulaes.

source $DOTFILES/scripts/utils.sh

SECTION="Homebrew"

if [[ $(which brew) ]]; then
    e_update $SECTION "brew"
    # reset permissions for node
    sudo chown -R $(whoami) /usr/local
    exec_task "brew update"
    e_success

    e_update $SECTION "formulaes"
    exec_task "brew upgrade --all && brew cleanup"
    e_success
fi

unset $SECTION
exit 0
