mkdir_() {
  test -d "$1" || mkdir "$1" && cd "$_"
}
