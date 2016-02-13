# .dotfiles

My personal dotfiles, inspired by [Zach Holman's dotfiles](https://github.com/holman/dotfiles) and [Ben Alman's dotfiles](https://github.com/cowboy/dotfiles).

## Get started

Copy the files to your machine and run the bootstrap scripts. The setup will guide you and ask for several things.

```bash
# clone
git clone https://github.com/lgraubner/dotfiles.git ~/.dotfiles

cd ~/.dotfiles

# bootstrap setup
scripts/bootstrap
```

## Contents

This files include the solarized syntax theme for iTerm2 and can be used in conjunction with the `solarized-dark-syntax` Atom theme.

## Binaries

### dotfiles

Manages the dotfiles.

```bash
dotfiles install    # install dependencies
dotfiles update     # update dependencies
dotfiles upgrade    # upgrade dotfiles
```

### e

Quick shortcut to an editor.

```bash
e               # open current directory in editor
e path/to/dir   # open specified dir in editor
```

### extract

Extracts archived files and mounts disk images.

```bash
extract file.zip    # unzip file. Types: tar, bz, dmg, gz, zip, pax and more
```

### lock

Locks the current screen. Only works on OSX!

```bash
lock
```

### todo

Creates a todo file on your desktop.

```bash
todo "this is an todo"      # create an todo file on your desktop
```

## Aliases

```bash
# git
gs        # git status -s
gc        # git clone
gcm       # git commit -m
gcam      # git commit -am

# npm
nl       # npm list --depth=0
nlg      # npm list --depth=0 -g
no       # npm outdated --depth
nog      # npm outdated --depth=0 -g

# files
lsa         # ls -al
..          # cd ..
...         # cd ../..
fs          # stat -f '%z bytes'
rm_dsstore  # find . -name '*.DS_Store' -type f -ls -delete
p           # quickly jump to projects folder
```
