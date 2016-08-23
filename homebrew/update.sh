#!/usr/bin/env bash
#
# Homebrew
#
# This updates Homebrew and it's formulaes.

source $DOTFILES/scripts/utils.sh

SECTION="Homebrew"

if [[ $(which brew) ]]; then
    # reset permissions for node
    e_header "reset permissions to avoid update problems..."
    sudo chown -R $(whoami) /usr/local
    e_header "updating homebrew itself..."
    exec_task "brew update"

    e_header "updating all formulaes..."
    exec_task "brew upgrade --all"

    e_header "cleaning up..."
    exec_task "brew cleanup"
fi

unset $SECTION
exit 0
