# c3c 0.x

Legacy version of C3CBot. No official support will be given on this build. Beware.

Upcoming version (1.x) will use [NOCOM kernel](https://github.com/NOCOM-BOT/core) as main features. Stay tuned.

NOTE: This version is now licensed under MIT license. You can now freely modify code, as long as you keep the author header intact.

Latest version: 0.8.0 (download [here](https://github.com/c3cbot/legacy-c3cbot/releases/tag/0.8.0))

Changelog (since 0.6):
- Added support for ES modules

> *npm is now having more and more packages switching their code to ESM only, causing CJS-based program to not work properly. This fixes that.*

- Added encrypted state

> *I encountered a lot of people running c3c in some PaaS having their appstate/FBstate stolen and bot account getting compromised. This is now the way to stop it from happening, and I recommended people to update to this version.*

How to use the encrypted state feature: Add C3CBOT_ENCRYPTED_KEY enviroment variable with random password (note: must be random, at least 48 characters, and is never leaked). Then, download the updated FBState utilities and generate a new encrypted state. It will ask for the random password you generated before. Note that it must match, otherwise the bot will fail to login.
