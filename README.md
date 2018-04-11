# Lars' dotfiles

## Installation

To get started clone the dotfiles anywhere you like. `cd` into it and execute the bootstrap script.

```bash
git clone https://github.com/lgraubner/dotfiles.git && cd dotfiles && ./bootstrap.sh
```

This will install all needed programs and copies the dotfiles into your home directory. If you are running MacOS you might want to apply some useful MacOS defaults by running `./macos.sh`.

## Additional files

The dotfiles will load `.path` and `.extra` automatically if they exist. Further configuration can be added here without having to add it the the git repository.

## Thanks

This dotfiles are heavily inspired by [Mathias Bynens](https://github.com/mathiasbynens/dotfiles) but based on ZSH instead.
