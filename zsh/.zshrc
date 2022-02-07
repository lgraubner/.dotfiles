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

export FPATH="$HOME/.zsh/pure:$FPATH"

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

# Create directory and cd into it
function take() {
    mkdir -p "$@" && cd "$_";
}

# Open directory
function o() {
	if [ $# -eq 0 ]; then
		open .;
	else
		open "$@";
	fi;
}

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

# create a Node.js project
create-project () {
  mkdir -p "$@" && cd "$_";
  git init
  npx license $(npm get init.license) -o "$(npm get init.author.name)" > LICENSE
  npx gitignore node
  npm init -y
  git add -A
  git commit -m "Initial commit"
}

# backup all GitHub projects
function backup-github() {
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

# Easy navigation
alias ..="cd .."
alias ...="cd ../.."
alias .3="cd ../../.."
alias .4="cd ../../../.."
alias ~="cd ~"
alias -- -="cd -"

# ls alias
alias lsa="ls -FGlAhp"

# Print file size
alias fs="stat -f '%z bytes'"

# Quick jump to folders
alias w="cd $WORKSPACE"
alias d="cd ~/Desktop"
alias dl="cd ~/Download"

# clear console
alias c="clear"

# Reset DNS cache
alias flushDNS="sudo killall -HUP mDNSResponder; sleep 2;"

# Pipe public key to clipboard.
alias pubkey="more ~/.ssh/id_rsa.pub | pbcopy | echo '=> Public key copied to pasteboard.'"

# Get public ip
alias pubip="curl -w '\n' https://api.ipify.org"

# Open all merge conflicts or currently changed files in Editor
alias fix="git diff --name-only | uniq | xargs $EDITOR"

# remove .DS_Store files
alias rmdss="find . -type f -name '*.DS_Store' -ls -delete"

# Npm run dev alias
alias dev="npm run dev"

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
alias gs="git status -s"
alias ga="git add"
alias gac="git add -A && git commit -m"
alias gc="git commit --message"
alias gcb="git checkout -b"
alias gco="git checkout"
alias gcm="git checkout master"
alias gcd="git checkout develop"
alias gd="git diff"
alias gi="git init"
alias gcl="git clone"
alias gp="git push origin HEAD"
alias gpf="git push origin $(current_branch) -f"
alias gpl="git pull origin $(current_branch) --rebase"
alias gl="git log -10 --reverse --pretty=oneline"
alias gundo="git reset --soft HEAD~"
alias gam="git commit --amend"
alias gf="git fetch"
alias grbc="git rebase --continue"
alias gsta="git stash"
alias gstp="git stash pop"

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

# nvm init
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# add ssh keys on login
ssh-add -A 2> /dev/null;

# zsh autosuggestions
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=#949494"
[ -s /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh ] && source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
