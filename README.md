# .dotfiles

My personal dotfiles, inspired by [Zach Holman's dotfiles](https://github.com/holman/dotfiles).

## Get started

Copy the files to your machine and run the bootstrap scripts. The setup will guide you and ask for several things.

```bash
# clone
git clone https://github.com/lgraubner/dotfiles.git ~/.dotfiles

cd ~/.dotfiles

# bootstrap setup
scripts/bootstrap
```

To install dependencies use
```bash
dotfiles install
```

Update your dependencies:

```bash
dotfiles update
```

You can also upgrade your dotfiles:

```bash
dotfiles upgrade
```

## Aliases

This dotfiles offer several aliases for a fast workflow.

### NPM

#### `npm_lg`

List all global instaled packages.

#### `npm_og`

List all outdated global packages.


## Functions

### `e [path]`

Open current or specified folder in your editor.

### `todo <description>`

Create a todo file with specified description on the desktop.
