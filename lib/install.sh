#!/bin/bash

set -e

# load logging functions
source $DOTFILES/lib/utils.sh

trap 'e_error "\nAn error occured. Aborting."' ERR

# install homebrew
e_header "Install homebrew"
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# install brew formulaes
e_header "Install brew formulaes"
brew install coreutils node ansible tree python3 watchman

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
brew cask install alfred google-chrome firefox visual-studio-code applepi-baker dropbox filezilla imageoptim spotify the-unarchiver virtualbox iterm2 vagrant 1password hipchat postman

# install global npm packages
if [ $(which npm) ]; then
  e_header "Install global node packages"
  npm install -g eslint sitemap-generator-cli webpack svgo n gzip-size-cli flow-bin npx gatsby-cli create-react-native-app flow-typed create-react-app react-native-cli prettier

  # activate latest npm version
  e_header "Install stable and latest node versions"
  sudo n stable
  sudo n latest

  # login
  npm adduser
fi

# install composer globally
e_header "Install composer globally"
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

## set macOS options
# show invisible files
e_header "Set macOS options and defaults"

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

e_success "System is ready to use!"
