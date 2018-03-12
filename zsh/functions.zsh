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

    open -a "PhpStorm" $HOME/code/BreatheApi
    code $HOME/code/Breathe
    open -a "Xcode" $HOME/code/Breathe/ios

    cd "$HOME/code/Breathe"
}

function bye() {
    osascript -e 'quit app "Spotify"'
    osascript -e 'quit app "HipChat"'
    osascript -e 'quit app "PhpStorm"'
    osascript -e 'quit app "Xcode"'
    osascript -e 'quit app "Visual Studio Code"'

    cd "$HOME/dev/code/idearockers/BreatheApi"
    vagrant halt
}