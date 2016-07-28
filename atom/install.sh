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
  e_install "packages" $SECTION
  PACKAGES=("atom-ternjs" "auto-detect-indentation" "auto-update-packages" "autocomplete-modules" "autocomplete-php" "docblockr" "editorconfig" "emmet" "linter" "linter-eslint" "merge-conflicts" "minimap" "pigments" "react" "synced-sidebar" "file-icons" "atom-beautify")
  exec_task $(join " " "apm install" PACKAGES)
  e_success $(join ", " "installed " PACKAGES)
fi

unset $SECTION
exit 0
