#!/bin/bash

set -e

trap 'e_error "\nAn error occured. Aborting."' ERR

e_line "\nSetting up system. May require root password."

# enable zsh shell
if [[ "$SHELL" != "/bin/zsh" ]]; then
  chsh -s $(which zsh)
fi

e_header 'Install Oh My Zsh'
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

e_header 'Install ZSH theme'
mkdir -p "$ZSH_CUSTOM/themes/"
cd $DOTFILES
git clone https://github.com/denysdovhan/spaceship-prompt.git
cd spaceship-prompt
ln -s "$PWD/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"

# install homebrew
e_header "Install homebrew"
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

if [ $(which brew)]; then
  # install brew formulaes
  e_header "Install brew formulaes"
  brew install coreutils node ansible tree python3 homebrew/php/php56-xdebug

  # install yarn
  e_header "Install yarn"
  brew link --overwrite node
  brew install yarn

  # cleanup
  e_header "Cleanup homebrew stuff"
  brew doctor

  # install brew cask
  e_header "Install brew cask"
  brew tap caskroom/cask

  # install apps with cask
  e_header "Install apps with cask"
  brew cask install alfred google-chrome firefox visual-studio-code dropbox filezilla imageoptim spotify the-unarchiver virtualbox iterm2 vagrant postman caffeine
fi

# install global npm packages
if [ $(which npm) ]; then
  e_header "Install global node packages"
  npm install -g sitemap-generator-cli svgo n gzip-size-cli flow-typed create-react-app prettier git-open http-server npm-check fkill-cli strong-pwgen-cli

  # activate latest npm version
  e_header "Install stable and latest node versions"
  sudo n stable
  sudo n latest
fi

# install composer globally
e_header "Install composer globally"
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

e_line "Show invisible files on macOS"
defaults write com.apple.finder AppleShowAllFiles -bool true

# show file extensions
e_line "Show file extensions"
defaults write NSGlobalDomain AppleShowAllExtensions -bool true

# expand save dialog
e_line "Expand save dialog"
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true

# enable keyboard for dialogs
e_line "Enable keyboard for dialogs"
defaults write NSGlobalDomain AppleKeyboardUIMode -int 3

# use current dir as search scope
e_line "Use current directory as search scope"
defaults write com.apple.finder FXDefaultSearchScope -string "SCcf"

killall Finder

# save screenshots in a seperate folder
mkdir ~/Screenshots
defaults write com.apple.screencapture location ~/
killall SystemUIServer

e_success "System is ready to use!"
