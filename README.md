# Cmad- [![DOI](https://zenodo.org/badge/196399973.svg)](https://zenodo.org/badge/latestdoi/196399973)

Prototype for evaluation of multiple flexibilization approaches of research documentation.

# Getting Started

1. Clone this repository
2. Run `npm install` in root directory of repository
3. Run `npm run serve` and open `http://localhost:4200/`

# 

The frontend is built with Angular and the Angular Material library. The backend is mocked with a npm-module called json-server. 

Files in the folder `data` are automatically merged when changed.

The folder contains sub-folders for german and english. These languages are merged into the files `data_en.json` and `data_de.json`.

* The prototype is served at http://localhost:4200/.
* The json-server is served at http://localhost:3000/

| NPM Command (`npm run ...`) | Action                                                                                              |
|--------------------------|-----------------------------------------------------------------------------------------------------|
| `serve`                    | Concurrently run an angular dev server for the german prototype and the backend mock server.        |
| `serve:en`                 | Concurrently run an angular dev server for the english prototype and the backend mock server.       |
| `serve:prod`               | Concurrently run an angular production server for the german prototype and the backend mock server. |

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6.

# Administration

The prototype can be administrated at http://localhost:4200/admin.

There you can view logs, change the flexibilization method, export and delete logs.

The export contains these values:

* `proband`: Proband id
* `systemType`: current flexibilization method
* `timestamp`: timestamp of export
* `time`: human readable timestamp of export
* `logs`: all exported logs (e.g. user actions)
* `finalState`: State of all created projects of prototype at export 

# Authors

* Guido Knoll
* Susanne Putze

# License

Copyright © 2019 Guido Knoll | Apache License
