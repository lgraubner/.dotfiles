# Add ~/bin to path
export PATH=~/bin:$PATH

# Default editor
export EDITOR='code'

# Workspace directory
export WORKSPACE=$HOME/code

# add ssh keys on login
ssh-add -A 2> /dev/null;
