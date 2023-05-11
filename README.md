# substrate-check-validator
This is a small javascript that checks if the intent of a validator is to validate.
It does so by checking the commission. If the intent is not to validate, the commission would always be 0.

IMPORTANT!
This script would not work for validators that has commission set to 0. The script would then wrongly think the validator has no intent to validate.

## Install

    sudo apt update
    curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
    sudo apt -y install nodejs
    sudo apt install npm

In repository directory, run:

    npm install

## Usage

It needs path to a yaml config file as argument.

    node index.js /path/to/config.yml

 An example file is included in the repo (config.yml):

**url**: Url to the RPC node endpoint to use for requests. Must be a websocket endpoint!  
**slackApiToken**: OAuth Token for a Slack bot.  
**slackChannel**: The channel to send the notification to.  
**validators**: List of validator addresses to check.

Run this script on schedule as a cronjob or as a service timer for automated checks.
