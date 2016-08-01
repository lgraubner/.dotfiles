#!/usr/bin/env bash
#
# Ruby
#
# Installs useful gems.

source $DOTFILES/scripts/utils.sh

SECTION="Ruby"

# Check if gem is installed
if [ $(which gem) ]; then
  e_install "gems" $SECTION

  # install gems
  gems=("sass" "jekyll" "bundler")
  cmd="gem install "
  counter=1
  for gem in ${gems[@]}
  do
    echo -ne "\r\033[2K=> installing ${gem} (${counter}/${#gems[@]})"
    exec_task "${cmd} ${gem}"
    counter=$((counter+1))
  done
  echo -e "\r\033[2K\033[32m=> ok: installed ${counter} gems\033[0m"
fi

unset $SECTION
exit 0
