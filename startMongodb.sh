#! /bin/bash

if ! [ -d "/home/${USER}/databases/mongodb/" ]; then
mkdir -p "/home/${USER}/databases/mongodb/"
fi

mongod --dbpath "/home/${USER}/databases/mongodb/"