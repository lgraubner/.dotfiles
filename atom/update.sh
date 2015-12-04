#!/usr/bin/env bash
#
# Atom
#
# This updates all atom packages.

source $DOTFILES/scripts/utils.sh

if [ $(which apm) ]; then
    e_header "Updating atom packages"

    for dir in $(find ~/.atom/packages -type d -maxdepth 1 -mindepth 1); do cd "$dir"
            e_arrow "Updating plugin: $(basename $PWD)"
            apm upgrade -c false
    done
    
    e_success "Packages updated successfully"
fi

exit 0
