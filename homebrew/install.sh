#!/usr/bin/env bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

source $DOTFILES/scripts/utils.sh

SECTION="Homebrew"

# Check for Homebrew
if [ ! $(which brew) ]; then
  e_install "brew" $SECTION

    # Install the correct homebrew for each OS type
    if is_osx; then
        exec_task "ruby -e \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)\""
    else
        exec_task "ruby -e \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)\""
    fi

    exec_task "brew doctor && brew update"

    e_success
fi

e_install "cask" $SECTION
exec_task "brew tap caskroom/cask"
e_success

# Install homebrew packages
e_install "formulae" $SECTION
exec_task "brew install grc coreutils spark node ansible"
e_success

# TODO: install cask apps

unset $SECTION
exit 0
