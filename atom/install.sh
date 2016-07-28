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
  packages=("atom-ternjs" "auto-detect-indentation" "auto-update-packages" "autocomplete-modules" "autocomplete-php" "docblockr" "editorconfig" "emmet" "linter" "linter-eslint" "merge-conflicts" "minimap" "pigments" "react" "synced-sidebar" "file-icons" "atom-beautify")
  pkg_str=(IFS=$" " ; echo "${PACKAGES[*]}")

  command="apm install "
  msg="installed "

  exec_task $command$pkg_str
  e_success $msg$pack_str
fi

unset $SECTION
exit 0
