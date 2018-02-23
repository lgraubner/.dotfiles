function homestead() {
    ( cd ~/dev/Homestead && vagrant $* )
}

function mkd() {
    mkdir -p "$@" && cd "$_";
}

function work() {
    open -a "Google Chrome" https://app.asana.com/0/568732081266236/board
    open -a "Spotify"
    open -a "HipChat"

    # @TODO: open all subfolders, detect php/js project
    idearockers="$HOME/dev/code/idearockers"

    open -a "PhpStorm" $idearockers/BreatheApi
    code $idearockers/Breathe
    open -a "Xcode" $idearockers/Breathe/ios

    cd "$HOME/dev/code/idearockers"
}