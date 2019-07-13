# C3C
<img alt="vulnerabilities" src="https://img.shields.io/snyk/vulnerabilities/github/lequanglam/c3c.svg?style=flat-square"> <a href="https://discord.gg/2A4bYJu"><img alt="discord" src="https://img.shields.io/discord/591223706643070976.svg?style=flat-square"></a> <img alt="reposize" src="https://img.shields.io/github/repo-size/lequanglam/c3c.svg?style=flat-square"> <img alt="codesize" src="https://img.shields.io/github/languages/code-size/lequanglam/c3c.svg?style=flat-square"> <img alt="version" src="https://img.shields.io/github/package-json/v/lequanglam/c3c.svg?style=flat-square"> <a href="https://github.com/lequanglam/c3c/releases"><img alt="commit count" src="https://img.shields.io/github/commit-activity/m/lequanglam/c3c.svg?label=commit&style=flat-square"></a>

A bot that can be customized using plugins. Currently supports Facebook Messenger (using facebook-chat-api) and Discord (using discord.js)

## Install
Install Node.JS and Git if you don't have one. If you're using Windows, you need to open command prompt and type this command:
```bash
npm install -g windows-build-tools
```
After that, download latest releases. Extract it then go to the directory where it extracted, then type: 
```bash
npm install
``` 
and you are ready to go.

## Usage
```bash
node index.js
```

If this is the first time you execute this command, it'll generate `config.json` file. Close that command and then configure `config.json` file.

After that, you can run that command again and bot will go live.

## Plugins
Currently, there's only 3 plugins writen by me: 
- SimSimi (`/plugins/SimSimi.z3p`)

-- Main function: Allow users to chat with SimSimi.
- Economy (`/plugins/Economy.z3p`)

-- Main function: Create an economy.
- Economy-Income (`/plugin/Economy-Income.z3p`)

-- Main function: Add a way to earn money. Extends `Economy`

## Localize
This bot is in early state, so only EN are supported and `language` in config has no function.

## Facebook test accounts
A Facebook test account is an account just like normal accounts, however it can't contract with normal accounts. This account can be used to test and config the bot before going live.

You can create one in [here](https://www.facebook.com/whitehat/accounts/).

## Example config
If you don't want the bot create a `config.json` file for you, then here is the content that bot will write into `config.json` file:
```json
{
    "testmode": false,
    "baseprefix": "[Bot]",
    "botname": "C3CBot",
    "enablefb": false,
    "usefbappstate": true,
    "fbemail": "",
    "fbpassword": "",
    "fbuseragent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    "fblistenwhitelist": false,
    "fblisten": [
        "0"
    ],
    "enablediscord": false,
    "discordtoken": "",
    "discordlistenwhitelist": false,
    "discordlisten": [
        "0"
    ],
    "admins": [
        "FB-0",
        "DC-0"
    ],
    "blacklistedUsers": [
        "FB-0",
        "DC-0"
    ],
    "allowAdminUseRestartCommand": false,
    "allowUserUsePluginsCommand": false,
    "allowUserUseReloadCommand": false,
    "language": "en_US",
    "enableThanosTimeGems": false
}
```
