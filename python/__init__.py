import logger
import pip

def install():
    logger.info('Installing global python packages...')

    packages = ['virtualenv']
    try:
        pip.main(['install', '-q'] + packages)
        logger.success(packages)
    except:
        logger.error('%s: %s' % (exc_info()[0] ,exc_info()[1]))

def update():
    pass
