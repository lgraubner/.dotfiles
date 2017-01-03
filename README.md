# Lars' dotfiles

My personal dotfiles, inspired by [Zach Holman's dotfiles](https://github.com/holman/dotfiles) and [Ben Alman's dotfiles](https://github.com/cowboy/dotfiles).

## Get started

Copy the files to your machine and run the bootstrap scripts. The setup will guide you and ask for several things.

```bash
git clone https://github.com/lgraubner/dotfiles.git ~/.dotfiles
cd ~/.dotfiles && scripts/bootstrap
```

## Contents

This files include the cobalt2 syntax theme for Atom and the snazzy Theme for hyperterm. Alternatively you can use iTerm2 with the cobalt2 theme.

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

### todo

Creates a todo file on your desktop.

```bash
todo "this is an todo"      # create an todo file on your desktop
```

## Aliases

```bash
# git
git s        # show git status short version
git cl       # git clone
git c        # git commit
git cma      # git commit -a -m
git uc       # undo commit
git l        # log -10 --reverse --pretty=oneline
git fix      # Open all merge conflicts or currently changed files in Editor

# npm
nl       # npm list --depth=0
nlg      # npm list --depth=0 -g
no       # npm outdated --depth
nog      # npm outdated --depth=0 -g

# files
lsa         # ls -al
..          # cd ..
...         # cd ../..
....        # cd ../../..
fs          # stat -f '%z bytes'
w           # jump to workspace
rmdss       # find . -name '*.DS_Store' -type f -ls -delete
inv         # display invisibles in finder
noinv       # hide invisibles in finder
flush       # flush dns cache
pubkey      # copy ssh public key to clipboard
```
