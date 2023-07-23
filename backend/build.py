#!/usr/bin/env python
import glob
import shutil
import sys
import os
import zipfile

REQUIRED_FILES = (
    'requirements.txt',
    'index.py',
)

if __name__ == '__main__':
    dirname = sys.argv[-1]
    if not os.path.isdir(dirname):
        raise Exception(f'Invalid dir name specified {dirname}')

    for filename in REQUIRED_FILES:
        if not os.path.isfile(os.path.join(dirname, filename)):
            raise Exception(f'Required file {filename} missing in {dirname}')

    packages_path = os.path.join(dirname, '__pypackages__')
    requirements_file = os.path.join(dirname, 'requirements.txt')

    os.path.isdir(packages_path) and shutil.rmtree(packages_path)
    os.makedirs(packages_path, exist_ok=True)

    os.system(f'pip install -r {requirements_file} --target {packages_path}')

    os.path.isfile(f'{dirname}.zip') and os.remove(f'{dirname}.zip')
    shutil.make_archive(dirname, 'zip', packages_path)

    shutil.rmtree(packages_path)

    with zipfile.ZipFile(
        f'{dirname}.zip',
        'a',
        zipfile.ZIP_STORED,
    ) as target_zip:
        os.chdir(dirname)
        for filename in glob.glob('*.py'):
            if 'test' not in filename:
                target_zip.write(filename)
