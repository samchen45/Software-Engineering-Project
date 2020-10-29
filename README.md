# Software-Engineering-Project

A **Teaching Cloud Platform** for Software Engineering.

## Installation

### Install Nameko

#### Install with Pip

You can install nameko and its dependencies from [PyPI](https://pypi.python.org/pypi/nameko) with pip:

```shell
pip install nameko
```

#### Source Code

Nameko is actively developed on [GitHub](https://github.com/nameko/nameko). Get the code by cloning the public repository:

```
git clone git@github.com:nameko/nameko.git
```

You can install from the source code using setuptools:

```
python setup.py install
```

### Install Flask

Within the activated environment, use the following command to install Flask:

```
pip install Flask
```

Flask is now installed. Check out the [Quickstart](https://flask.palletsprojects.com/en/1.1.x/quickstart/) or go to the [Documentation Overview](https://flask.palletsprojects.com/en/1.1.x/).

### Install RabbitMQ

Install RabbitMQ server with:

```bash
brew install rabbitmq
```

Pull the image of RabbitMQ from the Docker Hub:

```python
docker pull rabbitmq:management
```

Run its official docker container:

```python
docker run -d --hostname my-rabbit --name rabbit -p 15672:15672 -p 5672:5672 rabbitmq:management
```

Go to the browser and access [http://localhost:15672](http://localhost:15672/) using credentials **guest:guest** if you can login to RabbitMQ dashboard it means you have it running locally for development.