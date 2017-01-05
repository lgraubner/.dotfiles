# logging functions
function e_header() {
    echo "\033[1m"
    echo "[$1] " | sed -e :a -e 's/^.\{1,80\}$/&*/;ta'
    echo "\033[0m"
}

function e_success() {
  echo "\033[32m$1\033[0m"
}

function e_error() {
    echo "\033[31m$1\033[0m"
}

function e_line() {
    echo "$1"
}
