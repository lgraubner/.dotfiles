function homestead() {
    ( cd ~/dev/Homestead && vagrant $* )
}

function mkd() {
    mkdir -p "$@" && cd "$_";
}

function work() {
    open -a "Google Chrome" https://app.asana.com/0/568732081266236/board
    open -a "Spotify"
    open -a "Stride"

    open -a "PhpStorm" $HOME/code/BreatheApi
    code $HOME/code/Breathe
    open -a "Xcode" $HOME/code/Breathe/ios

    cd "$HOME/code/Breathe"
}
