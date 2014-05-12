sudo apt-get install git
sudo apt-get update
sudo apt-get install build-essential
sudo apt-get install libssl-dev
sudo apt-get install libpopt-dev
git clone https://github.com/intimonkey/approuter.git
cd approuter/
make


start_approuter https://github.com/drewtron/d2dautoclaim.git 8080 1

update approuter to work for services
