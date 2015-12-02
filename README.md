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


## Binaries

### dotfiles

```bash
dotfiles install    # install dependencies
dotfiles update     # update dependencies
dotfiles upgrade    # upgrade dotfiles
```

### e

```bash
e               # open current directory in editor
e path/to/dir   # open specified dir in editor
```

### extract

```bash
extract file.zip    # unzip file. Types: tar, bz, dmg, gz, zip, pax and more
```

### todo

```bash
todo "this is an todo"      # create an todo file on your desktop
```

## Aliases

```bash
# npm
npm_lg      # npm list --depth=0 -g
npm_og      # npm outdated --depth=0 -g

# files
lsa         # ls -al
..          # cd ..
...         # cd ../..
fs          # stat -f '%z bytes'
rm_dsstore  # find . -name '*.DS_Store' -type f -ls -delete
```
