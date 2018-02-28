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

    cd "$HOME/dev/code/idearockers/BreatheApi"
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