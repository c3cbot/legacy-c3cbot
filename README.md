# c3c 0.x

Legacy version of C3CBot.   ̷N̷o̷   Some official support will be given on this build.

Upcoming version (1.x) will use [NOCOM kernel](https://github.com/NOCOM-BOT/core) as main kernel/core. Stay tuned.

NOTE: This version is now licensed under MIT license. You can now freely modify code, as long as you keep the author header intact.

Latest version: 0.8.2 (download [here](https://github.com/c3cbot/legacy-c3cbot/releases/tag/0.8.2))

Changelog (since 0.6):
- Added support for ES modules (0.8+)

> *npm is now having more and more packages switching their code to ESM only, causing CJS-based program to not work properly. This fixes that.*

- Added encrypted state (0.8+)

> *I encountered a lot of people running c3c in some PaaS having their appstate/FBstate stolen and bot account getting compromised. This is now the way to stop it from happening, and I recommended people to update to this version.*

How to use the encrypted state feature: Add C3CBOT_ENCRYPTED_KEY enviroment variable with random password (note: must be random, at least 48 characters, and is never leaked). Then, download the updated FBState utilities and generate a new encrypted state. It will ask for the random password you generated before. Note that it must match, otherwise the bot will fail to login.

(0.8.2+) You can also use the new auto-encrypt feature (thanks @bhhoang for the idea). Simply put an unecrypted plain-text state, supplying C3CBOT_ENCRYPTED_KEY enviroment variable, and the bot will automaticially encrypt the state (provided that the bot also has disk write access, which most PaaS don't, so you should run this at your computer first).

- Removed abandoned/unused features (as of 0.8)
