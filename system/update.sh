#!/usr/bin/env bash
#
# System
#
# This updates system software.

source $DOTFILES/scripts/utils.sh

e_header "updating node version manager (nvm)..."
# update nvm
exec_task "curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash"

e_header "updating composer..."
# update composer
exec_task "composer self-update"

unset $SECTION
exit 0
