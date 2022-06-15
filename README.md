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
```

## VIM Key bindings

- `<leader>` = Space

### Telescope

- `<leader>ff` Find file in current directory
- `<leader>fg` Grep through files in current directory
- `<leader>fb` Find file in active buffers
- `<leader>fgb` Find git branches
- `<leader>fgc` Find git commits
- `<leader>fgs` Find changed git files

### Neoformat

- `<leader>p` Format active buffer

### Misc

- `gc` comment out selection
- `gcc` comment out line

## tmux

- `<C-a>` Prefix
- `<C-a> w` Show open windows
- `<C-a> s` Show active sessions
- `<C-a> c` Create new window
- `<C-a> d` Detach from tmux session
- `<C-a> p` Switch to previous window
- `<C-a> n` Switch to next window
- `<C-a> -` Split pane horizontally
- `<C-a> |` Split pane vertically
- `<C-a> x` Close pane
- `<C-a> arrow` Move cursor

Full list: https://wiki.ubuntuusers.de/tmux/

## Install LSP Servers

To use specific language servers with LSP servers have to be installed: https://github.com/williamboman/nvim-lsp-installer#commands

Configured servers can be seen in `plugin/lsp.vim`.

```
:LspInstall tsserver
```

## Todo

- Create Machine Installation Script (Ansible, own repo)
        - git config
        - npm config
        - packages
        - install xcode (for git and stuff)
        - enable rosetta
