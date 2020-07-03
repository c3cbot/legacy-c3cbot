# C3C
<a href="https://discord.gg/2A4bYJu"><img alt="discord" src="https://img.shields.io/discord/591223706643070976.svg?style=flat-square&label=discord"></a> <img alt="size" src="https://img.shields.io/github/repo-size/lequanglam/c3c.svg?style=flat-square&label=size"> <img alt="code-version" src="https://img.shields.io/badge/dynamic/json?color=red&label=code%20version&prefix=v&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2Flequanglam%2Fc3c%2Fmaster%2Fpackage.json&style=flat-square"> <a href="https://github.com/lequanglam/c3c/releases"> <img alt="github-version" src="https://img.shields.io/github/v/release/lequanglam/c3c?include_prereleases&label=github%20version&style=flat-square"></a> <a href="https://github.com/lequanglam/c3c/commits"> <img alt="commits" src="https://img.shields.io/github/commit-activity/m/lequanglam/c3c.svg?label=commit&style=flat-square"></a> 
<a href="https://github.com/lequanglam/c3c/actions"><img alt="github code checking" src="https://github.com/lequanglam/c3c/workflows/Node.js%20CI/badge.svg?event=push&label=github%20code%20check&style=flat-square"></a>

A bot that can be customized using plugins. Currently supports Facebook Messenger (using fca-unofficial, a repo forked from facebook-chat-api and maintained by me) and Discord (using discord.js)

~~_Now Heroku compatible!_ (you may need to manually create a config file, through.)~~ Heroku blocked Metric server's IP, will change that soon.
If you want to run on Heroku, use other external service to request to dummy HTTP server located on your domain.

## Before you install
Make sure you have Administrator/root permission on your terminal, otherwise you can't start bot. (reason: process priority).
Also you need to install (first => last):

1. .NET Framework 4+ (Windows **7** only)
2. make, gcc (Linux/Ubuntu only)
3. Node.JS >=12.9 (recommended: use Node 14) (download link <a href="#Download">here</a>)
4. Xcode (if you are using macOS)
5. Python 2/3 (Windows users: Use `wibuildtools.bat` or `"%ProgramFiles%\nodejs\install_tools.bat"`, alternatively you can use `npm i --add-python-to-path windows-build-tools`)
6. Visual C++ Build Tools (Windows users only, same as Python)


List of *might be* supported/tested OS (not tested: \*):
- Windows 7+ (x86/x64)
  - Windows 7 (x86\*/x64)
  - Windows 8.1 (x86\*/x64)
  - Windows 10 (x86/x64)
- macOS 10.9+ [yes we support 10.9/10.10, even through Node dropped that version.]
  - Mac OS X 10.9 “Mavericks”
  - Mac OS X 10.10 “Yosemite”
  - Mac OS X 10.11 “El Capitan”
  - macOS 10.12 “Sierra”
  - macOS 10.13 “High Sierra”
  - macOS 10.14 “Mojave”
  - macOS 10.15 “Catalina”
- Linux/*nix
  - Ubuntu 16.04+ (x64)
    - Ubuntu 16.04
    - Ubuntu 16.10\*
    - Ubuntu 17.04\*
    - Ubuntu 17.10\*
    - Ubuntu 18.04
    - Ubuntu 18.10\*
    - Ubuntu 19.04
    - Ubuntu 19.10\*
    - Ubuntu 20.04
  - Linux distros which are able to run Node 12 (x86/x64/ARMv7/ARM64/...)\*
- Android (through TermUX) (warning: unstable!)
- Chrome OS w/ Google Play (through TermUX)

Notice for Ubuntu/Linux & macOS users: Please add `sudo` before every commands. (if your OS has sudo, that is.)

## Install
Download latest version (version 0.4.1, as of 25/06/2020) <a href="https://github.com/lequanglam/c3c/archive/0.4.1.zip">by clicking this</a>, and then extract it (or, you can clone this repository if you want to run BETA version, but *please* do not use Download ZIP button, use `git clone`). Go to the directory where it extracted (assuming you already opened a terminal), then type: 
```bash
npm install
``` 
and you are ready to go.

## Usage
```bash
npm start
```

If this is the first time you execute this command, it'll generate `config.json` file. Close that command and then configure `config.json` file.

After that, you can run that command again and the bot will go live.

## Localize
This bot currently supporting 2 language: `en_US` (English) and `vi_VN` (Tiếng Việt). You can change languages in `config.json`.

## Facebook test accounts
A Facebook test account is an account just like normal accounts, however it can't contact with normal accounts. This account can be used to test and config the bot before going live.

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
  "allowEveryoneTagEvenBlacklisted": true,
  "DEBUG_FCA_LOGLEVEL": "error",
  "enableSSHRemoteConsole": false,
  "sshRemoteConsoleIP": "0.0.0.0",
  "sshRemoteConsolePort": 2004,
  "sshUsername": "admin",
  "sshPassword": "c3cbot@ADMIN",
  "commandPrefix": "/",
  "autoUpdate": true,
  "autoUpdateTimer": 60,
  "configVersion": 1,
  "enableMetric": true,
  "metricHideBotAccountLink": true,
  "enableGlobalBan": true,
  "hideUnknownCommandMessage": false,
  "herokuApplication": ""
}
```
Note: `herokuApplication`: Your Heroku application name, NOT URL (this is used for keeping the bot running and don't get flagged as idle) (you can leave this empty if you're not using Heroku)

## Metric
This program will send these things to Metric server (<https://metric.c3c.tech>) (closed source):
- Your external IPv4 or IPv6 address
- The version you currently running
- Your system info (amount of RAM, OS type, OS version, CPU arch, CPU load)
- ID of Facebook/Discord account currently running at (will not shown to everyone by default)

If you really want to completely disable Metric, set `enableMetric` in `config.json` to `false`. (but I don't recommended you to disable Metric, especially if you're going to run in Heroku, Metric is used to ping your bot to keep it alive for 18 hours.)

<span name="Download"></span>
## Node.JS download link:
- Official Node.JS webpage: https://nodejs.org/en/

## Donation
```
Cryptocurrency: <temporary removed, sorry!>
PlayerDuo: https://playerduo.com/c3cbotadmin
```
 
## License
This project is licensed under the GNU General Public License v3.0 License - see the [LICENSE](LICENSE) file for details.
