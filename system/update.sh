#!/usr/bin/env bash
#
# System
#
# This updates system software.

source $DOTFILES/scripts/utils.sh

e_header "Update system"

e_line "updating nvm..."
# update nvm
exec_task "curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash"

e_success

e_line "updating composer..."
# update composer
exec_task "composer self-update"
e_success

unset $SECTION
exit 0
