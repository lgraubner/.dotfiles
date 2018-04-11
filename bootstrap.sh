#!/usr/bin/env bash

# Ask for the administrator password upfront
sudo -v

# Enable zsh shell
if [[ "$SHELL" != "/bin/zsh" ]]; then
  chsh -s $(which zsh)
fi

which -s brew
if [[ $? != 0 ]] ; then
  # Install homebrew
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
  # Make sure we're using latest Homebrew
  brew update
fi

# Install brew formulaes
brew install coreutils
brew install node
brew install ansible
brew install tree
brew install python3

# Install more recent versions of some macOS tools.
brew install openssh

# Install yarn
brew link --overwrite node
brew install yarn

# Install brew cask
brew tap caskroom/cask

# Install apps with cask
brew cask install alfred
brew cask install google-chrome
brew cask install firefox
brew cask install visual-studio-code
brew cask install dropbox
brew cask install filezilla
brew cask install imageoptim
brew cask install spotify
brew cask install the-unarchiver
brew cask install virtualbox
brew cask install iterm2
brew cask install vagrant
brew cask install postman
brew cask install caffeine

# Remove outdated versions
brew cleanup

# Install global npm packages
if [ $(which npm) ]; then
  npm install -g sitemap-generator-cli
  npm install -g svgo
  npm install -g n
  npm install -g gzip-size-cli
  npm install -g flow-typed
  npm install -g create-react-app
  npm install -g prettier
  npm install -g git-open
  npm install -g http-server
  npm install -g npm-check
  npm install -g fkill-cli
  npm install -g strong-pwgen-cli
  npm install -g spaceship-prompt

  # Activate latest npm version
  sudo n stable
  sudo n latest
fi

which -s composer
if [[ $? != 0 ]]; then
  # Install composer globally
  curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
else
  # Make sure we're using latest version
  composer self-update
fi

source copy-files.sh
