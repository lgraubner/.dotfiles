# misc
sudo apt update
sudo apt upgrade -y
sudo apt install -y apt-transport-https ca-certificates lsb-release tmux software-properties-common vim curl zsh ncdu htop git trimage thunderbird filezilla usb-creator-gtk

# php
sudo add-apt-repository ppa:ondrej/php
sudo apt install -y php8.0

# docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt install -y docker-ce docker-ce-cli

# composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer

# php-cs-fixer
curl -L https://cs.symfony.com/download/php-cs-fixer-v2.phar -o php-cs-fixer
sudo chmod a+x php-cs-fixer
sudo mv php-cs-fixer /usr/local/bin/php-cs-fixer

# fira code font
sudo apt install fonts-firacode

# nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# npm packages
npm install -g diff-so-fancy pure-prompt prettier npm-check git-open yarn

# programs
sudo snap install --classic code phpstorm
sudo snap install discord spotify postman

# brave
sudo curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg arch=amd64] https://brave-browser-apt-release.s3.brave.com/ stable main"|sudo tee /etc/apt/sources.list.d/brave-browser-release.list
sudo apt update
sudo apt install -y brave-browser

# libre office
sudo apt install -y python-software-properties
sudo add-apt-repository ppa:libreoffice/ppa
sudo apt update
sudo apt full-upgrade
sudo apt install libreoffice

# 1password
curl -sS https://downloads.1password.com/linux/keys/1password.asc | sudo gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg
echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/amd64 stable main' | sudo tee /etc/apt/sources.list.d/1password.list
 sudo mkdir -p /etc/debsig/policies/AC2D62742012EA22/
 curl -sS https://downloads.1password.com/linux/debian/debsig/1password.pol | sudo tee /etc/debsig/policies/AC2D62742012EA22/1password.pol
 sudo mkdir -p /usr/share/debsig/keyrings/AC2D62742012EA22
 curl -sS https://downloads.1password.com/linux/keys/1password.asc | sudo gpg --dearmor --output /usr/share/debsig/keyrings/AC2D62742012EA22/debsig.gpg
sudo apt update && sudo apt install 1password

# nextcloud
sudo add-apt-repository ppa:nextcloud-devs/client
sudo apt-get update
sudo apt install -y nextcloud-client

# virtualbox
sudo add-apt-repository multiverse && sudo apt-get update
sudo apt install virtualbox
