# DeportationTrains
[![Build Status](https://travis-ci.org/iJebus/DeportationTrains.svg?branch=flask)](https://travis-ci.org/iJebus/DeportationTrains)
[![Code Climate](https://codeclimate.com/github/iJebus/DeportationTrains/badges/gpa.svg)](https://codeclimate.com/github/iJebus/DeportationTrains)

Release 16.09.sprint1

Using [CalVer](http://calver.org/): YY.0M.Modifier
Modifier refers to sprint cycle and will be either sprint1 or sprint2. (as per ~2 spring cycles per month)

## Usage/Commands
Install python requirements.

`pip install -r requirements.txt`

Run local development environment with hot-reloading. Browser will automatically open.

`python run.py`

Create a static production build; files will be placed in the 'build' folder.

`python run.py create`

These files then need to be made available by a web server of some type; intended platform is S3 however a local python server will do for testing.

```
cd build
python -m http.server
```

Deploy the build to a remote provider (e.g. AWS S3); login credentials and bucket config can be provided as environment variables or in config.yml.

`python build.py deploy S3`

