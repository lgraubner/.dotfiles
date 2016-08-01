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

  packages=("atom-ternjs" "auto-detect-indentation" "auto-update-packages" "autocomplete-modules" "autocomplete-php" "docblockr" "editorconfig" "emmet" "linter" "linter-eslint" "merge-conflicts" "minimap" "pigments" "react" "synced-sidebar" "file-icons" "atom-beautify" "cobalt2-syntax")
  cmd="apm install "
  for pkg in ${packages[@]}
  do
    cmd=$cmd$pkg
  done
  exec_task $cmd
  e_success ${cmd/"apm install "/"installed "}
fi

unset $SECTION
exit 0
