# logging functions
function e_header() {
    echo -e "\n\033[1m$@\033[0m";
}

function e_success() {
    echo -e " \033[1;32m✔\033[0m  $@";
}

function e_error() {
    echo -e " \033[1;31m✖\033[0m  $@";
}

function e_arrow() {
    echo -e " \033[1;34m➜\033[0m  $@";
}

# OS detection
function is_osx() {
    [[ "$OSTYPE" =~ ^darwin ]] || return 1
}

function is_ubuntu() {
    [[ "$(cat /etc/issue 2> /dev/null)" =~ Ubuntu ]] || return 1
}

function get_os() {
    for os in osx ubuntu; do
        is_$os; [[ $? == ${1:-0} ]] && echo $os
    done
}
