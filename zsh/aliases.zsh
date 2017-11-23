## system
# colored ls
alias ls="command ls -G"

alias lsa="ls -al"

#file size
alias fs="stat -f '%z bytes'"

# Recursively delete `.DS_Store` files
alias rmdss="find . -name '*.DS_Store' -type f -ls -delete"

# quick jump to projects folder
alias w="cd $WORKSPACE"

# reset DNS cache
alias flush="sudo killall -HUP mDNSResponder"

# Pipe my public key to my clipboard.
alias pubkey="more ~/.ssh/id_rsa.pub | pbcopy | echo '=> Public key copied to pasteboard.'"

# Open all merge conflicts or currently changed files in Editor
alias fix="git diff --name-only | uniq | xargs code"

# Open current path in folder
alias o="open ."