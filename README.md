# C3C
<a href="https://discord.gg/2A4bYJu"><img alt="discord" src="https://img.shields.io/discord/591223706643070976.svg?style=flat-square&label=discord"></a> <img alt="size" src="https://img.shields.io/github/repo-size/lequanglam/c3c.svg?style=flat-square&label=size"> <img alt="code-version" src="https://img.shields.io/badge/dynamic/json?color=red&label=code%20version&prefix=v&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2Flequanglam%2Fc3c%2Fmaster%2Fpackage.json&style=flat-square"> <a href="https://github.com/lequanglam/c3c/releases"> <img alt="github-version" src="https://img.shields.io/github/v/release/lequanglam/c3c?include_prereleases&label=github%20version&style=flat-square"></a> <a href="https://github.com/lequanglam/c3c/commits"> <img alt="commits" src="https://img.shields.io/github/commit-activity/m/lequanglam/c3c.svg?label=commit&style=flat-square"></a> <a href="https://travis-ci.org/lequanglam/c3c"><img alt="code checking" src="https://img.shields.io/travis/lequanglam/c3c/master?label=code%20check&style=flat-square"></a>

A bot that can be customized using plugins. Currently supports Facebook Messenger (using facebook-chat-api) and Discord (using discord.js)

## Install
Install Node.JS (8 or 10, 12 and 13 will not work! {thank you, V8, for making me do this}) and Git if you don't have one. If you're using Windows, you need to open command prompt and type this command:
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
npm start
```

If this is the first time you execute this command, it'll generate `config.json` file. Close that command and then configure `config.json` file.

After that, you can run that command again and bot will go live.

## Plugins
- SimSimi (`/plugins/SimSimi.z3p`) => Allow users to chat with SimSimi.
- Economy (`/plugins/Economy.z3p`) => Create an economy.
- Economy-Income (`/plugin/Economy-Income.z3p`) => Add a way to earn money. Extends `Economy`
- Economy-Gambling (`/plugins/Economy-Gambling.z3p`) => Add some gambling games to bot. Extends `Economy`

## Localize
This bot currently supporting 2 language: `en_US` (English) and `vi_VN` (Tiếng Việt). You can change languages in `config.json`.

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
    "enableThanosTimeGems": true,
    "allowEveryoneTagEvenBlacklisted": true
}
```

## Donation
<tt>Bitcoin:  1TTCLqLHSNegudfS7Ub7dUEGxUurGs8uH</tt><br>
<tt>Litecoin: LQLTTCLUG9g7EfnpanwPH5MFjr7jdQRzfs</tt><br>
<tt>Dogecoin: DTTCLQLeCGDmKmwyy2Nn2SYgbLAyE662ua</tt><br>
<tt>Ethereum: 0x11C1014fA416c585DE0BA41900056fB9407D57a2</tt><br>
