#!/usr/bin/env bash

reset="\033[0m"
highlight="\033[41m\033[97m"
dot="\033[31m▸ $reset"
dim="\033[2m"
blue="\e[34m"
green="\e[32m"
yellow="\e[33m"
tag_green="\e[30;42m"
tag_blue="\e[30;46m"
bold=$(tput bold)
normal=$(tput sgr0)
underline="\e[37;4m"
indent="   "

# working directory
cwd="$(cd "$(dirname "$0")" && pwd)"

# home bin
homebin="$HOME/.bin/"

_print_in_color() {
    printf "%b" \
        "$(tput setaf "$2" 2> /dev/null)" \
        "$1" \
        "$(tput sgr0 2> /dev/null)"
}

_link_file() {
  local src=$1 dst=$2

  local overwrite= backup= skip=
  local action=

  if [ -f "$dst" -o -d "$dst" -o -L "$dst" ]
  then

    if [ "$overwrite_all" == "false" ] && [ "$backup_all" == "false" ] && [ "$skip_all" == "false" ]
    then

      local currentSrc="$(readlink $dst)"

      if [ "$currentSrc" == "$src" ]
      then

        skip=true;

      else

        printf "\r   ${yellow}!${reset} File already exists: $dst ($(basename "$src")), what do you want to do?
     [s]kip, [S]kip all, [o]verwrite, [O]verwrite all, [b]ackup, [B]ackup all? "
        read -n 1 action

        case "$action" in
          o )
            overwrite=true;;
          O )
            overwrite_all=true;;
          b )
            backup=true;;
          B )
            backup_all=true;;
          s )
            skip=true;;
          S )
            skip_all=true;;
          * )
            ;;
        esac

      fi

    fi

    overwrite=${overwrite:-$overwrite_all}
    backup=${backup:-$backup_all}
    skip=${skip:-$skip_all}

    if [ "$overwrite" == "true" ]
    then
      rm -rf "$dst"
      print_in_green "\n      ✓ deleted $dst"
    fi

    if [ "$backup" == "true" ]
    then
      mv "$dst" "${dst}.backup"
      print_in_green "\n      ✓ moved $dst to ${dst}.backup"
    fi

    if [ "$skip" == "true" ]
    then
      printf "\n  ${dim}    ✓ $src already linked..${reset}"
    fi
  fi

  if [ "$skip" != "true" ]  # "false" or empty
  then
    cp "$1" "$2"
    print_in_green "\n      ✓ linked $1 to $2"
  fi
}

print_in_red() {
    _print_in_color "$1" 1
}

print_in_green() {
    _print_in_color "$1" 2
}

print_in_yellow() {
    _print_in_color "$1" 3
}

print_in_blue() {
    _print_in_color "$1" 4
}

print_in_purple() {
    _print_in_color "$1" 5
}

print_in_cyan() {
    _print_in_color "$1" 6
}

print_in_white() {
    _print_in_color "$1" 7
}

print_result() {

    if [ "$1" -eq 0 ]; then
        print_success "$2"
    else
        print_error "$2"
    fi

    return "$1"

}

print_question() {
    print_in_yellow "  [?] $1\n"
}

print_success() {
    print_in_green "  [✓] $1\n"
}

print_success_muted() {
    printf "  ${dim}[✓] $1${reset}\n" "$@"
}

print_muted() {
    printf "  ${dim}$1${reset}\n" "$@"
}

print_warning() {
    print_in_yellow "  [!] $1\n"
}

print_error() {
    print_in_red "  [𝘅] $1 $2\n"
}

install() {
    local fmt="$1"; shift
    printf "  [↓] $fmt " "$@"
}

chapter() {
  printf "\n$1\n"
}

cli_is_installed() {
    # set to 1 initially
    local return_=1
    # set to 0 if not found
    type $1 >/dev/null 2>&1 || { local return_=0; }
    # return value
    echo "$return_"
}

check_internet_connection() {
    if [ ping -q -w1 -c1 google.com &>/dev/null ]; then
        print_error "Please check your internet connection";
        exit 0
    else
        print_success "Internet connection";
    fi
}

ask_for_sudo() {

    # Ask for the administrator password upfront.

    sudo -v &> /dev/null

    # Update existing `sudo` time stamp
    # until this script has finished.
    #
    # https://gist.github.com/cowboy/3118588

    # Keep-alive: update existing `sudo` time stamp until script has finished
    while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

    print_success "Password cached"
}


install_brews() {
    if [[ ! $(brew list | grep $brew) ]]; then
        install "Installing $brew"
      brew install $brew >/dev/null
      print_in_green "${bold}✓ installed!${normal}\n"
    else
      print_success_muted "$brew already installed."
    fi
}

install_application_via_brew() {
    if [[ ! $(brew list | grep $cask) ]]; then
        install "Installing $cask"
        brew install --cask $cask --appdir=/Applications >/dev/null
        print_in_green "${bold}✓ installed!${normal}\n"
    else
      print_success_muted "$cask already installed."
    fi
}

install_npm_packages() {
  if [[ $(cli_is_installed $2) == 0 ]]; then
    install "Installing $1"
    npm install $1 -g --silent
    print_in_green "${bold}✓ installed!${normal}\n"
  else
    print_success_muted "$1 already installed."
  fi
}

install_rbenv_ruby() {
  install "Installing v2.6.0"
  rbenv install 2.6.0 2> /dev/null
  rbenv rehash
  rbenv init 2> /dev/null
  rbenv global 2.6.0
}

install_ruby_gems() {
  if [[ ! $(gem list -i $1) ]]; then
    install "Installing $1"
    gem install --silent $1
  else
    print_success_muted "$1 already installed."
  fi
}

symlink_dotfiles() {
  local overwrite_all=false backup_all=false skip_all=false

  for src in $(find -H "$cwd" -maxdepth 1 -name '.*' -not -path '*.git' -not -path '*.DS_Store')
  do
    dst="$HOME/${src##*/}"
    _link_file "$src" "$dst"
  done
}

reload() {
  /bin/bash -c "source ~/.bashrc"
}
