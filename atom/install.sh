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

  packages=("atom-ternjs" "auto-detect-indentation" "auto-update-packages" "autocomplete-modules" "autocomplete-php" "docblockr" "editorconfig" "emmet" "linter" "linter-eslint" "merge-conflicts" "minimap" "pigments" "react" "synced-sidebar" "file-icons" "atom-beautify" "cobalt2-syntax" "highlight-selected" "linter-stylelint")
  cmd="apm install "
  counter=1
  for pkg in ${packages[@]}
  do
    echo -ne "\r\033[2K=> installing ${pkg} (${counter}/${#packages[@]})"
    exec_task "${cmd} ${pkg}"
    counter=$((counter+1))
  done
  echo -e "\r\033[2K\033[32m=> ok: installed ${counter} packages\033[0m"
fi

unset $SECTION
exit 0
