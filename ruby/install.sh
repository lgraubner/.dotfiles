#!/usr/bin/env bash
#
# Ruby
#
# Installs useful gems.

source $DOTFILES/scripts/utils.sh

# Check if gem is installed
if [ $(which gem) ]; then
  e_header "Installing Ruby gems..."

  # install gems
  gems=("sass" "jekyll" "bundler")
  cmd="gem install "
  counter=1
  for gem in ${gems[@]}
  do
    echo -ne "\r\033[2K   ${gem} (${counter}/${#gems[@]})"
    exec_task "${cmd} ${gem}"
    counter=$((counter+1))
  done
  echo -e "\r\033[2K\033[32m   installed ${counter} gems\033[0m"
fi

unset $SECTION
exit 0
