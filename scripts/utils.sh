# logging functions
function e_header() {
    echo -e "\n=> \e[1m$@\e[0m";
}

function e_success() {
    echo -e "   \e[32m$@\e[0m";
}

function e_error() {
    echo -e "   \e[31m$@\e[0m";
}

function e_arrow() {
    echo -e " \e[34m$@\e[0m";
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
