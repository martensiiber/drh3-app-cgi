#/bin/sh

sudo apt update
sudo apt -y upgrade

#see väidetavalt vajalik..
sudo reboot

sudo apt -y install gnupg2
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt install postgis postgresql-11-postgis-2.5 postgresql-12-pgrouting osm2pgrouting

export DB_NAME=newdb

sudo -u postgres createdb ${DB_NAME}
sudo -u postgres psql -d ${DB_NAME} -c "CREATE EXTENSION PostGIS; CREATE EXTENSION pgRouting;CREATE SCHEMA osm;"
