#!/bin/bash

set -e

export DOTFILES=~/.dotfiles

# load logging functions
source utils.sh

trap 'e_error "\nAn error occured. Aborting."' ERR

# install homebrew
e_header "Install homebrew"
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# install brew formulaes
e_header "Install brew formulaes"
brew install grc coreutils spark node ansible@2.0 tree python3 ruby openssl hugo

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
brew cask install alfred hyperterm atom google-chrome firefox slack poedit rocket

# install atom plugins
if [ $(which apm) ]; then
  e_header "Install atom plugins"
  apm install atom-ternjs auto-update-packages autocomplete-modules autocomplete-php docblockr editorconfig emmet linter linter-eslint merge-conflicts minimap pigments react file-icons atom-beautify cobalt2-syntax highlight-selected highlight-nbsp
fi

# install global npm packages
if [ $(which npm) ]; then
  e_header "Install global node packages"
  sudo npm install -g eslint sitemap-generator-cli webpack svgo n flow-bin

  # activate latest npm version
  e_header "Install stable and latest node versions"
  sudo n stable
  sudo n latest

  # set npm config
  npm set init.author.name "Lars Graubner"
  npm set init.author.email "mail@larsgraubner.de"
  npm set init.author.url "https://larsgraubner.com"
  npm set save-exact true
  npm adduser
fi

# install global python modules
if [ $(which pip) ]; then
  e_header "Install python virtualenv"
  pip install virtualenv
fi

# install global ruby gems
if [ $(which gem) ]; then
  e_header "Install ruby gems"
  sudo gem install sass bundler
fi

# install composer globally
e_header "Install composer globally"
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

## set macOS options
# show invisible files
e_header "Show invisible files on macOS"
defaults write com.apple.finder AppleShowAllFiles -bool true

e_success "System is ready to use!"
