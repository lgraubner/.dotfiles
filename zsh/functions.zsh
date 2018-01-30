function homestead() {
    ( cd ~/dev/Homestead && vagrant $* )
}

function mkd() {
    mkdir -p "$@" && cs "$_";
}

function work() {
    open -a "Google Chrome" https://app.simplenote.com
    open -a "Google Chrome" https://trello.com/b/5Jeb5fT6/breathe
    open -a "Spotify"
    open -a "HipChat"

    # @TODO: open all subfolders, detect php/js project
    idearockers="$HOME/dev/code/idearockers"

    open -a "PhpStorm" $idearockers/BreatheApi
    code $idearockers/Breathe
    open -a "Xcode" $idearockers/Breathe/ios

    cd "$HOME/dev/code/idearockers"
}