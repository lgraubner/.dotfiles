import sys

def info(msg):
    sys.stdout.write('=> %s\n' % msg)

def success(msg):
    sys.stdout.write('\033[32mok: %s\033[0m\n' % msg)

def error(msg):
    sys.stderr.write('\033[31mfailed: %s\033[0m\n' % msg)

def skip(msg):
    sys.stdout.write('\033[36mskipping: %s\033[0m\n' % msg)
