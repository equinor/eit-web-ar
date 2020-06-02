#!/bin/sh

### PURPOSE
#
# Make some runtime preparations before we start nginx


### BOOTSTRAP CLIENT DATA
#
# nginx will serve static files.
# We can make the initial environment variables available to the client app by copying them to a json file before starting the server.
ENV_TEMPLATE_PATH="/app/server/env.json"
ENV_OUTPUT_PATH="/app/www/env.json"
envsubst < "$ENV_TEMPLATE_PATH" > "$ENV_OUTPUT_PATH"
echo -e "\n$(date) Bootstrapped client data:"
cat "$ENV_OUTPUT_PATH"

### NGINX
# 
echo -e "\n$(date) Starting nginx"
nginx -g "daemon off;"