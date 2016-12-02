from os import path
from subprocess import Popen, PIPE, STDOUT
import glob

import logger

def install():
    logger.info('Installing atom packages...')

    packages = ['atom-ternjs', 'editorconfig']
    process = Popen(['apm', 'install'] + packages, stdout=PIPE, stderr=STDOUT)
    with process.stdout:
        for line in process.stdout:
            logger.info(process.stdout)
    process.wait()
    if process.returncode == 0:
        logger.success(packages)
    else:
        logger.error('Could not install Atom packages')

def update():
    logger.info('Updating Atom packages...')
    logger.skip('Updates handled by "auto-update-packages" package')

def link():
    cwd = path.dirname(__file__)
    home = path.expanduser('~')

    target = home + '/.atom'

    logger.info('Creating symlinks for Atom...')

    # TODO: get symlinks via glob
    # TODO: create timestamp backup folder
    # TODO: only backup if no symlink
    if os.path.isfile(target):
        os.rename(target, dotfiles + '/backups/' + filename)
        logger.info('Backups moved to FOLDERNAME')

    logger.info('Linked /path')
    logger.success('Created 1 symlink')
    pass
