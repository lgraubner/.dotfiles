#!/usr/bin/env bash

info () {
  printf "\r  [ \033[00;36mINFO\033[0m ] $1\n"
}

success () {
  printf "\r\033[2K  [ \033[00;32mOK\033[0m ] $1\n"
}

error () {
  printf "\r\033[2K  [ \033[0;31mERR\033[0m ] $1\n"
  echo ''
  exit
}

running () {
    printf "\r  [ \033[00;33m..\033[0m ] $1\n"
}
