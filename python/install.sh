#!/usr/bin/env bash
#
# Python
#
# Installs global python packages.

source $DOTFILES/scripts/utils.sh

if [ $(which pip) ]; then

  e_header "Installing global python packages..."
  # update NPM
  packages=("virtualenv")
  cmd="pip install "
  counter=1
  for pkg in ${packages[@]}
  do
    echo -ne "\r\033[2K   ${pkg} (${counter}/${#packages[@]})"
    exec_task "${cmd} ${pkg}"
    counter=$((counter+1))
  done
  echo -e "\r\033[2K\033[37m   installed ${counter} packages\033[0m"
fi

unset $SECTION
exit 0
