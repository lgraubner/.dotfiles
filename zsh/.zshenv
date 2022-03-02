# Default editor
export EDITOR='nvim'

# Workspace directory
export WORKSPACE="$HOME/code"

# git language
export LANG=en_US.UTF-8

# add local bin
export PATH="$HOME/.local/bin:$PATH"

export DOTFILES="$HOME/.dotfiles"
export DAILY="$HOME/Notizen/Daily"

# n dir
export N_PREFIX="$HOME/n"
export PATH="$HOME/n/bin:$PATH";

# load additional non versioned local vars
if [[ -f $HOME/.zshenv.local ]]; then
    source $HOME/.zshenv.local
fi
