"""
TCP package installation.
"""

from setuptools import setup

setup(
    name='TCP',
    version='0.1.0',
    packages=['TCP'],
    include_package_data=True,
    install_requires=[
        'flask',
        'flask-mysql',
        'cryptography',
        'flask-mail',
        'reportlab',
    ],
)
