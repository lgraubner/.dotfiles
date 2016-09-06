#!/usr/bin/env bash
#
# Homebrew
#
# This updates Homebrew and it's formulaes.

source $DOTFILES/scripts/utils.sh

SECTION="Homebrew"

if [[ $(which brew) ]]; then
    # reset permissions for node
    e_header "Reset permissions to avoid update problems..."
    e_line "/usr/local"
    sudo chown -R $(whoami) /usr/local
    e_header "Updating homebrew..."
    exec_task "brew update"

    e_header "Updating brew formulaes..."
    exec_task "brew upgrade --all"

    e_header "Cleaning up..."
    exec_task "brew cleanup"
fi

unset $SECTION
exit 0
