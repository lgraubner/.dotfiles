#!/bin/bash

source $DOTFILES/lib/utils.sh

export DOTFILES=~/.dotfiles

backup_dir="$DOTFILES/backups/$(date "+%Y_%m_%d-%H_%M_%S")/"
