# Lars' dotfiles

My personal dotfiles grown over the years. Created for MacOS Big Sur. Inspired by a lot of awesome dotfiles out there. Currently running with Bash and Terminal.

**Don't just install this without reviewing and adjusting this to your needs! This is strongly opinionated and suited to my own needs.**

## Installation

To get started clone the dotfiles anywhere you like. `cd` into it and execute the bootstrap script.

```bash
git clone https://github.com/lgraubner/dotfiles.git && ./dotfiles/bootstrap
```

This will install all needed programs and copies the dotfiles into your home directory.

## Create SSH-key

Follow the steps listed here: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

## Mac OS Settings

```
# enable key repeating
defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false

# lower key repeat delay
# normal minimum is 15 (225ms)
defaults write -g InitialKeyRepeat -int 10

# normal minimum is 2 (30 ms)
defaults write -g KeyRepeat -int 1

# change screenshot location to ~/Screenshots
mkdir -p ~/Screenshots && defaults write com.apple.screencapture location ~/Screenshots

killall SystemUIServer
```
