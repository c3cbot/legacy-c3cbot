/*
  Copyright © 2021  BadAimWeeb/クオソラ

  Implementation of CMv2 Metric protocol for Legacy C3CBot (0.x)
  Status: Testing
*/

// Default server, should not be changed
const METRIC_SERVER = "wss://metric-cfc.herokuapp.com/service_ping";

// Should not be larger than 45 seconds (else your old ping will expire and the metric server will mark you as offline)
// Recommended value: 20-30
const PING_INTERVAL = 30;

(async () => {
  let { osName } = require("./getOSInfo.js");

  let socketIO = require("socket.io-client");
  let log = require("./logger");
  let util = require("util");
  let fs = require("fs");
  let os = require("os");

  async function generateExtraData() {
    return {
      description: await fs.promises.readFile("./bot_description.txt"),
      ram: {
        total: os.totalmem(),
        free: os.freemem(),
        botUsed: process.memoryUsage().rss
      },
      cpu: {
        arch: os.arch(),
        load: global.currentCPUPercentage
      },
      os: {
        type: os.type(),
        platform: os.platform(),
        release: os.release(),
        name: osName
      },
      botName: global.config.botname,
      prefix: global.config.prefix,
      interfaceList: global.config.sendInterfaceInfoToMetric ? [
        ...(
          !isNaN(parseInt(global.facebookid)) ? [{
            interfaceID: 1,
            type: "Facebook",
            accountID: global.facebookid
          }] : []
        ),
        ...(
          !isNaN(parseInt(global.discordid)) ? [{
            interfaceID: 2,
            type: "Discord",
            accountID: global.discordid
          }] : []
        )
      ] : []
    };
  }

  try {
    let io = socketIO.io(METRIC_SERVER);
    let ioACKP = util.promisify(io.emit);

    // Check in the internal storage if there is a id-secret pair
    if (
      typeof global.data.metric !== "object" ||
      typeof global.data.metric[0] !== "string" ||
      typeof global.data.metric[1] !== "string"
    ) {
      // Requesting a new pair of metric ID
      let ack = await ioACKP("private message", {
        callEvent: "register",
        type: "C3CBot",
        version: global.cVersion,
        extraData: JSON.stringify(await generateExtraData())
      });

      global.data.metric = [ack.id, ack.secret];
    } else {
      await ioACKP("private message", {
        callEvent: "ping",
        id: global.data.metric[0],
        secret: global.data.metric[1],
        type: "C3CBot",
        version: global.cVersion,
        extraData: JSON.stringify(await generateExtraData())
      });
    }

    setInterval(async () => {
      try {
        await ioACKP("private message", {
          callEvent: "ping",
          id: global.data.metric[0],
          secret: global.data.metric[1],
          type: "C3CBot",
          version: global.cVersion,
          extraData: JSON.stringify(await generateExtraData())
        });
      } catch (_) {
        log("CMv2 Protocol handler encountered an error:", _);
      }
    }, PING_INTERVAL * 1000);
  } catch (_) {
    log("CMv2 Protocol handler encountered an error:", _);
  }
});
