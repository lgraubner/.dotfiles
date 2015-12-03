autoload colors && colors

if (( $+commands[git] ))
then
  git="$commands[git]"
else
  git="/usr/bin/git"
fi

git_branch() {
  echo $($git symbolic-ref HEAD 2>/dev/null | awk -F/ {'print $NF'})
}

git_dirty() {
  if $($git status -s &> /dev/null)
  then
    if [[ $($git status --porcelain) == "" ]]
    then
      echo " %{$fg_bold[green]%}<$(git_prompt_info)$(need_push)>%{$reset_color%}"
    else
      echo " %{$fg_bold[magenta]%}<$(git_prompt_info)$(need_push)>%{$reset_color%}"
    fi
  fi
}

git_prompt_info () {
  ref=$($git symbolic-ref HEAD 2>/dev/null) || return
  echo "${ref#refs/heads/}"
}

unpushed () {
  $git cherry -v @{upstream} 2>/dev/null
}

need_push () {
  if [[ $(unpushed) == "" ]]
  then
    :
  else
    echo ":unpushed"
  fi
}

directory_name() {
  path=$(pwd)
  echo "%{$fg_bold[cyan]%}${path/$HOME/~}%{$reset_color%}"
}

export PROMPT=$'$(whoami):$(directory_name)$(git_dirty) $ '
set_prompt () {
  export RPROMPT="%{$fg_bold[cyan]%}%{$reset_color%}"
}

precmd() {
  title "zsh" "%m" "%55<...<%~"
  set_prompt
}
