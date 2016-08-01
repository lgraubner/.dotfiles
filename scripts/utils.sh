# logging functions
function e_header() {
    echo -e "\n=> $1";
}

function _write {
    if [[ $2 ]]; then
        msg="=> $2 [$3 : $1] ";
    else
        msg="=> $1"
    fi

    while [ ${#msg} -lt 80 ]; do
        msg=${msg}*
    done
    echo -e "\n$msg";
}

function e_update {
    _write $1 $2 "update"
}

function e_install() {
    _write $1 $2 "install"
}

function e_success() {
    if [[ $1 ]]; then
        echo -e "\033[32m=> ok: $1\033[0m";
    else
        echo -e "\033[32m=> ok\033[0m";
    fi
}

function e_error() {
    if [[ $1 ]]; then
        echo -e "\033[31m=> failed: $1\033[0m";
    else
        echo -e "\033[31m=> failed\033[0m";
    fi
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

# exec task, supress stdout
function exec_task() {
    (sh -c "$1") > /dev/null 2>&1
}

# join array
function join { local d=$1; shift; echo -n "$1"; shift; printf "%s" "${@/#/$d}"; }
