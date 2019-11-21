#!/bin/sh
# Download files
export DB_NAME=newdb
mkdir setup
wget -O setup/estonia-latest.osm.bz2 "http://download.geofabrik.de/europe/estonia-latest.osm.bz2"
wget -O setup/mapconfig_for_cars.xml "https://raw.githubusercontent.com/pgRouting/osm2pgrouting/master/mapconfig_for_cars.xml"
cd setup/
bzip2 -dk estonia-latest.osm.bz2
# -W password
osm2pgrouting --f estonia-latest.osm --conf mapconfig_for_cars.xml --schema osm --prefix est --dbname ${DB_NAME} --username postgres -W postgres
