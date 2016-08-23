#!/usr/bin/env bash
#
# Homebrew
#
# This updates Homebrew and it's formulaes.

source $DOTFILES/scripts/utils.sh

SECTION="Homebrew"

if [[ $(which brew) ]]; then
    e_header "Update homebrew"
    # reset permissions for node
    e_line "reset permissions to avoid update problems..."
    sudo chown -R $(whoami) /usr/local
    e_line "updating homebrew itself..."
    exec_task "brew update"
    e_success

    e_line "updating formulaes..."
    exec_task "brew upgrade --all && brew cleanup"
    e_success
fi

unset $SECTION
exit 0
