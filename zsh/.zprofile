# this is only required for homebrew on arm macs
if [[ $(/usr/bin/uname -m) == "arm64" ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

