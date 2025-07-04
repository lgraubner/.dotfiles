# ---------------------------------------------------------
#
# Bash and terminal configuration from Lars Graubner.
#
# Content:
# 1.  Prompt
# 2.  Completion
# 3.  Functions
# 4.  Aliases
# 5.  Key Bindings
#
# ---------------------------------------------------------

# -----------------------------------------------------------------------------
# 1. PROMPT
# -----------------------------------------------------------------------------

export FPATH="$FPATH:$(brew --prefix)/share/zsh/site-functions"

autoload -U promptinit; promptinit
prompt pure

# -----------------------------------------------------------------------------
# 2. COMPLETION + PROMPT
# -----------------------------------------------------------------------------

autoload -Uz compinit
compinit

#--------------------------------------
# 3. FUNCTIONS
# -------------------------------------

# Open in editor
function e() {
  if [ $# -eq 0 ]; then
    $EDITOR .;
  else
    $EDITOR "$@";
  fi;
}

# move file/folder to trash
trash () {
  command mv "$@" ~/.Trash;
}

# backup all GitHub projects
function backup_github() {
  if [[ -z $GITHUB_ACCESS_TOKEN ]]; then
    echo "Please set env variable GITHUB_ACCESS_TOKEN";
  else
    npx github-clone-all --ignore-forks --access-token=$GITHUB_ACCESS_TOKEN --username=lgraubner --overwrite ~/Documents/Github
  fi;
}

function daily() {
  year=$(date +"%Y");
  month=$(date +"%m");

  date=$(date +"%Y-%m-%d");

  dir=$DAILY/$year/$month;
  filePath=$dir/$date.md;

  mkdir -p $dir;

  if [ ! -f $filePath ]; then
    echo "# Daily $(date +"%d.%m.%Y")\n\n" > $filePath;
  fi;

  nvim '+normal GA' $filePath;
}


# -------------------------------------
# 4. ALIASES
# -------------------------------------

# ls alias
alias lsa="ls -FGlAhp"

# Print file size
alias fs="stat -f '%z bytes'"

# Quick jump to folders
alias w="cd $WORKSPACE"
alias d="cd ~/Desktop"
alias dl="cd ~/Download"

# Reset DNS cache
alias flushdns="sudo killall -HUP mDNSResponder; sleep 2;"

# Pipe public key to clipboard.
alias pubkey="more ~/.ssh/id_ed25519.pub | pbcopy | echo '=> Public key copied to pasteboard.'"

# Get public ip
alias pubip="curl -w '\n' https://api.ipify.org"

# Open all merge conflicts or currently changed files in Editor
alias fix="git diff --name-only | uniq | xargs $EDITOR"

# remove .DS_Store files
alias rmdss="find . -type f -name '*.DS_Store' -ls -delete"

# Reload shell
alias reload="exec ${SHELL} -l"

# Print each PATH entry on a separate line
alias path="echo -e ${PATH//:/\\\n}"

# improved top (more linux like)
alias top="htop"

# interactive disk usage tool
alias du="ncdu --color dark -rr --exclude .git --exclude node_modules"

# use neovim
alias vim=$(which nvim)

# get current git branch
function current_branch() {
  ref=$(git symbolic-ref HEAD 2> /dev/null) || \
  ref=$(git rev-parse --short HEAD 2> /dev/null) || return
  echo ${ref#refs/heads/}
}

# git
alias gundo="git reset --soft HEAD~"

# -------------------------------------
# 5. KEY BINDINGS
# -------------------------------------

bindkey -s ^f "tmux-sessionizer\n"

# -----------------------------------------------------------------------------

setopt auto_cd
unsetopt correct_all
setopt auto_list
setopt auto_menu
setopt always_to_end

# zsh autosuggestions
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=#949494"
[ -s /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh ] && source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
