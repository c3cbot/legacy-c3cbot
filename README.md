# C3C
<a href="https://discord.gg/2A4bYJu"><img alt="discord" src="https://img.shields.io/discord/591223706643070976.svg?style=flat-square&label=discord"></a> <img alt="size" src="https://img.shields.io/github/repo-size/lequanglam/c3c.svg?style=flat-square&label=size"> <img alt="code-version" src="https://img.shields.io/badge/dynamic/json?color=red&label=code%20version&prefix=v&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2Flequanglam%2Fc3c%2Fmaster%2Fpackage.json&style=flat-square"> <a href="https://github.com/lequanglam/c3c/releases"> <img alt="github-version" src="https://img.shields.io/github/v/release/lequanglam/c3c?include_prereleases&label=github%20version&style=flat-square"></a> <a href="https://github.com/lequanglam/c3c/commits"> <img alt="commits" src="https://img.shields.io/github/commit-activity/m/lequanglam/c3c.svg?label=commit&style=flat-square"></a> 
<a href="https://github.com/lequanglam/c3c/actions"><img alt="github code checking" src="https://github.com/lequanglam/c3c/workflows/Node.js%20CI/badge.svg?event=push&label=github%20code%20check&style=flat-square"></a>

A bot that can be customized using plugins. Currently supports Facebook Messenger (using fca-unofficial, a repo forked from facebook-chat-api and maintained by me) and Discord (using discord.js)

## Before you install
Make sure you have Administrator/root permission on your terminal, otherwise you can't start bot. (reason: process priority).
Also you need to install (first => last):

1. Node.JS 12+ (of course because this thing was writen in JS) (download link <a href="#Download">here</a>)
2. Xcode (if you are using macOS)
3. Python 2/3 (Windows users can install this using `npm i windows-build-tools`, macOS doesn't need this because Xcode installed it)
4. Visual C++ Build Tools (Windows users only, use `npm i windows-build-tools` to install this)
5. make, gcc (Linux/Ubuntu only)


List of supported/tested OS:
- Windows 7+ (x86/x64)
- macOS 10.10+ (warning: lower version is not tested!)
- Ubuntu 18+ (x86/x64)
- Other Linux distro (x86/x64/ARM/... as long as **both** Node.JS and node-gyp support that architecture and OS)

Notice for Ubuntu/Linux & macOS users: Please add `sudo` before every commands.

## Install
Download latest version (version 0.3.12, as of 20/03/2020) <a href="https://github.com/lequanglam/c3c/archive/0.3.12.zip">by clicking this</a>, and then extract it. Go to the directory where it extracted (assuming you already opened a terminal), then type: 
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
- YT2MP3 (`/plugins/YT2MP3.z3p`) => Convert youtube links to MP3.
- DenyCommand (`/plugins/DenyCommand.z3p`) => Allow admins (operators) to disable some commands.
- eXPerienceChat (`/plugins/eXPerienceChat.z3p`) => Add XP ranking system.

## Libraries (as plugins)
- LibBetterRandom (`/plugins/LibBetterRandom.z3p`) => Implent Mersenne Twister random algorithim for other plugins to be used. Currently used by `Economy-Income` and `Economy-Gambling`

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
  "fb2fasecret": "BASE32OFSECRETKEY",
  "fbuseragent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36",
  "fblistenwhitelist": false,
  "fblisten": [
    "0"
  ],
  "facebookAutoRestartLoggedOut": true,
  "facebookProxy": null,
  "facebookProxyUseSOCKS": false,
  "portSOCK2HTTP": 0,
  "addressSOCK2HTTP": "127.0.0.1",
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
  "allowAdminUseRestartCommand": true,
  "allowAdminUseShutdownCommand": false,
  "allowUserUsePluginsCommand": true,
  "allowUserUseReloadCommand": false,
  "language": "en_US",
  "enableThanosTimeGems": true, 
  "allowEveryoneTagEvenBlacklisted": true,
  "DEBUG_FCA_LOGLEVEL": "error",
  "enableSSHRemoteConsole": false,
  "sshRemoteConsoleIP": "0.0.0.0",
  "sshRemoteConsolePort": 2004,
  "sshUsername": "admin",
  "sshPassword": "c3cbot@ADMIN",
  "nsfwjsSmallModel": true,
  "commandPrefix": "/",
  "autoRestartTimerMinutes": 50,
  "autoUpdate": true,
  "configVersion": 1,
  "enableMetric": true,
  "metricHideBotAccountLink": true
}
```

## Metric
This program will send these things to Metric server (<https://c3c-metric.lequanglam.cf>) (closed source):
- Your external IPv4 or IPv6 address
- The version you currently running
- Your system info (amount of RAM, OS type, OS version, CPU arch, CPU load)
- ID of Facebook/Discord account currently running at (will not shown to everyone by default)

If you really want to completely disable Metric, set `enableMetric` in `config.json` to `false`.

<span name="Download"></span>
## Node.JS 12 & 13 download link:
- Official Node.JS webpage: https://nodejs.org/en/

## Donation
```
Bitcoin:  1TTCLqLHSNegudfS7Ub7dUEGxUurGs8uH
Litecoin: LQLTTCLUG9g7EfnpanwPH5MFjr7jdQRzfs
Dogecoin: DTTCLQLeCGDmKmwyy2Nn2SYgbLAyE662ua
Ethereum: 0x11C1014fA416c585DE0BA41900056fB9407D57a2
```
