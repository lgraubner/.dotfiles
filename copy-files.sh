#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE}")";

# Get latest dotfiles
#git pull origin master;

function copy() {
	rsync --exclude ".git/" \
		--exclude ".DS_Store" \
		--exclude "*.sh" \
		--exclude "README.md" \
		--exclude "LICENSE" \
    --exclude "fonts" \
		-avh --no-perms . ~;
}

if [ "$1" == "--force" -o "$1" == "-f" ]; then
	copy;
else
	read -p "This may overwrite existing files in your home directory. Are you sure? (y/n) " -n 1;
	echo "";
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		copy;
	fi;
fi;
unset copy;
