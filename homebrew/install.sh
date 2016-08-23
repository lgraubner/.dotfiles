#!/usr/bin/env bash
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.

source $DOTFILES/scripts/utils.sh

# Check for Homebrew
if [ ! $(which brew) ]; then

    e_header "Installing homebrew..."
    # Install the correct homebrew for each OS type
    if is_osx; then
        exec_task "ruby -e \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)\""
    else
        exec_task "ruby -e \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)\""
    fi

    e_header "cleanup and update..."
    exec_task "brew doctor && brew update"
fi

e_header "Installing homebrew cask..."
exec_task "brew tap caskroom/cask"

# Install homebrew packages
e_header "Installing homebrew formulaes"
formulaes=("grc" "coreutils" "spark" "node" "ansible" "tree")
cmd="brew install "
counter=1
for formulae in ${formulaes[@]}
do
  echo -ne "\r\033[2K   ${formulae} (${counter}/${#formulaes[@]})"
  exec_task "${cmd} ${pkg}"
  counter=$((counter+1))
done
echo -e "\r\033[2K\033[37m   installed ${counter} formulaes\033[0m"

# Install cask packages
e_header "Installing cask packages..."
cformulaes=("wget" "alfred" "hyperterm" "atom" "google-chrome" "firefox" "slack" "skype" "poedit")
cmd="brew cask install "
counter=1
for cformulae in ${cformulaes[@]}
do
  echo -ne "\r\033[2K   ${cformulae} (${counter}/${#cformulaes[@]})"
  exec_task "${cmd} ${pkg}"
  counter=$((counter+1))
done
echo -e "\r\033[2K\033[37m   installed ${counter} cask formulaes\033[0m"

unset $SECTION
exit 0
