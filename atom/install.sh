#!/usr/bin/env bash
#
# Atom
#
# Installs useful Atom packages.
#

source $DOTFILES/scripts/utils.sh

SECTION="Atom"

# Check if NPM is installed
if [ $(which apm) ]; then
  e_install $SECTION "packages"
  exec_task "apm install atom-ternjs auto-detect-indentation auto-update-packages autocomplete-modules autocomplete-php docblockr editorconfig emmet linter linter-eslint merge-conflicts minimap pigments react synced-sidebar file-icons atom-beautify"
  e_success
fi

unset $SECTION
exit 0
