# Lars' dotfiles

My personal dotfiles grown over the years. Created for MacOS Big Sur. Inspired by a lot of awesome dotfiles out there. Currently running with Bash and Terminal.

**Don't just install this without reviewing and adjusting this to your needs! This is strongly opinionated and suited to my own needs.**

## Installation

To get started clone the dotfiles anywhere you like. `cd` into it and execute the bootstrap script.

```bash
git clone https://github.com/lgraubner/dotfiles.git && ./dotfiles/bootstrap
```

This will install all needed programs and copies the dotfiles into your home directory.

## Mac OS Settings

```
# enable key repeating
defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false
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

## Todo

- vim status line
- tmux status line
