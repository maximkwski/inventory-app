#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
node db/setup.js
node db/populateDb.js