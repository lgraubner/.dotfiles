#!/usr/bin/env bash
#
# System
#
# This updates system software.

source $DOTFILES/scripts/utils.sh

SECTION="System"

e_update $SECTION "nvm"

# update nvm
exec_task "curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash"

e_success

e_update $SECTION "composer"
# update composer
exec_task "composer self-update"
e_success

unset $SECTION
exit 0
