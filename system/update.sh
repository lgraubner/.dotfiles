#!/usr/bin/env bash
#
# System
#
# This updates system software.

source $DOTFILES/scripts/utils.sh

e_update "nvm"

# update nvm
exec_task "curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash"

e_success

e_update "composer"
# update composer
exec_task "composer self-update"
e_success

exit 0
