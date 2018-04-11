# Add ~/bin to path
PATH=~/bin:$PATH

# Load shell dotfiles
# Also loads ~/.path and ~/.extra for private data
for file in ~/.{path,exports,aliases,functions,extra}; do
	[ -r "$file" ] && [ -f "$file" ] && source "$file";
done;
unset file;

# Set Spaceship ZSH as a prompt
autoload -U promptinit; promptinit
prompt spaceship
