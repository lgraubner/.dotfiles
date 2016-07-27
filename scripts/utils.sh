# logging functions
function e_header() {
    echo -e "\n=> $@";
}

function e_update() {
    msg="=> $1 [update : $2] ";
    while [ ${#msg} -lt 60 ]; do
        msg=${msg}*
    done
    echo -e "\n$msg";
}

function e_install() {
    msg="=> INSTALL [$@] ";
    while [ ${#msg} -lt 60 ]; do
        msg=${msg}*
    done
    echo -e "\n$msg";
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

function exec_task() {
    (sh -c "$@") > /dev/null 2>&1
}
