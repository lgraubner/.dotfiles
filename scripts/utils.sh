# logging functions
function e_header() {
    echo -e "\n=> $@";
}

function e_update() {
    echo -e "\n=> UPDATE [$@]";
}

function e_install() {
    echo -e "\n=> INSTALL [$@]";
}

function e_success() {
    echo -e "=> \033[32mok\033[0m";
}

function e_error() {
    echo -e "=> \033[31mfailed\033[0m";
}

function e_line() {
    echo -e "=> $@";
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
