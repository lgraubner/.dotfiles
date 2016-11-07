#!/usr/bin/env bash
#
# Atom
#
# Installs useful Atom packages.
#

source $DOTFILES/scripts/utils.sh

# Check if NPM is installed
if [ $(which apm) ]; then

  e_header "Installing atom packages..."
  packages=("atom-ternjs" "auto-update-packages" "autocomplete-modules" "autocomplete-php" "docblockr" "editorconfig" "emmet" "linter" "linter-eslint" "merge-conflicts" "minimap" "pigments" "react" "synced-sidebar" "file-icons" "atom-beautify" "cobalt2-syntax" "highlight-selected" "linter-stylelint")
  cmd="apm install "
  counter=1
  for pkg in ${packages[@]}
  do
    echo -ne "\r\033[2K   ${pkg} (${counter}/${#packages[@]})"
    exec_task "${cmd} ${pkg}";
    counter=$((counter+1))
  done
  echo -e "\r\033[2K\033[37m   installed ${counter} packages\033[0m"
fi

unset $SECTION
exit 0
