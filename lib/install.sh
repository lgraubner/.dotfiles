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
brew install coreutils node ansible tree python3 watchman go homebrew/php/php56-xdebug

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
brew cask install alfred google-chrome firefox visual-studio-code applepi-baker dropbox filezilla imageoptim spotify the-unarchiver virtualbox iterm2 vagrant 1password stride postman caffeine

# install global npm packages
if [ $(which npm) ]; then
  e_header "Install global node packages"
  npm install -g eslint sitemap-generator-cli webpack svgo n gzip-size-cli flow-bin gatsby-cli create-react-native-app flow-typed create-react-app react-native-cli prettier git-open http-server npm-check mjml fkill-cli

  # activate latest npm version
  e_header "Install stable and latest node versions"
  sudo n stable
  sudo n latest
fi

# install composer globally
e_header "Install composer globally"
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer