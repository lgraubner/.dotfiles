#!/usr/bin/env bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

source $DOTFILES/scripts/utils.sh

SECTION="Homebrew"

# Check for Homebrew
if [ ! $(which brew) ]; then
  e_install "brew" $SECTION

    # Install the correct homebrew for each OS type
    if is_osx; then
        exec_task "ruby -e \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)\""
    else
        exec_task "ruby -e \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)\""
    fi

    exec_task "brew doctor && brew update"

    e_success
fi

e_install "cask" $SECTION
exec_task "brew tap caskroom/cask"
e_success

# Install homebrew packages
e_install "formulae" $SECTION
formulaes=("grc" "coreutils" "spark" "node" "ansible")
cmd="brew install "
counter=1
for formulae in ${formulaes[@]}
do
  echo -ne "\r\033[2K=> installing ${formulae} (${counter}/${#formulaes[@]})"
  exec_task "${cmd} ${pkg}"
  counter=$((counter+1))
done
echo -e "\r\033[2K=> installed ${counter} formulaes"
e_success

# Install cask packages
e_install "cask formulae" $SECTION
cformulaes=("wget" "alfred" "hyperterm" "atom" "google-chrome" "firefox" "slack" "skype")
cmd="brew cask install "
counter=1
for cformulae in ${cformulaes[@]}
do
  echo -ne "\r\033[2K=> installing ${cformulae} (${counter}/${#cformulaes[@]})"
  exec_task "${cmd} ${pkg}"
  counter=$((counter+1))
done
echo -e "\r\033[2K=> installed ${counter} cask formulaes"
e_success

unset $SECTION
exit 0
