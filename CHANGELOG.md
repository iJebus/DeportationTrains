# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Calendar Versioning](http://semver.org/).

## [Unreleased]
### Added
#### General
- Update README regarding deployment details
- Ignoring PEP8 line too long, though will still generally try to keep below 80 characters per line
- Add .editorconfig to help with consistent style/clean files
- General cleanup of dead code/files etc from repo
- Automatically deploy new commits to S3 on successful passing of tests (via Travis CI)
#### Frontend
#### Backend
- Create providers file/module, currently only contains AWS/S3
- Create YAML-based external config for e.g. AWS/S3 credentials/config
- Add Selenium tests

## [16.08.sprint2]
### Added
#### General
- Requirements-dev.txt file for some the more development-only side of things. Still need to clean requirements.txt
#### Frontend
- Working example of personal/individual deportee map
#### Backend
- Rewrite of unique filter set code to provide all available filters
- Breakup major functions into smaller parts
- Start writing out some very basic tests
- Start of implmenting direct to s3 upload

## [16.08.sprint1]
### Added
#### Backend
- Reimplementation/breaking changes to script extracting data from google sheets
  - Great deal more properties available on each user
  - Growing number of pregenerated unique sets e.g. Names, trains, nationalities
  - Start implementing type annotations on methods as per PEP484
  - Fix style errors according to flake8 test.
  - Try to improve method naming. This is surprisingly hard :<

## [16.07.sprint2]
### Added
#### General
- Change log record/document (this document)
- Requests library to requirements.txt
#### Frontend
- Time slider for multiple persons
- Custom markers for events e.g. arrest, labor, residence, deportation
#### Backend
- Time property to each feature in geojson export
- Method to determine uncertainty in dates if a value is not provided in original data
