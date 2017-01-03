import subprocess
import sys

# helper functions
def info(msg):
    sys.stdout.write('=> %s\n' % msg)

def success(msg):
    sys.stdout.write('\033[32mok: %s\033[0m\n' % msg)

def error(msg):
    sys.stderr.write('\n\033[41m%s\033[0m\n\n' % msg)

def skip(msg):
    sys.stdout.write('\033[36mskipping: %s\033[0m\n' % msg)

num_error = 0

# install homebrew
info('Dotfiles system setup')
info('Installing homebrew');

process = subprocess.call(['/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"'], shell=True);
if process != 0:
    error('Could not install homebrew')
    sys.exit(1)

# install cask
info('Installing brew cask');
subprocess.call(['brew', 'tap', 'caskroom/cask'])

# install homebrew cask packages
info('Installing cask packages');
cask_packages = ['alfred', 'hyperterm', 'atom', 'google-chrome', 'firefox', 'slack', 'poedit']
process = subprocess.call(['brew', 'cask', 'install'] + cask_packages)

if process != 0:
    num_error += 1
    error('An error occured while installing cask packages')

# install homebrew formulaes
info('Installing brew formulaes');
brew_formulaes = ['grc', 'coreutils', 'spark', 'node', 'ansible', 'tree', 'python3']
process = subprocess.call(['brew', 'install'] + brew_formulaes)

# link node
subprocess.call('brew link --overwrite node', shell=True)
# install yarn
subprocess.call(['brew', 'install', 'yarn'])

if process != 0:
    num_error += 1
    error('An error occured while installing brew packages')

# install atom packages
info('Installing Atom packages');
atom_packages = ['atom-ternjs', 'auto-update-packages', 'autocomplete-modules', 'autocomplete-php', 'docblockr', 'editorconfig', 'emmet', 'linter', 'linter-eslint', 'merge-conflicts', 'minimap', 'pigments', 'react', 'synced-sidebar', 'file-icons', 'atom-beautify', 'cobalt2-syntax', 'highlight-selected', 'linter-stylelint']
process = subprocess.call(['apm', 'install'] + atom_packages)

if process != 0:
    num_error += 1
    error('An error occured while installing Atom packages')

info('Done!')
info('%s errors occured.' % (num_error))
