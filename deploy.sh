#!/bin/bash

# Define the destination for index.html
DEST="/var/www/html/index.html"

# Copy the index.html file from the repo to the correct location
cp ./index.html $DEST

# Restart web server (optional, if your server needs restarting after the change)
# sudo systemctl restart nginx

# Output the status
echo "index.html has been deployed to $DEST"
