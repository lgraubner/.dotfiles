#!/usr/bin/env bash
#
# NPM
#
# Installs useful npm packages.

source $DOTFILES/scripts/utils.sh

SECTION="NPM"

# Check if NPM is installed
if [ $(which npm) ]; then
  e_update "npm" $SECTION
  exec_task "sudo npm install -g npm"
  e_success

  e_install "packages" $SECTION
  # update NPM
  packages=("sitemap-generator-cli" "w3c-validator-cli" "gulp-cli" "webpack")
  cmd="npm install -g "
  counter=1
  for pkg in ${packages[@]}
  do
    echo -ne "\r\033[2K=> installing ${pkg} (${counter}/${#packages[@]})"
    exec_task "${cmd} ${pkg}"
    counter=$((counter+1))
  done
  echo -e "\r\033[2K=> installed ${counter} packages"
  e_success
fi

unset $SECTION
exit 0
