# DeportationTrains
[![Build Status](https://travis-ci.org/iJebus/DeportationTrains.svg?branch=flask)](https://travis-ci.org/iJebus/DeportationTrains)
[![Code Climate](https://codeclimate.com/github/iJebus/DeportationTrains/badges/gpa.svg)](https://codeclimate.com/github/iJebus/DeportationTrains)

Release 16.08.sprint2

Using [CalVer](http://calver.org/): YY.0M.Modifier
Modifier refers to sprint cycle and will be either sprint1 or sprint2. (as per ~2 spring cycles per month)

## Usage/Commands
Install python requirements.

`pip install -r requirements.txt`

Run local development environment with hot-reloading. Browser will automatically open.

`python build.py`

Create a static production build; files will be placed in the 'build' folder.

`python build.py create`

These files then need to be made available by a web server of some type; intended platform is S3 however a local python server will do for testing.

```
cd build
python -m http.server
```
