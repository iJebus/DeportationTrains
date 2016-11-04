# DeportationTrains
[![Build Status](https://travis-ci.org/iJebus/DeportationTrains.svg?branch=flask)](https://travis-ci.org/iJebus/DeportationTrains)
[![Code Climate](https://codeclimate.com/github/iJebus/DeportationTrains/badges/gpa.svg)](https://codeclimate.com/github/iJebus/DeportationTrains)

Release 16.11.sprint1

Using [CalVer](http://calver.org/): YY.0M.Modifier
Modifier refers to sprint cycle and will be either sprint1 or sprint2. (as per ~2 spring cycles per month)

## Usage

To get set up, [follow the instructions over in the wiki](https://github.com/iJebus/DeportationTrains/wiki/Maintenance-Manual#installing-the-project).

Once you're installed and set up, researchers only need to work on the Google Sheets document as normal to add additional information/data to the map. When ready to view the added data, run the development server (`python run.py dev`) and check the map. If everything looks good, great! Now you only need to run `python run.py deploy S3` to upload the live copy of the website for everyone to view.