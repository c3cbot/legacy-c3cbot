/* eslint-disable array-element-newline */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-warning-comments */
/* eslint-disable no-throw-literal */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-undefined */
/* eslint-disable no-return-assign */
/* eslint-disable no-redeclare */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
Number.prototype.pad = function (width, z) {
  z = z || '0';
  var n = this.valueOf() + '';
  return (n.length >= width ? n : (new Array(width - n.length + 1).join(z) + n));
}
Number.prototype.round = function (decimal) {
  var dec = decimal || 0;
  var dec2 = Math.pow(10, dec);
  var num = this.valueOf();
  return Math.round(num * dec2) / dec2;
};
Number.prototype.ceil = function (decimal) {
  var dec = decimal || 0;
  var dec2 = Math.pow(10, dec);
  var num = this.valueOf();
  return Math.ceil(num * dec2) / dec2;
};
Number.prototype.floor = function (decimal) {
  var dec = decimal || 0;
  var dec2 = Math.pow(10, dec);
  var num = this.valueOf();
  return Math.floor(num * dec2) / dec2;
};

//Check folder exists and create it 
function ensureExists(path, mask) {
  if (typeof mask != 'number') {
    mask = 0o777;
  }
  try {
    fs.mkdirSync(path, {
      mode: mask,
      recursive: true
    });
    return undefined;
  } catch (ex) {
    return { err: ex };
  }
}

// object.watch
if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, "watch", {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (prop, handler) {
      var
        oldval = this[prop],
        newval = oldval,
        getter = function () {
          return newval;
        },
        setter = function (val) {
          oldval = newval;
          return newval = handler.call(this, prop, oldval, val);
        };

      if (delete this[prop]) { // can't watch constants
        Object.defineProperty(this, prop, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true
        });
      }
    }
  });
}
// object.unwatch
if (!Object.prototype.unwatch) {
  Object.defineProperty(Object.prototype, "unwatch", {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (prop) {
      var val = this[prop];
      delete this[prop]; // remove accessors
      this[prop] = val;
    }
  });
}
var sizeObject = function (object) {
  return Object.keys(object).length;
};

global.nodemodule = {};
var os = require("os");
const fs = require('fs');
var path = require("path");
var http = require("http");
var canvas = require("canvas");
var Canvas = canvas.Canvas;
var Image = canvas.Image;
var Worker = require('tiny-worker');
const util = require('util');
var streamBuffers = require('stream-buffers');
var syncrequest = require('sync-request');
var wait = require('wait-for-stuff');
var semver = require("semver");
var childProcess = require("child_process");
const Socks = require('socks').SocksClient;
var url = require("url");
var zlib = require("zlib");
////const onChange = require('on-change');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: ""
});
////var querystring = require('querystring');
////const request = require('request');
////var delay = require('delay');
const StreamZip = require('node-stream-zip');
////var tf = require("@tensorflow/tfjs");
global.sshcurrsession = {};
global.sshstream = {};
global.nsfwjsdata = {};

ensureExists(path.join(__dirname, "logs/"));

/**
 * Log to console and also write to logs file, print to every ssh console session
 *
 * @param   {any}  ...message  Anything
 *
 * @return  {undefined}        Function will not return anything
 */
function log(...message) {
  var date = new Date();
  readline.cursorTo(process.stdout, 0);
  var x = ["\x1b[K" + "\x1b[1;32m" + "\x1b[1;92m" + "\x1b[38;2;0;255;0m" + "[" + (date.getUTCFullYear().pad(4) + "-" + (date.getUTCMonth() + 1).pad(2) + "-" + date.getUTCDate().pad(2) + "T" + date.getUTCHours().pad(2) + "-" + date.getUTCMinutes().pad(2) + "-" + date.getUTCSeconds().pad(2) + "." + date.getUTCMilliseconds().pad(3) + "Z") + "]"];
  console.log.apply(console, x.concat(message).concat(["\x1b[1;32m"]))
  rl.prompt(true);
  var tolog = "[" + (date.getUTCFullYear().pad(4) + "-" + (date.getUTCMonth() + 1).pad(2) + "-" + date.getUTCDate().pad(2) + "T" + date.getUTCHours().pad(2) + "-" + date.getUTCMinutes().pad(2) + "-" + date.getUTCSeconds().pad(2) + "." + date.getUTCMilliseconds().pad(3) + "Z") + "]";
  for (var n in message) {
    if (typeof message[n] == "object") {
      tolog += " " + util.format("%O", message[n]);
    } else {
      tolog += " " + util.format("%s", message[n]);
    }
  }
  fs.appendFileSync(path.join(__dirname, '/logs/log-' + date.getUTCFullYear().pad(4) + '-' + (date.getUTCMonth() + 1).pad(2) + '-' + date.getUTCDate().pad(2) + '.log'), tolog + "\r\n");

  var tssh = "\x1b[K" + "\x1b[1;32m" + "\x1b[1;92m" + "\x1b[38;2;0;255;0m" + (date.getUTCFullYear().pad(4) + "-" + (date.getUTCMonth() + 1).pad(2) + "-" + date.getUTCDate().pad(2) + "T" + date.getUTCHours().pad(2) + "-" + date.getUTCMinutes().pad(2) + "-" + date.getUTCSeconds().pad(2) + "." + date.getUTCMilliseconds().pad(3) + "Z") + "]";
  for (var n in message) {
    if (typeof message[n] == "object") {
      tssh += " " + util.formatWithOptions({
        colors: true
      }, "%O", message[n]);
    } else {
      tssh += " " + util.formatWithOptions({
        colors: true
      }, "%s", message[n]);
    }
  }
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!global.sshcurrsession) {
    if (typeof global.sshcurrsession == "object") {
      for (var session in global.sshstream) {
        try {
          global.sshstream[session].stdout.write("\r");
          global.sshstream[session].stdout.write(tssh.replace(/\r\n/g, "\uFFFF").replace(/\n/g, "\r\n").replace(/\uFFFF/g, "\r\n") + "\r\n" + "\x1b[1;32m");
          global.sshcurrsession[session].prompt(true);
          global.sshstream[session].stdout.write(global.sshcurrsession[session].line);
        } catch (ex) { }
      }
    }
  }
}

//Capturing STDERR
var stderrold = process.stderr.write;
global.stderrdata = "";
process.stderr.write = function (chunk, encoding, callback) {
  global.stderrdata += chunk;
  if (typeof callback == "function") {
    callback();
  }
};
setInterval(() => {
  if (global.stderrdata != "" && global.stderrdata.indexOf("Hi there 👋. Looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, which binds to TensorFlow C++, by running npm i @tensorflow/tfjs-node, or npm i @tensorflow/tfjs-node-gpu if you have CUDA. Then call require('@tensorflow/tfjs-node'); (-gpu suffix for CUDA) at the start of your program. Visit https://github.com/tensorflow/tfjs-node for more details.") == -1) {
    var arr = global.stderrdata.split(/[\r\n]|\r|\n/g).filter((val) => val != "");
    arr.splice(arr.length - 1, 1);
    for (var n in arr) {
      log("[STDERR]", arr[n]);
    }
  }
  global.stderrdata = "";
}, 499);

//Outputs version 
var version = require("./package.json").version;
log("Starting C3CBot version", version, "...");

var defaultconfig = {
  testmode: false,
  baseprefix: "[Bot]",
  botname: "C3CBot",
  enablefb: false,
  usefbappstate: true,
  fbemail: "",
  fbpassword: "",
  fbuseragent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36",
  fblistenwhitelist: false,
  fblisten: [
    "0" //Replace 0 with FB Thread ID
  ],
  facebookProxy: null,
  facebookProxyUseSOCKS: false,
  enablediscord: false,
  discordtoken: "",
  discordlistenwhitelist: false,
  discordlisten: [
    "0" //Replace 0 with Discord channel ID
  ],
  admins: [
    "FB-0", //Replace 0 with FBID
    "DC-0" //Replace 0 with Discord ID
  ],
  blacklistedUsers: [
    "FB-0", //Replace 0 with FBID
    "DC-0" //Replace 0 with Discord ID
  ],
  allowAdminUseRestartCommand: false,
  allowUserUsePluginsCommand: false,
  allowUserUseReloadCommand: false,
  language: "en_US",
  enableThanosTimeGems: true, //Anti-Unsend
  allowEveryoneTagEvenBlacklisted: true,
  DEBUG_FCA_LOGLEVEL: "error",
  enableSSHRemoteConsole: false,
  sshRemoteConsoleIP: "0.0.0.0",
  sshRemoteConsolePort: 2004,
  sshUsername: "admin",
  sshPassword: "c3cbot@ADMIN",
  nsfwjsSmallModel: true, //! DO NOT SET THIS TO FALSE UNLESS YOU HAVE A BEEFY SERVER!
  commandPrefix: "/"
}

//Load config
global.config = fs.existsSync(path.join(__dirname, "config.json")) ? (function () {
  var readedConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")));
  for (var configName in defaultconfig) {
    if (!Object.prototype.hasOwnProperty.call(readedConfig, configName)) {
      readedConfig[configName] = defaultconfig[configName];
      log("[INTERNAL]", "Missing", configName, "in config file. Adding with default value (", defaultconfig[configName], ")...");
    }
  }
  for (var configName in readedConfig) {
    if (!Object.prototype.hasOwnProperty.call(defaultconfig, configName)) {
      delete readedConfig[configName];
      log("[INTERNAL]", "Deleted ", configName, "in config file. (unused)");
    }
  }
  fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(readedConfig, null, 4));
  return readedConfig;
})() : (function () {
  log("[INTERNAL]", "Config file not found. Creating a default one...");
  try {
    fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(defaultconfig, null, 4));
  } catch (ex) {
    log("[INTERNAL]", "Cannot write default config, returned an error: ", ex);
  }
  return defaultconfig;
})();

var testmode = global.config.testmode;
var prefix = global.config.baseprefix;
var botname = global.config.botname;

global.lang = require('js-yaml').load(fs.existsSync(path.join(__dirname, "lang", global.config.language + ".yml")) ? fs.readFileSync(path.join(__dirname, "lang", global.config.language + ".yml"), {
  encoding: 'utf-8'
}) : (function () {
  log("[INTERNAL]", path.join(__dirname, "lang", global.config.language + ".yml"), ": not found | Defaulting to en_US.yml ...");
  return fs.readFileSync(path.join(__dirname, "lang", "en_US.yml"), {
    encoding: 'utf-8'
  });
})());

if (global.config.facebookProxyUseSOCKS) {
  class ProxyServer {
    constructor(options) {
      http.Server.call(this, () => { });
      this.proxyList = [];
      if (options.socks) {
        // stand alone proxy loging
        this.loadProxy(options.socks);
      } else if (options.socksList) {
        // proxy list loading
        this.loadProxyFile(options.socksList);
        if (options.proxyListReloadTimeout) {
          setInterval(
            () => {
              this.loadProxyFile(options.socksList);
            },
            options.proxyListReloadTimeout * 1000
          );
        }
      }
      this.addListener(
        'request',
        this.requestListener.bind(this, () => this.randomElement(this.proxyList))
      );
      this.addListener(
        'connect',
        this.connectListener.bind(this, () => this.randomElement(this.proxyList))
      );
    }

    randomElement(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    getProxyObject(host, port, login, password) {
      return {
        ipaddress: host,
        // eslint-disable-next-line radix
        port: parseInt(port, 10),
        type: 5,
        authentication: {
          username: login || '',
          password: password || ''
        }
      };
    }

    parseProxyLine(line) {
      const proxyInfo = line.split(':');

      if (proxyInfo.length !== 4 && proxyInfo.length !== 2) {
        throw new Error(`Incorrect proxy line: ${line}`);
      }

      return this.getProxyObject.apply(this, proxyInfo);
    }

    requestListener(getProxyInfo, request, response) {
      log("[SOCKS2HTTP]", info(`request: ${request.url}`));

      const proxy = getProxyInfo();
      const ph = url.parse(request.url);

      const socksAgent = new Socks.Agent({
        proxy,
        destination: {
          host: ph.hostname,
          port: ph.port
        }
      });

      const options = {
        port: ph.port,
        hostname: ph.hostname,
        method: request.method,
        path: ph.path,
        headers: request.headers,
        agent: socksAgent
      };

      const proxyRequest = http.request(options);

      request.on('error', (err) => {
        log("[SOCKS2HTTP]", `${err.message}`);
        proxyRequest.destroy(err);
      });

      proxyRequest.on('error', (error) => {
        log("[SOCKS2HTTP]", `${error.message} on proxy ${proxy.ipaddress}:${proxy.port}`);
        response.writeHead(500);
        response.end('Connection error\n');
      });

      proxyRequest.on('response', (proxyResponse) => {
        proxyResponse.pipe(response);
        response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
      });

      request.pipe(proxyRequest);
    }

    connectListener(getProxyInfo, request, socketRequest, head) {
      const proxy = getProxyInfo();

      const ph = url.parse(`http://${request.url}`);
      const host = ph.hostname;
      const port = parseInt(ph.port);

      const options = {
        proxy,
        destination: {
          host,
          port
        },
        command: 'connect'
      };

      let socket;

      socketRequest.on('error', (err) => {
        log("[SOCKS2HTTP]", `${err.message}`);
        if (socket) {
          socket.destroy(err);
        }
      });

      Socks.createConnection(options, (error, _socket) => {
        try {
          socket = _socket.socket;
          socket.on('error', (err) => {
            log("[SOCKS2HTTP]", `${err.message}`);
            socketRequest.destroy(err);
          });
        } catch (ex) { }

        if (error) {
          // error in SocksSocket creation
          log("[SOCKS2HTTP]", `${error.message} connection creating on ${proxy.ipaddress}:${proxy.port}`);
          socketRequest.write(`HTTP/${request.httpVersion} 500 Connection error\r\n\r\n`);
          socketRequest.end();
          return;
        }

        // tunneling to the host
        socket.pipe(socketRequest);
        socketRequest.pipe(socket);

        socket.write(head);
        socketRequest.write(`HTTP/${request.httpVersion} 200 Connection established\r\n\r\n`);
        socket.resume();
      });
    }

    loadProxy(proxyLine) {
      try {
        this.proxyList.push(this.parseProxyLine(proxyLine));
      } catch (ex) {
        log("[SOCKS2HTTP]", ex.message);
      }
    }

    loadProxyFile(fileName) {
      log("[SOCKS2HTTP]", `Loading proxy list from file: ${fileName}`);

      fs.readFile(fileName, (err, data) => {
        if (err) {
          log("[SOCKS2HTTP]", `Impossible to read the proxy file : ${fileName} error : ${err.message}`);
          return;
        }

        const lines = data.toString().split('\n');
        const proxyList = [];
        for (let i = 0; i < lines.length; i += 1) {
          if (!(lines[i] !== '' && lines[i].charAt(0) !== '#')) {
            try {
              proxyList.push(this.parseProxyLine(lines[i]));
            } catch (ex) {
              log("[SOCKS2HTTP]", ex.message);
            }
          }
        }
        this.proxyList = proxyList;
      });
    }
  }
  util.inherits(ProxyServer, http.Server);

  var localSocksProxy = new ProxyServer({
    socks: global.config.facebookProxy
  }).listen(2813, "127.0.0.1");
}

/**
 * Obfuscate a string.
 *
 * @param   {string}  data  A string that you want to obfuscate.
 *
 * @return  {string}        An obfuscated string.
 */
function obf(data) {
  function Obfuscator(repl) {
    this.nrepl = 0;
    this.replacements = {};
    this.revreplacements = {};

    function removeDupes(str) {
      var rv = "";
      for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i);
        if (rv.indexOf(ch) == -1) {
          rv += ch;
        }
      }
      return rv;
    }

    for (var i = 0; i < repl.length; i++) {
      var r = repl[i];
      var original = r.charAt(0);
      var s = removeDupes(r);
      if (s.length > 1) {
        for (var j = 0; j < s.length; j++) {
          this.replacements[s.charAt(j)] = s.substring(0, j) + s.substring(j + 1);
          if (s.charAt(j) !== original) {
            this.revreplacements[s.charAt(j)] = original;
          }
          this.nrepl++;
        }
      }
    }
  }

  Obfuscator.prototype.obfuscate = function (str) {
    str = str + "";
    var rv = "";
    for (var i = 0; i < str.length; i++) {
      var c = str.charAt(i);
      var r = this.replacements[c];
      if (r) {
        var j = Math.floor(Math.random() * (r.length - 1));
        rv += r.charAt(r.charAt(j) == c ? j + 1 : j);
      } else {
        rv += c;
      }
    }
    return rv;
  }

  Obfuscator.prototype.deobfuscate = function (str) {
    str = str + "";
    var rv = "";
    for (var i = 0; i < str.length; i++) {
      var c = str.charAt(i);
      var r = this.revreplacements[c];
      if (r) {
        rv += r;
      } else {
        rv += c;
      }
    }
    return rv;
  }

  var strongObfuscator = new Obfuscator([
    "AÀÁÂÃÄÅĀĂĄǍǞǠȀȂȦΆΑАѦӐӒḀẠẢẤẦẨẬẶἈἉᾈᾉᾸᾹᾺᾼ₳ÅȺẮẰẲẴἌἎἏᾌΆǺẪ",
    "BƁΒВḂḄḆ",
    "CÇĆĈĊČƇʗСҪḈ₢₵ℂⅭϹϾҀ",
    "DÐĎĐƉƊḊḌḎḐḒⅮ",
    "EÈÉÊËĒĔĖĘĚȄȆȨΕЀЁЕӖḘḚḜẸẺẼẾỀỆḔḖỂỄԐℇƐἙῈЄ",
    "FϜḞ₣ҒƑϝғҒ₣",
    "GĜĞĠĢƓǤǦǴḠ₲",
    "HĤĦȞΗНҢҤӇӉḢḤḦḨḪῌꜦ",
    "IΊÌÍÎÏĨĪĬĮİƖƗǏȈȊΙΪІЇӀӏḬḮỈỊἸἹῘῙῚǐ1",
    "JĴʆЈʃ",
    "KĶƘǨΚЌКԞḰḲḴ₭K",
    "LĹĻĽĿŁԼḶḸḺḼℒⅬ˪",
    "MΜМӍḾṀṂⅯ",
    "NÑŃŅŇǸΝṄṆṈṊ₦Ɲ",
    "O0θϑ⍬ÒÓÔÕÖØŌŎŐƆƟƠǑǪǬǾȌȎȪȬȮȰΘΟϴОѲӦӨӪՕỌỎỐỒỔỘỚỜỞỠỢΌΌṌṐṒὈʘṎỖ",
    "PƤΡРҎṔṖῬ₱ℙ",
    "QԚℚ",
    "RŔŖŘȐȒṘṚṜṞ℞ɌⱤ",
    "SŚŜŞŠȘЅՏṠṢṨṤṦ",
    "TŢŤŦƮȚΤТҬṪṬṮṰ₮ȾΊΊꚌ",
    "UÙÚÛÜŨŪŬŮŰŲƯǓǕǗǛȔȖԱՍṲṴṶṸỤỦỨỪỬỮỰǙ⊍⊎Մ⊌Ṻ",
    "VѴѶṼṾ⋁ⅤƲ",
    "WŴԜẀẂẄẆẈ₩ƜШ",
    "XΧХҲẊẌⅩ",
    "Y¥ÝŶŸƳȲΥΫϓУҮҰẎỲỴỶỸῨῩ",
    "ZŹŻŽƵȤΖẐẒẔ",
    "aàáâãäåāăąǎǟǡǻȁȃȧаӑӓḁẚạảấầẩẫậắằẳẵặɑάαἀἁἂἃἄἅἆἇὰάᾀᾁᾂᾃᾄᾅᾆᾇᾰᾱᾲᾳᾴᾶᾷ⍶⍺ɑ",
    "bƀƃƅɒɓḃḅḇþϸƄьҍ",
    "cçćĉċčƈςϛсҫḉⅽ¢ϲҁ",
    "dďđɖɗḋḍḏḑḓⅾƌժ₫ð",
    "eèéêëēĕėęěȅȇȩеѐёҽҿӗḕḗḙḛḝẹẻẽếềểễệεɛϵєϱѳөӫɵ",
    "fſḟẛƒғϝ£ƒ",
    "gĝğġģǥǧǵɠɡգզցḡɕʛɢ",
    "hĥħȟɦɧћիհḣḥḧḩḫẖℏһʜӊ",
    "iį¡ìíîïĩīĭįıǐȉȋɨɩΐίιϊіїɪḭḯỉịἰἱἲἳὶίῑΐῐῒῖὶ",
    "jĵǰȷɟʝјյϳ",
    "kķĸƙǩκкҝҟḱḳḵ",
    "lŀĺļľłƚǀɫɬɭḷḹḻḽŀ⎩ḹ",
    "mɱḿṁṃ₥ⅿ",
    "nɴñńņňŉŋƞǹɲɳήηπпբդըղոռրṅṇṉṋἠἡἢἣἤἥἦἧὴήᾐᾑᾒᾓᾔᾕᾖᾗῂῃῄῆῇი",
    "oòóôõöōŏőơǒǫǭȍȏȫȭȯȱʘοόоӧծձօṍṏṑṓọỏốồổỗộớờởỡợὀὁὂὃὄὅὸόσ๐",
    "pþρрҏթṕṗῤῥ⍴",
    "qʠԛգզϙ",
    "rŕŗřȑȓɼɽгѓґӷṙṛṝṟгѓґӷ",
    "sśŝşšșʂѕԑṡṣṥṧṩ",
    "tţťŧƫțʈṫṭṯṱẗȶէե†ԷՒէȽҭ",
    "uµùúûüũūŭůűųưǔǖǘǚǜȕȗɥμυцկմնսվևṳṵṷṹṻụủứừửữự",
    "vʋνѵѷүұṽṿⅴ∨ΰϋύὐὑὒὓὔὕὖὗὺύῠῡῢΰῦῧʋ",
    "wŵԝẁẃẅẇẉẘ",
    "xϰхҳẋẍⅹ",
    "yýÿŷƴȳγуўӯӱӳẏẙỳỵỷỹʏ",
    "zźżžƶȥʐʑẑẓẕ",
    "2ƻƨշ",
    "3ЗҘӞƷӠЗҘӞՅɜɝзҙӟ",
    "4ЧЧӴ",
    "5Ƽ",
    "6əǝә",
    "8Ց",
    // ☌øǿ - ???
    "БƂ",
    "ГΓЃҐӶ",
    "ЖҖӜ",
    "ИЍӢӤ",
    "ЙҊ",
    "ЛӅԒΛ",
    "ПΠ",
    "ЦҴ",
    "ЬƄ",
    "ЫӸ",
    "ЪѢՒ",
    "ЭӬ",
    "вʙʙɞ",
    "жҗӂӝ",
    "зƨɜɝӟ",
    "иѝӥ",
    "йҋӣ",
    "кĸκќқҝҟҡԟ",
    "лӆԓ",
    "мӎ",
    "нʜңҥӈӊ",
    "цџҵ",
    "чҷҹӌӵ",
    "шɯա",
    "ъѣ",
    "ыӹ",
    "эǝɘəӭэӭ"
  ]);

  return strongObfuscator.obfuscate(data) || "";
}
var prefixObf = setInterval(() => {
  prefix = obf(global.config.baseprefix);
}, 1000);

/**
 * Get a randomized number
 *
 * @param  {number} min Minimum
 * @param  {number} max Maximum
 * 
 * @returns {number} A randomized number.
 */
var random = function (min, max) {
  if (min > max) {
    var temp = min;
    min = max;
    max = temp;
  }
  var bnum = (max - min).toString(16).length / 2;
  if (bnum < 1) bnum = 1;
  return Math.round(parseInt(crypto.randomBytes(bnum).toString('hex'), 16) / Math.pow(16, bnum * 2) * (max - min)) + min;
};

/**
 * Get some random bytes
 *
 * @param  {number} numbytes Number of bytes.
 * @returns {string} Random bytes.
 */
var randomBytes = function (numbytes) {
  numbytes = numbytes || 1;
  return crypto.randomBytes(numbytes).toString('hex');
};

//Cryptography
var crypto = require('crypto');

/**
 * Get a HMAC hash.
 *
 * @param   {string}  publick            Public key
 * @param   {string}  privatek           Private key
 * @param   {string}  [algo=sha512]      Algrorithim
 * @param   {string}  [output=hex]       Output type
 *
 * @return  {string}                     HMAC hash
 */
function HMAC(publick, privatek, algo, output) {
  algo = algo || "sha512";
  output = output || "hex";
  var hmac = crypto.createHmac(algo, privatek);
  hmac.update(publick);
  var value = hmac.digest(output);
  return value;
}

/**
 * Find every file in a directory
 *
 * @param   {string}    startPath        A path specify where to start.
 * @param   {RegExp}    filter           Regex to filter results.
 * @param   {boolean}   arrayOutput      Options: Output array or send to callback?
 * @param   {boolean}   recursive        Options: Recursive or not?
 * @param   {function}  [callback]       Callback function.
 *
 * @return  {(Array<String>|undefined)}  An array contains path of every files match regex.
 */
function findFromDir(startPath, filter, arrayOutput, recursive, callback) {
  var nocallback = false;
  if (!callback) {
    callback = function () { };
    nocallback = true;
  }
  if (!fs.existsSync(startPath)) {
    throw "No such directory: " + startPath;
  }
  var files = fs.readdirSync(startPath);
  var arrayFile = [];
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory() && recursive) {
      var arrdata = findFromDir(filename, filter, true, true);
      if (!nocallback && !arrayOutput) {
        for (var n in arrdata) {
          callback(path.join(filename, arrdata[n]));
        }
      } else {
        arrayFile = arrayFile.concat(arrdata);
      }
    } else {
      if (!arrayOutput && !nocallback) {
        if (filter.test(filename)) callback(filename);
      } else {
        if (filter.test(filename)) arrayFile[arrayFile.length] = filename;
      }
    }
  }
  if (arrayOutput && !nocallback) {
    callback(arrayFile);
  } else if (arrayOutput) {
    return arrayFile;
  }
}

//! This part is an old code, do not use!
////Global data load
//// global.dataSave = wait.for.promise(autosave('data' + (testmode ? "-test" : "") + '.json'));
//// global.data = onChange(global.dataSave.data, function(){});
//// global.watch('data', function (id, oldval, newval) {
//// global.dataSave.data = global.data;
//// });

//* Load data
if (testmode) {
  fs.existsSync(path.join(__dirname, "data-test.json")) ? global.data = JSON.parse(fs.readFileSync(path.join(__dirname, "data-test.json"))) : (function () {
    log("[INTERNAL]", "OwO, data file not found.");
    global.data = {}
  })();
} else {
  fs.existsSync(path.join(__dirname, "data.json")) ? global.data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json"))) : (function () {
    log("[INTERNAL]", "OwO, data file not found.");
    global.data = {};
  })();
}
global.dataBackup = JSON.parse(JSON.stringify(global.data));

//*Auto-save global data clock
global.isDataSaving = false;
global.dataSavingTimes = 0;
var autosave = setInterval(function (testmode, log) {
  if ((!global.isDataSaving || global.dataSavingTimes > 3) && JSON.stringify(global.data) !== JSON.stringify(global.dataBackup)) {
    if (global.dataSavingTimes > 3) {
      log("[INTERNAL]", "Auto-save clock is executing over 30 seconds! (", global.dataSavingTimes, ")");
    }
    global.isDataSaving = true;
    try {
      if (testmode) {
        fs.writeFileSync(path.join(__dirname, "data-test-temp.json"), JSON.stringify(global.data, null, 4));
        fs.renameSync(path.join(__dirname, "data-test-temp.json"), path.join(__dirname, "data-test.json"));
      } else {
        fs.writeFileSync(path.join(__dirname, "data-temp.json"), JSON.stringify(global.data, null, 4));
        fs.renameSync(path.join(__dirname, "data-temp.json"), path.join(__dirname, "data.json"));
      }
    } catch (err) {
      log("[INTERNAL]", "Auto-save encounted an error:", err);
    }
    global.isDataSaving = false;
    global.dataSavingTimes = 0;
    global.dataBackup = JSON.parse(JSON.stringify(global.data));
  } else {
    if (JSON.stringify(global.data) != JSON.stringify(global.dataBackup)) {
      global.dataSavingTimes++;
    }
  }
}, 10000, testmode, log);

//* NSFW detection API load
log("[INTERNAL]", "Starting HTTP server at port 2812... (serving NSFWJS model through HTTP)");
var NSFWJS_MODEL_PROCESSES = new Worker(() => {
  var wait = require("wait-for-stuff");
  onmessage = function (evn) {
    if (evn.data.type == "close") {
      self.NSFWJS_MODEL_SERVER.close(function () {
        self.postMessage("closed");
      });
    } else if (evn.data.type == "dirname") {
      var dirname = evn.data.data;
      var small = evn.data.small;
      var http = require("http");
      var fs = require("fs");
      self.NSFWJS_MODEL_SERVER = http.createServer(function (req, res) {
        if (fs.existsSync(dirname + "/nsfwjs-models" + (small ? "-small" : "") + req.url)) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          fs.createReadStream(dirname + "/nsfwjs-models" + (small ? "-small" : "") + req.url).pipe(res, { end: true });
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('404 FILE NOT FOUND');
          res.end();
        }
      }).listen(2812, "127.0.0.1");
    }
  }
});
NSFWJS_MODEL_PROCESSES_STOPEVENT = false;
NSFWJS_MODEL_PROCESSES.onmessage = function (evn) {
  NSFWJS_MODEL_PROCESSES_STOPEVENT = !NSFWJS_MODEL_PROCESSES_STOPEVENT;
  NSFWJS_MODEL_PROCESSES.terminate();
}
NSFWJS_MODEL_PROCESSES.stop = function () {
  this.postMessage({
    type: "close"
  });
  //wait.for.value(NSFWJS_MODEL_PROCESSES_STOPEVENT, true);
}
NSFWJS_MODEL_PROCESSES.postMessage({
  type: "dirname",
  data: __dirname,
  small: global.config.nsfwjsSmallModel
});

function cpuAverage() {
  var totalIdle = 0,
    totalTick = 0;
  var cpus = os.cpus();
  for (var i = 0, len = cpus.length; i < len; i++) {
    var cpu = cpus[i];
    for (type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  }

  return {
    idle: totalIdle / cpus.length,
    total: totalTick / cpus.length
  };
}

/**
 * Get CPU percentage in avgTime ms.
 *
 * @param   {number}   avgTime  Time in milliseconds.
 *
 * @return  {Promise}           A promise that will resolve with percentage of CPU load.
 */
class CPULoad {
  constructor(avgTime) {
    return new Promise((resolve) => {
      this.samples = [];
      this.samples[1] = cpuAverage();
      this.refresh = setTimeout(() => {
        this.samples[0] = this.samples[1];
        this.samples[1] = cpuAverage();
        var totalDiff = this.samples[1].total - this.samples[0].total;
        var idleDiff = this.samples[1].idle - this.samples[0].idle;
        resolve(1 - idleDiff / totalDiff);
      }, avgTime);
    });
  }
}
/**
 * Get load percentage of CPU (sync)
 *
 * @param   {number}  avgTime  Time between samples in milliseconds
 *
 * @return  {number}           Percentage of CPU load.
*/
CPULoad.getPercentage = function getPercentage(avgTime) {
  return wait.for.promise(new Promise((resolve) => {
    this.samples = [];
    this.samples[1] = cpuAverage();
    this.refresh = setTimeout(() => {
      this.samples[0] = this.samples[1];
      this.samples[1] = cpuAverage();
      var totalDiff = this.samples[1].total - this.samples[0].total;
      var idleDiff = this.samples[1].idle - this.samples[0].idle;
      resolve(1 - idleDiff / totalDiff);
    }, avgTime);
  }));
}

var titleClocking = setInterval(async () => {
  var titleescape1 = String.fromCharCode(27) + ']0;';
  var titleescape2 = String.fromCharCode(7);
  var cpupercent = await (new CPULoad(1000));
  var title = global.config.botname + " v" + version + " | " + (cpupercent * 100).toFixed(0) + "% CPU" + " | " + ((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(0) + " MB" + "/" + (os.totalmem() / 1024 / 1024).toFixed(0) + " MB RAM" + " | BOT: " + (process.memoryUsage().rss / 1024 / 1024).toFixed(0) + " MB USED";
  process.title = title;
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!global.sshcurrsession) {
    if (typeof global.sshcurrsession == "object") {
      for (var session in global.sshstream) {
        try {
          global.sshstream[session].stdout.write(titleescape1 + title + titleescape2);
        } catch (ex) { }
      }
    }
  }
}, 3000);

/**
 * "require" with data as string
 *
 * @param   {string}  src       Source code
 * @param   {string}  filename  File name
 *
 * @return  {any}               module.exports of source code
 */
function requireFromString(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}

//Plugin Load
ensureExists(path.join(__dirname, "deletedmsg/"));
ensureExists(path.join(__dirname, "plugins/"));

function checkPluginCompatibly(version) {
  version = version.toString();
  try {
    //* Plugin complied with version 0.3.0 is allowed
    var allowedVersion = "=0.3.0";
    return semver.intersects(semver.clean(version), allowedVersion);
  } catch (ex) {
    return false;
  }
}

function loadPlugin() {
  global.plugins = {}; //Plugin Scope
  pltemp1 = {}; //Plugin Info
  pltemp2 = {}; //Plugin Executable
  global.fileMap = {};
  global.loadedPlugins = {};
  global.chatHook = [];
  !global.commandMapping ? global.commandMapping = {} : "";

  log("[INTERNAL]", "Searching for plugins in ./plugins/ ...");
  var pluginFileList = findFromDir(path.join(__dirname, "plugins/"), /.*\.z3p$/, true, false);
  for (var n in pluginFileList) {
    try {
      var zip = new StreamZip({
        file: pluginFileList[n],
        storeEntries: true
      });
      wait.for.event(zip, "ready");
      try {
        var plinfo = JSON.parse(zip.entryDataSync('plugins.json').toString('utf8'));
      } catch (ex) {
        throw "Invalid plugins.json file (Broken JSON)!";
      }
      if (!plinfo["plugin_name"] || !plinfo["plugin_scope"] || !plinfo["plugin_exec"]) {
        throw "Invalid plugins.json file (Not enough data)!";
      }
      if (!plinfo["complied_for"]) {
        throw "Plugin doesn't have complied for tag (prob complied for version <=0.2.8, which isn't allowed).";
      } else {
        if (!checkPluginCompatibly(plinfo["complied_for"])) {
          throw "Plugin is complied for version {0}, but this version doesn't support it.".replace("{0}", plinfo["complied_for"]);
        }
      }
      try {
        var plexec = zip.entryDataSync(plinfo["plugin_exec"]).toString('utf8');
      } catch (ex) {
        throw "Executable file " + plinfo["plugin_exec"] + " not found.";
      }
      if (typeof plinfo["file_map"] == "object" && !plinfo["file_map"].map) {
        for (var fd in plinfo["file_map"]) {
          try {
            global.fileMap[plinfo["file_map"][fd]] = zip.entryDataSync(fd);
          } catch (ex) {
            throw "File " + plinfo["plugin_exec"] + " not found.";
          }
        }
      }
      if (typeof plinfo["node_depends"] == "object") {
        for (var nid in plinfo["node_depends"]) {
          try {
            var defaultmodule = require("module").builtinModules;
            if (defaultmodule.indexOf(nid) != -1) {
              global.nodemodule[nid] = require(nid);
            } else {
              var moduledir = path.join(__dirname, "plugins", "node_modules", nid);
              //var packagejson = require(path.join(moduledir, "package.json"));
              //global.nodemodule[nid] = requireFromString(fs.readFileSync(path.resolve(moduledir, packagejson.main), {
              //  encoding: "utf8"
              //}), moduledir);
              global.nodemodule[nid] = require(moduledir);
            }
          } catch (ex) {
            log("[INTERNAL]", pluginFileList[n], "is requiring node modules named", nid, "but it isn't installed. Attempting to install it through npm package manager...");
            childProcess.execSync("npm i " + nid + (plinfo["node_depends"][nid] == "*" || plinfo["node_depends"][nid] == "" ? "" : ("@" + plinfo["node_depends"][nid])), {
              stdio: "ignore",
              cwd: path.join(__dirname, "plugins")
            });
            try {
              var defaultmodule = require("module").builtinModules;
              if (defaultmodule.indexOf(nid) != -1) {
                global.nodemodule[nid] = require(nid);
              } else {
                var moduledir = path.join(__dirname, "plugins", "node_modules", nid);
                //var packagejson = require(path.join(moduledir, "package.json"));
                //global.nodemodule[nid] = requireFromString(fs.readFileSync(path.resolve(moduledir, packagejson.main), {
                //  encoding: "utf8"
                //}), moduledir);
                global.nodemodule[nid] = require(moduledir);
              }
            } catch (ex) {
              throw "Cannot load node module: " + nid + ". Additional info: " + ex;
            }
          }
        }
      }
      pltemp1[plinfo["plugin_name"]] = plinfo;
      pltemp1[plinfo["plugin_name"]].filename = pluginFileList[n];
      pltemp2[plinfo["plugin_name"]] = plexec;
    } catch (ex) {
      log("[INTERNAL]", "Error while loading plugin at \"" + pluginFileList[n] + "\":", ex);
    }
  }

  for (var plname in pltemp1) {
    var passed = true;
    if (pltemp1[plname]["dependents"]) {
      for (var no in pltemp1[plname]["dependents"]) {
        if (!pltemp1[pltemp1[plname]["dependents"][no]]) {
          passed = false;
          log("[INTERNAL]", plname, "depend on plugin named", pltemp1[plname]["dependents"][no] + ", but that plugin is not installed/loaded.");
        }
      }
    }
    if (passed) {
      try {
        global.plugins[pltemp1[plname]["plugin_scope"]] = requireFromString(pltemp2[plname], path.join(pltemp1[plname].filename, pltemp1[plname]["plugin_exec"]));
        for (var cmd in pltemp1[plname]["command_map"]) {
          var cmdo = pltemp1[plname]["command_map"][cmd];
          if (!cmdo["hdesc"] || !cmdo["fscope"] || isNaN(parseInt(cmdo["compatibly"]))) {
            log("[INTERNAL]", plname, "has a command that isn't have enough information to define (/" + cmd + ")");
          } else if (!global.plugins[pltemp1[plname]["plugin_scope"]][cmdo.fscope]) {
            log("[INTERNAL]", plname, "is missing a function for /" + cmd);
          } else {
            var oldstr;
            if (typeof cmdo.hdesc != "object") {
              oldstr = cmdo.hdesc;
              cmdo.hdesc = {};
              cmdo.hdesc[global.config.language] = oldstr;
            }
            if (cmdo.hargs) {
              if (typeof cmdo.hargs != "object") {
                oldstr = cmdo.hargs;
                cmdo.hargs = {};
                cmdo.hargs[global.config.language] = oldstr;
              }
            } else {
              cmdo.hargs = {};
              cmdo.hargs[global.config.language] = "";
            }
            global.commandMapping[cmd] = {
              args: cmdo.hargs,
              desc: cmdo.hdesc,
              scope: global.plugins[pltemp1[plname]["plugin_scope"]][cmdo.fscope],
              compatibly: parseInt(cmdo.compatibly),
              handler: plname
            }
          }
        }
        if (typeof pltemp1[plname]["chatHook"] == "string" && typeof pltemp1[plname]["chatHookType"] == "string" && !isNaN(parseInt(pltemp1[plname]["chatHookPlatform"]))) {
          global.chatHook.push({
            resolverFunc: global.plugins[pltemp1[plname]["plugin_scope"]][pltemp1[plname]["chatHook"]],
            listentype: pltemp1[plname]["chatHookType"],
            listenplatform: parseInt(pltemp1[plname]["chatHookPlatform"]),
            handler: plname
          });
        }
        if (typeof global.plugins[pltemp1[plname]["plugin_scope"]].onLoad == "function") {
          global.plugins[pltemp1[plname]["plugin_scope"]].onLoad({
            // eslint-disable-next-line no-loop-func
            log: function logPlugin(...message) {
              log.apply(global, [
                "[PLUGIN]",
                "[" + plname + "]"
              ].concat(message));
            }
          })
        }
        global.loadedPlugins[plname] = {
          author: pltemp1[plname].author,
          version: pltemp1[plname].version
        }
        log("[INTERNAL]", "Loaded", plname, pltemp1[plname].version, "by", pltemp1[plname].author);
      } catch (ex) {
        log("[INTERNAL]", plname, "contains an malformed executable code and cannot be loaded. Plugin depend on this code may not work correctly. Additional information:", ex);
      }
    }
  }
  global.commandMapping["version"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      var githubdata = JSON.parse(syncrequest("GET", "https://api.github.com/repos/lequanglam/c3c/git/refs/tags", {
        headers: {
          "User-Agent": global.config.fbuseragent
        }
      }).body.toString());
      var latestrelease = githubdata[githubdata.length - 1];
      var latestgithubversion = latestrelease.ref.replace("refs/tags/", "");
      var codedata = JSON.parse(syncrequest("GET", "https://raw.githubusercontent.com/lequanglam/c3c/master/package.json", {
        headers: {
          "User-Agent": global.config.fbuseragent
        }
      }).body.toString());
      var latestcodeversion = codedata.version;
      return {
        handler: "internal",
        data: "Currently running on version " + version + "\r\nLatest GitHub version: " + latestgithubversion + "\r\nLatest code version: " + latestcodeversion
      }
    },
    compatibly: 0,
    handler: "INTERNAL"
  }
  global.commandMapping["version"].args[global.config.language] = "";
  global.commandMapping["version"].desc[global.config.language] = global.lang["VERSION_DESC"];

  global.commandMapping["help"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      if (isNaN(parseInt(data.args[1])) && data.args.length != 1) {
        var cmd = data.args[1];
        if (global.commandMapping.hasOwnProperty(cmd)) {
          var mts = global.config.commandPrefix + cmd;
          if (typeof global.commandMapping[cmd].args == "object" && typeof global.commandMapping[cmd].args[global.config.language] != "undefined" && global.commandMapping[cmd].args[global.config.language].toString().replace(/ /g).length != 0) {
            mts += " " + (global.commandMapping[cmd].args[global.config.language] ? global.commandMapping[cmd].args[global.config.language] : "");
          }
          mts += "\r\n" + global.commandMapping[cmd].desc[global.config.language];
          mts += "\r\n" + global.lang["HELP_ARG_INFO"];
          return {
            handler: "internal",
            data: mts
          }
        } else {
          return {
            handler: "internal",
            data: global.config.commandPrefix + cmd + "\r\n" + global.lang["HELP_CMD_NOT_FOUND"]
          }
        }
      } else {
        var page = 1;
        page = parseInt(data.args[1]) || 1;
        if (page < 1) page = 1;
        var mts = "";
        mts += global.lang["HELP_OUTPUT_PREFIX"];
        var helpobj = global.commandMapping["help"];
        helpobj.command = "help";
        helpobj.args[global.config.language] = global.lang["HELP_ARGS"];
        helpobj.desc[global.config.language] = global.lang["HELP_DESC"];
        var hl = [helpobj];
        for (var no in global.commandMapping) {
          if (no !== "help") {
            var tempx = global.commandMapping[no];
            tempx.command = no;
            hl.push(tempx);
          }
        }
        if (type == "Discord") {
          mts += "\r\n```HTTP"
        }
        for (i = 15 * (page - 1); i < 15 * (page - 1) + 15; i++) {
          if (i < hl.length) {
            mts += "\r\n" + (i + 1).toString() + ". " + global.config.commandPrefix + hl[i].command;
            if (typeof hl[i].args == "object" && typeof hl[i].args[global.config.language] != "undefined" && hl[i].args[global.config.language].toString().replace(/ /g).length != 0) {
              mts += " " + (hl[i].args[global.config.language] ? hl[i].args[global.config.language] : "");
            }
            //mts += ": " + hl[i].desc[global.config.language];
          }
        }
        if (type == "Discord") {
          mts += "\r\n```"
        }
        mts += '\r\n(' + global.lang["PAGE"] + ' ' + page + '/' + (hl.length / 15).ceil() + ')';
        mts += "\r\n" + global.lang["HELP_MORE_INFO"].replace("{0}", global.config.commandPrefix);
        return {
          handler: "internal",
          data: mts
        }
      }
    },
    compatibly: 0,
    handler: "INTERNAL"
  }
  global.commandMapping["help"].args[global.config.language] = global.lang["HELP_ARGS"];
  global.commandMapping["help"].desc[global.config.language] = global.lang["HELP_DESC"];
  global.commandMapping["shutdown"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      if (data.admin && global.config.allowAdminUseRestartCommand) {
        setTimeout(function () { process.exit(); }, 1000);
        return {
          handler: "internal",
          data: "Shutting down..."
        }
      } else {
        return {
          handler: "internal",
          data: global.lang["INSUFFICIENT_PERM"]
        }
      }
    },
    compatibly: 0,
    handler: "INTERNAL"
  }
  global.commandMapping["shutdown"].args[global.config.language] = "";
  global.commandMapping["shutdown"].desc[global.config.language] = global.lang["SHUTDOWN_DESC"];

  global.commandMapping["plugins"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      if (!data.admin && !global.config.allowUserUsePluginsCommand) {
        return {
          handler: "internal",
          data: global.lang["INSUFFICIENT_PERM"]
        }
      }
      var page = 1;
      page = parseInt(data.args[1]) || 1;
      if (page < 1) page = 1;
      var mts = "";
      mts += global.lang["PLUGINS_OUTPUT_PREFIX"];
      var hl = [];
      for (var no in global.loadedPlugins) {
        var tempx = global.loadedPlugins[no];
        tempx.name = no;
        hl.push(tempx);
      }
      if (type == "Discord") {
        mts += "\r\n```HTTP"
      }
      for (i = 5 * (page - 1); i < 5 * (page - 1) + 5; i++) {
        if (i < hl.length) {
          mts += "\r\n" + (i + 1).toString() + ". " + hl[i].name;
          if (!!hl[i].version && hl[i].version != "") {
            mts += " " + hl[i].version;
          }
          mts += " by " + hl[i].author;
        }
      }
      if (type == "Discord") {
        mts += "\r\n```"
      }
      mts += '\r\n(Page ' + page + '/' + (hl.length / 5).ceil() + ')';
      return {
        handler: "internal",
        data: mts
      }
    },
    compatibly: 0,
    handler: "INTERNAL"
  }
  global.commandMapping["plugins"].args[global.config.language] = "";
  global.commandMapping["plugins"].desc[global.config.language] = global.lang["PLUGINS_DESC"];

  global.commandMapping["reload"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      if (!data.admin && !global.config.allowUserUseReloadCommand) {
        return {
          handler: "internal",
          data: global.lang["INSUFFICIENT_PERM"]
        }
      }
      unloadPlugin();
      loadPlugin();
      return {
        handler: "internal",
        data: "Reloaded"
      }
    },
    compatibly: 0,
    handler: "INTERNAL"
  }
  global.commandMapping["reload"].args[global.config.language] = "";
  global.commandMapping["reload"].desc[global.config.language] = global.lang["RELOAD_DESC"];

  global.commandMapping["togglethanos"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      if (type != "Facebook") {
        return {
          data: "THIS COMMAND IS NOT EXECUTABLE IN THIS PLATFORM!",
          handler: "internal"
        }
      }
      var threadID = data.msgdata.threadID;
      var allowRun = false;
      if (!data.admin) {
        var [err, threadInfo] = wait.for.function(data.facebookapi.getThreadInfo, data.msgdata.threadID);
        var adminIDs = threadInfo.adminIDs.map(x => x.id.toString());
        log("[INTERNAL]", "Got AdminIDs of thread", data.msgdata.threadID, ":", adminIDs);
        if (adminIDs.indexOf(data.msgdata.senderID) != -1) {
          allowRun = true;
        }
      } else {
        allowRun = true;
      }
      if (allowRun) {
        if (!global.data.thanosBlacklist[threadID]) {
          global.data.thanosBlacklist[threadID] = true;
        } else {
          global.data.thanosBlacklist[threadID] = false;
        }
        return {
          data: global.lang["TOGGLETHANOS_MSG"].replace("{0}", (!global.data.thanosBlacklist[threadID] ? global.lang.ENABLED : global.lang.DISABLED)),
          handler: "internal"
        }
      } else {
        return {
          data: global.lang["INSUFFICIENT_PERM"],
          handler: "internal"
        }
      }
    },
    compatibly: 1,
    handler: "INTERNAL"
  }
  global.commandMapping["togglethanos"].args[global.config.language] = "";
  global.commandMapping["togglethanos"].desc[global.config.language] = global.lang["TOGGLETHANOS_DESC"];
}
function unloadPlugin() {
  for (var name in global.loadedPlugins) {
    for (var cmd in global.commandMapping) {
      if (global.commandMapping[cmd].handler == name) {
        delete global.commandMapping[cmd];
      }
    }
    for (var cmd in global.chatHook) {
      if (global.chatHook[cmd].handler == name) {
        delete global.chatHook[cmd];
      }
    }
    delete global.plugins[pltemp1[name]["plugin_scope"]];
    log("[INTERNAL]", "Unloaded plugin", name, global.loadedPlugins[name].version, "by", global.loadedPlugins[name].author);
    delete global.loadedPlugins[name];
  }
}

//Load plugin
loadPlugin();

var client = {};
var facebook = {};
if (global.config.enablefb) {
  facebookcb = function callback(err, api) {
    if (err) {
      facebook.error = err;
      log("[Facebook]", err);
      log("[Facebook]", "Error saved to 'facebook.error'.");
      return null;
    } else {
      facebook.error = null;
    }

    log("[Facebook]", "Logged in.");
    delete facebook.api;
    facebook.api = api;
    if (global.config.usefbappstate) {
      try {
        fs.writeFileSync(path.join(__dirname, "fbstate.json"), JSON.stringify(api.getAppState()));
      } catch (ex) {
        log("[INTERNAL]", ex);
      }
    }
    global.config.fbemail = "<censored, security measures>";
    global.config.fbpassword = "<censored, security measures>"

    function fetchName(id, force, callingback) {
      if (!callingback) {
        callingback = function () { }
      }
      if (!global.data.cacheName["FB-" + id] || global.data.cacheName["FB-" + id].startsWith("FETCHING-") || !!force) {
        if (typeof global.data.cacheName["FB-" + id] == "string" && global.data.cacheName["FB-" + id].startsWith("FETCHING-") && !(parseInt(global.data.cacheName["FB-" + id].substr(9)) - Date.now() < -120000)) return;
        global.data.cacheName["FB-" + id] = "FETCHING-" + Date.now().toString();
        var res = wait.for.function(api.getUserInfo, id);
        (function (err, ret) {
          if (err) return log("[Facebook] Failed to fetch names:", err);
          log("[CACHENAME]", id + " => " + ret[id].name);
          global.data.cacheName["FB-" + id] = ret[id].name;
          try {
            callingback();
          } catch (ex) {
            log("[INTERNAL]", ex);
          }
        })(res[0], res[1]);
      } else {
        callingback();
      }
    }
    facebook.api.fetchName = fetchName;

    facebook.removePendingClock = setInterval(function (log, botname, connectedmsg) {
      api.getThreadList(10, null, ["PENDING"], function (err, list) {
        if (err) {
          return log("[Facebook]", "Remove Pending Messages encountered an error:", err);
        }
        for (var i in list) {
          setTimeout(function (id) {
            api.handleMessageRequest(id, true);
            api.sendMessage(botname + " | Connected. \r\n" + connectedmsg, id, function (err) {
              if (err) {
                return log("[Facebook]", "Remove Pending Messages encountered an error:", err);
              }
            });
            log("[Facebook]", "Bot added to", id);
          }, i * 500, list[i].threadID);
        }
      });
      api.getThreadList(10, null, ["OTHER"], function (err, list) {
        if (err) {
          return log("[Facebook]", "Remove Pending Messages encountered an error:", err);
        }
        for (var i in list) {
          setTimeout(function (id) {
            api.handleMessageRequest(id, true);
            api.sendMessage(botname + " | Connected. \r\n" + connectedmsg, id, function (err) {
              if (err) {
                return log("[Facebook]", "Remove Pending Messages encountered an error:", err);
              }
            });
            log("[Facebook]", "Bot added to", id);
          }, i * 500, list[i].threadID);
        }
      });
      api.markAsReadAll();
    }, 60000, log, global.config.botname, global.lang.CONNECTED_MESSAGE.replace("{0}", global.config.commandPrefix));

    !global.data.messageList ? global.data.messageList = {} : "";
    facebook.listener = api.listenMqtt(function callback(err, message) {
      try {
        if (message != undefined) {
          var nointernalresolve = false;
          switch (message.type) {
            case "read":
            case "read_receipt":
            case "presence":
            case "typ":
              return;
          }
          var receivetime = new Date();
          for (var n in global.chatHook) {
            if (global.chatHook[n].listenplatform & 1) {
              var chhandling = global.chatHook[n];
              if (chhandling.listentype == "everything") {
                var admin = false;
                if (global.config.admins.indexOf("FB-" + (message.senderID || message.author)) != -1) {
                  admin = true;
                }
                if (chhandling.resolverFunc("Facebook", {
                  time: receivetime,
                  msgdata: message,
                  facebookapi: api,
                  discordapi: client,
                  prefix: prefix,
                  admin: admin,
                  // eslint-disable-next-line no-loop-func
                  log: function logPlugin(...message) {
                    log.apply(global, [
                      "[PLUGIN]",
                      "[" + chhandling.handler + "]"
                    ].concat(message));
                  },
                  // eslint-disable-next-line no-loop-func
                  return: function returndata(returndata) {
                    if (!returndata) return undefined;
                    if (returndata.handler == "internal" && typeof returndata.data == "string") {
                      var endTyping = api.sendTypingIndicator(message.threadID, function () { }, message.isGroup);
                      setTimeout(function (api, returndata, endTyping, message) {
                        api.sendMessage(prefix + " " + returndata.data, message.threadID, function (err) {
                          if (err) {
                            log("[Facebook] Errored while sending response:", err);
                          }
                        }, message.messageID, message.isGroup);
                        endTyping();
                        setTimeout(function (api, message) {
                          api.markAsRead(message.threadID);
                        }, 500, api, message);
                      }, returndata.data.length * 30, api, returndata, endTyping, message);
                    } else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                      if (!returndata.data.body) {
                        returndata.data.body = "";
                      }
                      returndata.data.body = prefix + " " + returndata.data.body;
                      var endTyping = api.sendTypingIndicator(message.threadID, function () { }, message.isGroup);
                      setTimeout(function (api, returndata, endTyping, message, log) {
                        api.sendMessage(returndata.data, message.threadID, function (err) {
                          if (err) {
                            log("[Facebook] Errored while sending response:", err);
                          }
                        }, message.messageID, message.isGroup);
                        endTyping();
                        setTimeout(function (api, message) {
                          api.markAsRead(message.threadID);
                        }, 500, api, message);
                      }, (returndata.data.body.length * 30) + 1, api, returndata, endTyping, message, log);
                    }
                  }
                }) === true) {
                  nointernalresolve = true;
                }
              }
            }
          }
          switch (message.type) {
            case "message":
              fetchName(message.senderID);
              if (global.config.enableThanosTimeGems) {
                global.data.messageList[message.messageID] = message;
                for (var id in global.data.messageList) {
                  if (parseInt(global.data.messageList[id].timestamp) + 600000 < (new Date()).getTime()) {
                    delete global.data.messageList[id];
                  }
                }
              }
              if (message.isGroup) {
                !global.data.facebookChatGroupList ? global.data.facebookChatGroupList = [] : "";
                if (global.data.facebookChatGroupList.indexOf(message.threadID) == -1) global.data.facebookChatGroupList.push(message.threadID);
              }
              api.markAsRead(message.threadID);
              var arg = message.body.replace((/”/g), "\"").replace((/“/g), "\"").split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(function (el) {
                return !(el == null || el == "" || el == " " || !el.replace(/\s/g, '').length);
              }).map(function (z) {
                return z.replace(/"/g, "")
              });
              if (arg.indexOf("@everyone") != -1 && (global.config.allowEveryoneTagEvenBlacklisted || ((global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1) && !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, "FB-" + message.senderID)))) {
                api.getThreadInfo(message.threadID, function (err, data) {
                  var participants = data.participantIDs;
                  var character = "@";
                  var sendString = "";
                  var mentionObj = [];
                  var i = 0;
                  for (var n in participants) {
                    sendString += character;
                    mentionObj.push({
                      tag: character,
                      id: participants[n],
                      fromIndex: i
                    });
                    i++;
                  }
                  api.sendMessage({
                    body: sendString,
                    mentions: mentionObj
                  }, message.threadID, function (err) {
                    if (err) {
                      log("[Facebook]", "@everyone errored:", err);
                    }
                  }, message.messageID, message.isGroup);
                });
              }
              if (message.body.startsWith(global.config.commandPrefix) && !nointernalresolve) {
                if ((global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1) && !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, "FB-" + message.senderID)) {
                  log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "issued command in", message.threadID + ":", message.body);
                  if (global.commandMapping[arg[0].substr(1)]) {
                    if (!(global.commandMapping[arg[0].substr(1)].compatibly & 1) && global.commandMapping[arg[0].substr(1)].compatibly != 0) {
                      api.sendMessage(prefix + " " + global.lang["UNSUPPORTED_INTERFACE"], message.threadID, function () { }, message.messageID, message.isGroup);
                    } else {
                      var argv = JSON.parse(JSON.stringify(arg));
                      var admin = false;
                      if (global.config.admins.indexOf("FB-" + (message.senderID || message.author)) != -1) {
                        admin = true;
                      }
                      var mentions = {};
                      for (var y in message.mentions) {
                        mentions["FB-" + y] = message.mentions[y];
                      }
                      try {
                        if (!client) {
                          client = undefined
                        }
                        var starttime = Date.now();
                        var timingwarning = setInterval(function () {
                          var calctime = (Date.now() - starttime) / 1000;
                          if (calctime >= 10) {
                            log("[INTERNAL]", "Timing Warning: Command \"", arg.join(" "), "\" is taking over", calctime.toFixed(3) + "s to execute and still not done.");
                          }
                        }, 10000);
                        try {
                          var returndata = global.commandMapping[arg[0].substr(1)].scope("Facebook", {
                            args: argv,
                            time: receivetime,
                            msgdata: message,
                            facebookapi: api,
                            discordapi: client,
                            prefix: prefix,
                            admin: admin,
                            mentions: mentions,
                            log: function logPlugin(...message) {
                              log.apply(global, [
                                "[PLUGIN]",
                                "[" + global.commandMapping[arg[0].substr(1)].handler + "]"
                              ].concat(message));
                            },
                            return: function returndata(returndata) {
                              if (!returndata) return undefined;
                              if (returndata.handler == "internal" && typeof returndata.data == "string") {
                                var endTyping = api.sendTypingIndicator(message.threadID, function () { }, message.isGroup);
                                setTimeout(function (api, returndata, endTyping, message) {
                                  api.sendMessage(prefix + " " + returndata.data, message.threadID, function (err) {
                                    if (err) {
                                      log("[Facebook] Errored while sending response:", err);
                                    }
                                  }, message.messageID, message.isGroup);
                                  endTyping();
                                  setTimeout(function (api, message) {
                                    api.markAsRead(message.threadID);
                                  }, 500, api, message);
                                }, returndata.data.length * 30, api, returndata, endTyping, message);
                              } else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                                if (!returndata.data.body) {
                                  returndata.data.body = "";
                                }
                                returndata.data.body = prefix + " " + returndata.data.body;
                                var endTyping = api.sendTypingIndicator(message.threadID, function () { }, message.isGroup);
                                setTimeout(function (api, returndata, endTyping, message, log) {
                                  api.sendMessage(returndata.data, message.threadID, function (err) {
                                    if (err) {
                                      log("[Facebook] Errored while sending response:", err);
                                    }
                                  }, message.messageID, message.isGroup);
                                  endTyping();
                                  setTimeout(function (api, message) {
                                    api.markAsRead(message.threadID);
                                  }, 500, api, message);
                                }, (returndata.data.body.length * 30) + 1, api, returndata, endTyping, message, log);
                              }
                            }
                          });
                        } catch (ex) {
                          returndata = {
                            handler: "internal",
                            data: "plerr: " + ex.stack
                          }
                        }

                        if (typeof returndata == "object") {
                          if (returndata.handler == "internal" && typeof returndata.data == "string") {
                            var endTyping = api.sendTypingIndicator(message.threadID, function () { }, message.isGroup);
                            setTimeout(function (api, returndata, endTyping, message) {
                              api.sendMessage(prefix + " " + returndata.data, message.threadID, function (err) {
                                if (err) {
                                  log("[Facebook] Errored while sending response:", err);
                                }
                              }, message.messageID, message.isGroup);
                              endTyping();
                              setTimeout(function (api, message) {
                                api.markAsRead(message.threadID);
                              }, 500, api, message);
                            }, returndata.data.length * 30, api, returndata, endTyping, message);
                          } else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                            if (!returndata.data.body) {
                              returndata.data.body = "";
                            }
                            returndata.data.body = prefix + " " + returndata.data.body;
                            var endTyping = api.sendTypingIndicator(message.threadID, function () { }, message.isGroup);
                            setTimeout(function (api, returndata, endTyping, message, log) {
                              api.sendMessage(returndata.data, message.threadID, function (err) {
                                if (err) {
                                  log("[Facebook] Errored while sending response:", err);
                                }
                              }, message.messageID, message.isGroup);
                              endTyping();
                              setTimeout(function (api, message) {
                                api.markAsRead(message.threadID);
                              }, 500, api, message);
                            }, (returndata.data.body.length * 30) + 1, api, returndata, endTyping, message, log);
                          }
                        }
                        var endtime = Date.now();
                        var calctime = (endtime - starttime) / 1000;
                        if (calctime >= 10) {
                          log("[INTERNAL]", "Timing Warning: Command \"", arg.join(" "), "\" took", calctime.toFixed(3) + "s to execute!");
                        }
                        clearInterval(timingwarning);
                      } catch (ex) {
                        try {
                          log("[INTERNAL]", global.commandMapping[arg[0].substr(1)].handler, "contain an error:", ex);
                        } catch (exp) {
                          log("[INTERNAL]", arg[0], "contain an error:", ex);
                        }
                        try {
                          clearInterval(timingwarning);
                        } catch (ex) { }
                      }
                    }
                  } else {
                    api.sendMessage(prefix + " " + global.lang["UNKNOWN_CMD"].replace("{0}", global.config.commandPrefix), message.threadID, function () { }, message.messageID, message.isGroup);
                  }
                } else {
                  var str = "";
                  for (var n in message.attachments) {
                    var type = message.attachments[n].type;
                    type = type[0].toLocaleUpperCase() + type.substr(1);
                    str += "\r\n  <";
                    str += type;
                    str += " ";
                    switch (message.attachments[n].type) {
                      case "audio":
                      case "video":
                        var dr = new Date(message.attachments[n].duration);
                        str += dr.getUTCHours() + ":" + dr.getUTCMinutes() + ":" + dr.getUTCSeconds() + "." + dr.getUTCMilliseconds();
                        str += " ";
                        if (message.attachments[n].type == "audio") break;
                      // eslint-disable-next-line no-fallthrough
                      case "photo":
                      case "animated_image":
                      case "sticker":
                        str += message.attachments[n].width;
                        str += "x";
                        str += message.attachments[n].height;
                        str += " ";
                    }
                    str += "| ";
                    str += message.attachments[n].url;
                    str += ">";
                  }
                  log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", (message.senderID == message.threadID ? "DMed:" : "messaged in thread " + message.threadID + ":"), message.body, str);
                }
              } else {
                var str = "";
                for (var n in message.attachments) {
                  var type = message.attachments[n].type;
                  type = type[0].toLocaleUpperCase() + type.substr(1);
                  str += "\r\n  <";
                  str += type;
                  str += " ";
                  switch (message.attachments[n].type) {
                    case "audio":
                    case "video":
                      var dr = new Date(message.attachments[n].duration);
                      str += dr.getUTCHours() + ":" + dr.getUTCMinutes() + ":" + dr.getUTCSeconds() + "." + dr.getUTCMilliseconds();
                      str += " ";
                      if (message.attachments[n].type == "audio") break;
                    // eslint-disable-next-line no-fallthrough
                    case "photo":
                    case "animated_image":
                    case "sticker":
                      str += message.attachments[n].width;
                      str += "x";
                      str += message.attachments[n].height;
                      str += " ";
                  }
                  str += "| ";
                  str += message.attachments[n].url;
                  str += ">";
                }
                log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", (message.senderID == message.threadID ? "DMed:" : "messaged in thread " + message.threadID + ":"), message.body, str);
              }
              break;
            case "event":
              log("[Facebook]", message);
              try {
                if (message.logMessageType == "log:subscribe") {
                  var containBot = false;
                  var botID = api.getCurrentUserID();
                  for (var n in message.logMessageData.addedParticipants) {
                    if (message.logMessageData.addedParticipants[n].userFbId == botID) {
                      containBot = true;
                    }
                  }
                  if (containBot) {
                    api.sendMessage(global.config.botname + " | Connected. \r\n" + global.lang.CONNECTED_MESSAGE.replace("{0}", global.config.commandPrefix), message.threadID, message.isGroup);
                    log("[Facebook]", message.author, "added Bot to", message.threadID);
                  }
                }
              } catch (ex) {
                log("[Facebook]", ex);
              }
              break;
            case "message_reaction":
              log("[Facebook]", message);
              break;
            case "message_unsend":
              if (global.config.enableThanosTimeGems && Object.prototype.hasOwnProperty.call(global.data.messageList, message.messageID)) {
                if (!global.data.thanosBlacklist[message.threadID]) {
                  (function () {
                    var removedMessage = global.data.messageList[message.messageID];
                    var attachmentArray = [];
                    for (var n in removedMessage.attachments) {
                      switch (removedMessage.attachments[n].type) {
                        case "file":
                          attachmentArray.push({
                            type: removedMessage.attachments[n].type,
                            data: syncrequest("GET", removedMessage.attachments[n].url).body,
                            name: removedMessage.attachments[n].filename
                          });
                          break;
                        case "photo":
                          attachmentArray.push({
                            type: removedMessage.attachments[n].type,
                            data: syncrequest("GET", removedMessage.attachments[n].url).body,
                            name: removedMessage.attachments[n].filename + ".png"
                          });
                          break;
                        case "audio":
                          attachmentArray.push({
                            type: removedMessage.attachments[n].type,
                            data: syncrequest("GET", removedMessage.attachments[n].url).body,
                            name: removedMessage.attachments[n].filename + ".mp3"
                          });
                          break;
                        case "video":
                          attachmentArray.push({
                            type: removedMessage.attachments[n].type,
                            data: syncrequest("GET", removedMessage.attachments[n].url).body,
                            name: removedMessage.attachments[n].filename + ".mp4"
                          });
                          break;
                        case "animated_image":
                          attachmentArray.push({
                            type: removedMessage.attachments[n].type,
                            data: syncrequest("GET", removedMessage.attachments[n].url).body,
                            name: removedMessage.attachments[n].filename + ".gif"
                          });
                          break;
                        case "sticker":
                          attachmentArray.push({
                            type: removedMessage.attachments[n].type,
                            data: syncrequest("GET", removedMessage.attachments[n].url).body,
                            name: removedMessage.attachments[n].ID + ".png"
                          });
                          break;
                      }
                    }
                    var att = [];
                    var promiselist = [];
                    var worker = new Worker(() => {
                      onmessage = function (event) {
                        var wait = require("wait-for-stuff");
                        try {
                          var NSFWJS = wait.for.promise(require("nsfwjs").load("http://127.0.0.1:2812/", { size: (event.data.small ? 224 : 299) }));
                        } catch (ex) {
                          var NSFWJS = wait.for.promise(require("nsfwjs").load("https://lequanglam.github.io/nsfwjs-model/", { size: 299 }));
                        }
                        var data = event.data;
                        try {
                          var cl = wait.for.promise(NSFWJS.classify({
                            data: new Uint8Array(data.data),
                            width: data.width,
                            height: data.height
                          }, 5));
                          postMessage({
                            class: cl,
                            id: data.id
                          });
                        } catch (ex) {
                          postMessage({
                            error: ex.toString(),
                            id: data.id
                          });
                        }
                      }
                    }, [], { silent: true });
                    worker.onmessage = function (event) {
                      var data = event.data;
                      Object.assign(global.nsfwjsdata[data.id], data);
                      global.nsfwjsdata[data.id].complete = true;
                      global.nsfwjsdata[data.id].resolve(data);
                      if (data.error) {
                        log("[Facebook]", "Error in image classifier:", data.error);
                      }
                    }
                    var idlist = [];
                    for (var n in attachmentArray) {
                      var imagesx = new streamBuffers.ReadableStreamBuffer({
                        frequency: 10,
                        chunkSize: 2048
                      });
                      imagesx.path = attachmentArray[n].name;
                      imagesx.put(attachmentArray[n].data);
                      imagesx.stop();
                      if ((attachmentArray[n].type == "photo" ||
                        attachmentArray[n].type == "animated_image") &&
                        !global.data.thanosBlacklist[message.threadID]) {
                        var image = new Image();
                        image.src = attachmentArray[n].data;
                        var cvs = new Canvas(image.width, image.height);
                        var ctx = cvs.getContext("2d");
                        ctx.drawImage(image, 0, 0);
                        var imgdata1 = ctx.getImageData(0, 0, image.width, image.height);

                        var id = Date.now().toString() + "-" + random(0, 99).toString() + random(0, 99).toString() + Math.random().toString() + Math.random().toString();
                        global.nsfwjsdata[id] = {};
                        global.nsfwjsdata[id].complete = false;
                        worker.postMessage({
                          id: id,
                          data: Array.from(imgdata1.data),
                          width: imgdata1.width,
                          height: imgdata1.height,
                          small: global.config.nsfwjsSmallModel
                        });
                        // eslint-disable-next-line no-loop-func
                        global.nsfwjsdata[id].promise = new Promise(resolve => {
                          global.nsfwjsdata[id].resolve = resolve;
                        });
                        global.nsfwjsdata[id].imagesx = imagesx;
                        idlist.push(id);
                      } else {
                        att.push(imagesx);
                      }
                    }
                    for (var id in idlist) {
                      promiselist.push(global.nsfwjsdata[idlist[id]].promise);
                    }
                    Promise.all(promiselist).then(function (arrdata) {
                      var bannedatt = [];
                      for (var n in arrdata) {
                        var classing = global.nsfwjsdata[arrdata[n].id].class;
                        try {
                          var classify = classing[0].className;
                          var percentage = classing[0].probability * 100;
                        } catch (ex) { }
                        switch (classify) {
                          case "Neutral":
                          case "Drawing":
                          case "Sexy":
                            att.push(global.nsfwjsdata[arrdata[n].id].imagesx);
                          // eslint-disable-next-line no-fallthrough
                          case "Hentai":
                          case "Porn":
                            bannedatt.push(classify + ": " + percentage.toFixed(2) + "%");
                            log("[Facebook]", "Removed image classified as:", classify);
                            break;
                          default:
                            log("[Facebook]", "Invalid image classification:", classify, classing);
                            att.push(imagesx);
                        }
                      }
                      worker.terminate();
                      var btext = "";
                      if (bannedatt.length != 0) {
                        btext = "\r\n\r\nImage classify percentage: " + JSON.stringify(bannedatt, null, 1).substr(1, JSON.stringify(bannedatt, null, 1).length - 2).replace(/"/g, "");
                      }
                      api.sendMessage({
                        body: prefix + " " + global.lang["TIME_GEM_ACTIVATION_MSG"].replace("{0}", "@" + global.data.cacheName["FB-" + message.senderID]).replace("{1}", removedMessage.body) + btext,
                        mentions: [{
                          tag: "@" + global.data.cacheName["FB-" + message.senderID],
                          id: message.senderID,
                          fromIndex: 0
                        }],
                        attachment: att
                      }, message.threadID, function (err) {
                        if (err) {
                          log("[Facebook] Errored while sending Anti-Unsend response:", err);
                        } else {
                          api.markAsRead(message.threadID);
                        }
                      }, null, message.isGroup);
                      log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "tried to delete message in " + message.threadID, "but can't because Thanos's Time Gem is activated. Data: ", global.data.messageList[message.messageID]);
                    });
                  })();
                } else {
                  log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "deleted a message in " + message.threadID + " (" + message.messageID + ") but we have data: ", global.data.messageList[message.messageID]);
                }
                fs.writeFileSync(path.join(__dirname, "deletedmsg/") + message.messageID, JSON.stringify(global.data.messageList[message.messageID], null, 4));
                for (var id in global.data.messageList) {
                  if (parseInt(global.data.messageList[id].timestamp) + 600000 < (new Date()).getTime()) {
                    delete global.data.messageList[id];
                  }
                }
              } else {
                log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "deleted a message in " + message.threadID + ". (" + message.messageID + ")");
              }
              break;
            case "message_reply":
              if (global.config.enableThanosTimeGems) {
                global.data.messageList[message.messageID] = message;
                for (var id in global.data.messageList) {
                  if (parseInt(global.data.messageList[id].timestamp) - 600000 > (new Date()).getTime()) {
                    delete global.data.messageList[id];
                  }
                }
              }
              if (message.messageReply) {
                for (var xzxz in message.messageReply.attachments) {
                  if (message.messageReply.attachments[xzxz].error) {
                    fs.writeFileSync(path.join(__dirname, 'logs', 'message-error-' + message.messageID + ".json"), JSON.stringify(message, null, 4));
                  }
                }
              }
              api.markAsRead(message.threadID);
              var arg = message.body.replace((/”/g), "\"").replace((/“/g), "\"").split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(function (el) {
                return !(el == null || el == "" || el == " ");
              });
              arg.map(xy => xy.replace(/["]/g, ""));
              if (arg.indexOf("@everyone") != -1 && (global.config.allowEveryoneTagEvenBlacklisted || ((global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1) && !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, "FB-" + message.senderID)))) {
                api.getThreadInfo(message.threadID, function (err, data) {
                  var participants = data.participantIDs;
                  var character = "@";
                  var sendString = "";
                  var mentionObj = [];
                  var i = 0;
                  for (var n in participants) {
                    sendString += character;
                    mentionObj.push({
                      tag: character,
                      id: participants[n],
                      fromIndex: i
                    });
                    i++;
                  }
                  api.sendMessage({
                    body: sendString,
                    mentions: mentionObj
                  }, message.threadID, function (err) {
                    if (err) {
                      log("[Facebook] @everyone errored:", err);
                    }
                  }, message.messageID, message.isGroup);
                });
              }

              try {
                var str = "";
                for (var n in message.attachments) {
                  var type = message.attachments[n].type;
                  type = type[0].toLocaleUpperCase() + type.substr(1);
                  str += "\r\n  <";
                  str += type;
                  str += " ";
                  switch (message.attachments[n].type) {
                    case "audio":
                    case "video":
                      var dr = new Date(message.attachments[n].duration);
                      str += dr.getUTCHours() + ":" + dr.getUTCMinutes() + ":" + dr.getUTCSeconds() + "." + dr.getUTCMilliseconds();
                      str += " ";
                      if (message.attachments[n].type == "audio") break;
                    // eslint-disable-next-line no-fallthrough
                    case "photo":
                    case "animated_image":
                    case "sticker":
                      str += message.attachments[n].width;
                      str += "x";
                      str += message.attachments[n].height;
                      str += " ";
                  }
                  str += "| ";
                  str += message.attachments[n].url;
                  str += ">";
                }
                log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "replied to", message.messageReply.senderID, "at", message.threadID + ":", message.body, str);
              } catch (ex) {
                log("[Facebook] ERROR on replymsg", message);
              }
              break;
            default:
              break;
          }
        } else {
          log("[Facebook]", "Detected undefined!", err);
        }
      } catch (ex) {
        log("[Facebook]", ex, message);
      }
    });
    log("[Facebook]", "Started Facebook listener");
  }
  var temporaryAppState = {};
  var fbloginobj = {};
  fbloginobj.email = global.config.fbemail;
  fbloginobj.password = global.config.fbpassword;
  if (global.config.usefbappstate && fs.existsSync(path.join(__dirname, "fbstate.json"))) {
    fbloginobj.appState = JSON.parse(fs.readFileSync(path.join(__dirname, "fbstate.json"), 'utf8'));
  }
  var configobj = {
    userAgent: global.config.fbuseragent,
    logLevel: global.config.DEBUG_FCA_LOGLEVEL,
    selfListen: true,
    listenEvents: true,
    updatePresence: false,
    autoMarkRead: true
  }
  if (global.config.facebookProxy != null) {
    if (global.config.facebookProxyUseSOCKS) {
      configobj.proxy = "http://127.0.0.1:2813";
    } else {
      configobj.proxy = "http://" + global.config.facebookProxy;
    }
  }
  try {
    log("[Facebook]", "Logging in...");
    var fbinstance = require("fca-unofficial")(fbloginobj, configobj, facebookcb);
    forceReconnect = function forceReconnect(error) {
      if (!error) {
        log("[Facebook]", "Destroying Facebook Chat instance and creating a new one... (12 hours clock)");
      }
      if (typeof facebook.listener == "function") {
        facebook.listener();
        log("[Facebook]", "Stopped Facebook listener");
        temporaryAppState = facebook.api.getAppState();
      }
      try {
        clearInterval(facebook.removePendingClock);
      } catch (ex) { }
      fbinstance = undefined;
      delete require.cache[require.resolve("fca-unofficial")];
      delete require.cache[require.resolve("mqtt")];
      fbinstance = require("fca-unofficial")({
        appState: temporaryAppState
      }, configobj, facebookcb);
      log("[Facebook]", "New instance created.");
      log("[Facebook]", "Logging in...");
      setTimeout(function (fr) {
        if (facebook.error && !facebook.listener) {
          log("[Facebook]", "Detected error. Attempting to reconnect...");
          fr(true);
        }
      }, 30000, forceReconnect);
    }
    //setInterval(forceReconnect, 43200000);
  } catch (ex) {
    log("[Facebook]", "Error found in codebase:", ex);
  }
}

rl.on('line', (message) => {
  log("[INTERNAL]", "CONSOLE issued javascript code:", message);
  try {
    log("[JAVASCRIPT]", eval(message));
  } catch (ex) {
    log("[JAVASCRIPT]", ex);
  }
});
rl.setPrompt("console@c3c:js# ");
rl.prompt();

if (global.config.enableSSHRemoteConsole) {
  var ssh2 = require('ssh2');
  var hostkey = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });
  log("[SSH]", "Generated new keys.");
  global.ssh2server = new ssh2.Server({
    hostKeys: [hostkey.privateKey]
  }, function connListener(client, conninfo) {
    log("[SSH]", conninfo.ip + ":" + conninfo.port, "connected with client named", conninfo.header.versions.software);
    client.on('authentication', function (ctx) {
      var user = ctx.username;
      if (user.length !== global.config.sshUsername.length ||
        !(user == global.config.sshUsername)) {
        log("[SSH]", conninfo.ip + ":" + conninfo.port, "tried to authenticate with wrong username (", user, ")");
        return ctx.reject([], false);
      }
      switch (ctx.method) {
        case 'password':
          var password = ctx.password;
          if (password.length === global.config.sshPassword.length &&
            password == global.config.sshPassword) {
            return ctx.accept();
          } else {
            log("[SSH]", conninfo.ip + ":" + conninfo.port, "tried to authenticate with wrong password.");
            return ctx.reject(["password"], false);
          }
        /* case 'publickey':
        log("[SSH]", conninfo.ip + ":" + conninfo.port, "tried to authenticate with public keys, which is not supported.");
          return ctx.reject(); */
        default:
          log("[SSH]", conninfo.ip + ":" + conninfo.port, "is authenticating with method:", ctx.method, ". Notifying client that a password is needed...");
          return ctx.reject(["password"], true);
      }
    }).on('ready', function () {
      log("[SSH]", conninfo.ip + ":" + conninfo.port, "authenticated successfully.");
      client.on('session', function (accept, reject) {
        var session = accept();

        //SFTP Protocol
        session.on('sftp', function (accept, reject) {
          return reject();
          // eslint-disable-next-line no-unreachable
          log("[SSH]", conninfo.ip + ":" + conninfo.port, "requested to establish SFTP connection (File Editor).");
          var sftpStream = accept();
          var openFiles = {};
          var fdmap = {};
          //var handleCount = 0;
          sftpStream.on('OPEN', function (reqid, filename, flags, attrs) {
            if (!fs.existsSync(__dirname + filename)) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is opening file", filename, ", which does not exist.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            } else {
              var handle = Buffer.alloc(4);
              handle.writeUInt32BE(fs.openSync(__dirname + filename, flags), 0);
              openFiles[handle.readUInt32BE(0)] = true;
              fdmap[handle.readUInt32BE(0)] = filename;
              sftpStream.handle(reqid, handle);
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is opening file", filename, "( fd:", handle.readUInt32BE(0), ")");
            }
          }).on('OPENDIR', function (reqid, path) {
            if (!fs.existsSync(__dirname + path)) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is opening directory", path, ", which does not exist.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            } else {
              var dir = fs.opendirSync(path);
              var handle = Math.pow(2, 31) - 1;
              while (openFiles[handle]) {
                handle = random(Math.pow(2, 29), Math.pow(2, 31) - 1);
              }
              openFiles[handle] = true;
              fdmap[handle] = dir;
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is opening directory", path);
              sftpStream.handle(reqid, handle);
            }
          }).on('READDIR', function (reqid, handle) {
            if (!(fdmap[handle.readUInt32BE(0)] instanceof fs.Dir)) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is reading directory at file descriptor", handle.readUInt32BE(0), ", which does not exist.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            } else {
              var dirread = fdmap[handle].readSync();
              dirread.map(function (paths) {
                var x = path.relative(__dirname, paths).replace(/\\/, "/");
                if (x.startsWith("../")) {
                  x = x.substr(2);
                } else {
                  x = x.substr(1);
                }
                return x;
              });
              sftpStream.name(handle.readUInt32BE(0), dirread);
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is reading directory", fdmap[handle.readUInt32BE(0)].substr(5));
            }
          }).on('REALPATH', function (reqid, path) {
            try {
              sftpStream.name(reqid, fs.normalize(path));
            } catch (ex) {
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            }
          }).on('STAT', function (reqid, path) {
            if (!fs.existsSync(__dirname + path)) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting stat for path", path, ", which does not exist.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            } else {
              sftpStream.attrs(reqid, fs.statSync(__dirname + path))
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting stat for path", path);
            }
          }).on('LSTAT', function (reqid, path) {
            if (!fs.existsSync(__dirname + path)) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting lstat for path", path, ", which does not exist.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            } else {
              sftpStream.attrs(reqid, fs.lstatSync(__dirname + path))
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting lstat for path", path);
            }
          }).on('MKDIR', function (reqid, path, attrs) {
            if (fs.existsSync(__dirname + path)) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is creating path", path, ", which exists.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            } else {
              try {
                fs.mkdirSync(__dirname + path);
                sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
                log("[SSH]", conninfo.ip + ":" + conninfo.port, "is creating path", path);
              } catch (ex) {
                sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
                log("[SSH]", conninfo.ip + ":" + conninfo.port, "is creating path", path, ", which can't be created. Additional information:", ex.toString());
              }
            }
          }).on('RENAME', function (reqid, oldpath, newpath) {
            if (!fs.existsSync(__dirname + oldpath)) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is renaming", path, ", which doesn't exists.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            } else {
              try {
                fs.renameSync(__dirname + oldpath, __dirname + newpath);
                sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
                log("[SSH]", conninfo.ip + ":" + conninfo.port, "is renaming path", oldpath, "to", newpath);
              } catch (ex) {
                sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
                log("[SSH]", conninfo.ip + ":" + conninfo.port, "is renaming path", path, ", which can't be renamed. Additional information:", ex.toString());
              }
            }
          }).on('READ', function (reqid, handle, offset, length) {
            if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0)]) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is reading file", fdmap[handle.readUInt32BE(0)], ", which isn't opened.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            }
            try {
              var databuff = Buffer.alloc(length);
              var datasize = fs.readSync(handle.readUInt32BE(0), databuff, offset, length);
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is reading file", fdmap[handle.readUInt32BE(0)], "with offset =", offset, ", length = ", length);
              sftpStream.data(reqid, databuff);
              if (datasize < length) {
                sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.EOF);
              }
            } catch (ex) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is reading file", fdmap[handle.readUInt32BE(0)], ", which cannot be read. Additional information:", ex.toString());
              sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            }
          }).on('WRITE', function (reqid, handle, offset, data) {
            if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0)]) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is writing file", fdmap[handle.readUInt32BE(0)], ", which isn't opened.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            }

            try {
              fs.writeSync(handle.readUInt32BE(0), data, offset);
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is writing file", fdmap[handle.readUInt32BE(0)]);
              sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
            } catch (ex) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is writing file", fdmap[handle.readUInt32BE(0)], ", which cannot be writen. Additional information:", ex.toString());
              sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            }
          }).on('FSTAT', function (reqid, handle) {
            if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0)]) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting FSTAT for file", fdmap[handle.readUInt32BE(0)], ", which isn't opened.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            }

            try {
              sftpStream.attrs(reqid, fs.fstatSync(handle.readUInt32BE(0)));
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting FSTAT for file", fdmap[handle.readUInt32BE(0)]);
            } catch (ex) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting FSTAT for file", fdmap[handle.readUInt32BE(0)], ", which cannot be read. Additional information:", ex.toString());
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            }
          }).on('FSETSTAT', function (reqid, handle, attrs) {
            if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0)]) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is setting FSTAT for file", fdmap[handle.readUInt32BE(0)], ", which isn't opened.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            }
            log("[SSH]", conninfo.ip + ":" + conninfo.port, "is setting FSTAT for file", fdmap[handle.readUInt32BE(0)], ", which cannot be writen (because no)");
            return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
          }).on('CLOSE', function (reqid, handle) {
            if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0)]) {
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is closing file descriptor", handle.readUInt32BE(0), ", which does not exist.");
              return sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
            } else if (handle.length === 4 && fdmap[handle.readUInt32BE(0)] instanceof fs.Dir) {
              try {
                log("[SSH]", conninfo.ip + ":" + conninfo.port, "is closing directory", fdmap[handle.readUInt32BE(0)].path, ".");
                fdmap[handle.readUInt32BE(0)].closeSync();
                delete openFiles[handle.readUInt32BE(0)];
                sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
                delete fdmap[handle.readUInt32BE(0)];
              } catch (ex) {
                sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
                log("[SSH]", conninfo.ip + ":" + conninfo.port, "is closing directory", fdmap[handle.readUInt32BE(0)].path, ", but can't be closed. Additional information:", ex.toString());
              }
            }
            try {
              fs.closeSync(handle.readUInt32BE(0));
              delete openFiles[handle.readUInt32BE(0)];
              sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is closing file", fdmap[handle.readUInt32BE(0)], ".");
              delete fdmap[handle.readUInt32BE(0)];
            } catch (ex) {
              sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "is closing file", fdmap[handle.readUInt32BE(0)], ", but can't be closed. Additional information:", ex.toString());
            }
          });
        });

        //SSH Shell
        session.once('shell', function (accept, _reject) {
          log("[SSH]", conninfo.ip + ":" + conninfo.port, "requested a shell (Remote Console).");
          global.sshstream[conninfo.ip + ":" + conninfo.port] = accept();
          global.sshstream[conninfo.ip + ":" + conninfo.port].write('\u001B[2J\u001B[0;0f');
          global.sshstream[conninfo.ip + ":" + conninfo.port].write(global.config.botname + " v" + version + (global.config.botname != "C3CBot" ? "(Powered by C3C)" : ""));
          global.sshstream[conninfo.ip + ":" + conninfo.port].write("\r\n");
          global.sshstream[conninfo.ip + ":" + conninfo.port].write("https://github.com/lequanglam/c3c");
          global.sshstream[conninfo.ip + ":" + conninfo.port].write("\r\n");
          global.sshstream[conninfo.ip + ":" + conninfo.port].write("---------------------------------< EOH");
          global.sshstream[conninfo.ip + ":" + conninfo.port].write("\r\n");

          var sshrl = readline.createInterface({
            input: global.sshstream[conninfo.ip + ":" + conninfo.port].stdin,
            output: global.sshstream[conninfo.ip + ":" + conninfo.port].stdout,
            terminal: true,
            prompt: ""
          });
          global.sshcurrsession[conninfo.ip + ":" + conninfo.port] = sshrl;
          sshrl.on('line', (message) => {
            log("[INTERNAL]", conninfo.ip + ":" + conninfo.port, "issued javascript code:", message);
            try {
              log("[SSH-JAVASCRIPT]", eval(message));
            } catch (ex) {
              log("[SSH-JAVASCRIPT]", ex);
            }
          });
          sshrl.setPrompt("ssh@c3c:js# ");
          sshrl.prompt();

          // process.stdout.pipe(stream, {end: false});
          // stream.pipe(process.stdin, {end: false});
        });
      });
    }).on('end', function () {
      delete global.sshcurrsession[conninfo.ip + ":" + conninfo.port];
      delete global.sshstream[conninfo.ip + ":" + conninfo.port];
      log("[SSH]", conninfo.ip + ":" + conninfo.port, "disconnected.");
    }).on('error', function (err) {
      log("[SSH]", "ERR!", err);
      delete global.sshcurrsession[conninfo.ip + ":" + conninfo.port];
      delete global.sshstream[conninfo.ip + ":" + conninfo.port];
    });
  }).on('error', function (err) {
    log("[SSH]", "ERR!", err);
  }).listen(global.config.sshRemoteConsolePort, global.config.sshRemoteConsoleIP, function () {
    log("[SSH]", "Listening for SSH connection at", this.address().address + ":" + this.address().port);
  });
}

!global.data.cacheName ? global.data.cacheName = {} : "";
!global.data.thanosBlacklist ? global.data.thanosBlacklist = {} : "";

if (global.config.enablediscord) {
  const Discord = require('discord.js');
  client = new Discord.Client();
  client.on('ready', () => {
    log("[Discord]", "Logged in as", client.user.tag + ".");
  });
  client.on('error', error => {
    log("[Discord]", "Crashed with error: ", error);
    log("[Discord]", "Trying to reconnect... Some commands might not work correctly.");
  });

  discordMessageHandler = function (message) {
    var nointernalresolve = false;
    var receivetime = new Date();
    for (var n in global.chatHook) {
      if (global.chatHook[n].listenplatform & 2) {
        var chhandling = global.chatHook[n];
        if (chhandling.listentype == "everything") {
          var admin = false;
          if (global.config.admins.indexOf("DC-" + message.author.id) != -1) {
            admin = true;
          }
          if (chhandling.resolverFunc("Discord", {
            time: receivetime,
            msgdata: message,
            discordapi: client,
            // eslint-disable-next-line no-nested-ternary
            facebookapi: (typeof facebook == "object" ? (typeof facebook.api == "object" ? facebook.api : {}) : {}),
            prefix: prefix,
            admin: admin,
            // eslint-disable-next-line no-loop-func
            log: function logPlugin(...message) {
              log.apply(global, [
                "[PLUGIN]",
                "[" + chhandling.handler + "]"
              ].concat(message));
            },
            // eslint-disable-next-line no-loop-func
            return: function returndata(returndata) {
              if (!returndata) return undefined;
              if (returndata.handler == "internal" && typeof returndata.data == "string") {
                message.reply("\r\n" + prefix + " " + (returndata.data || ""));
              } else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                var body = returndata.data.body || "";
                delete returndata.data.body;
                message.reply("\r\n" + prefix + " " + body, returndata.data);
              }
            }
          }) === true) {
            nointernalresolve = true;
          }
        }
      }
    }
    if (message.content.startsWith(global.config.commandPrefix) && !nointernalresolve) {
      if (((global.config.discordlistenwhitelist && global.config.discordlisten.indexOf(message.channel.id) != -1) || (!global.config.discordlistenwhitelist && global.config.discordlisten.indexOf(message.channel.id) == -1)) && message.author.tag != client.user.tag && !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, ("DC-" + message.author.id))) {
        log("[Discord]", message.author.id, "(" + message.author.tag + ")", "issued command in", message.channel.id + " (" + message.channel.name + "):", message.content, (message.attachments.size > 0 ? message.attachments : ""));
        var currenttime = new Date();
        var arg = message.content.replace((/”/g), "\"").replace((/“/g), "\"").split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(function (el) {
          return !(el == null || el == "" || el == " ");
        }).map(xy => xy.replace(/"/g, ""));
        if (global.commandMapping[arg[0].substr(1)]) {
          if (!(global.commandMapping[arg[0].substr(1)].compatibly & 2) && global.commandMapping[arg[0].substr(1)].compatibly != 0) {
            message.reply("\r\n" + prefix + " " + global.lang["UNSUPPORTED_INTERFACE"]);
          } else {
            var admin = false;
            for (var no in global.config.admins) {
              if (global.config.admins[no] == "DC-" + message.author.id) {
                admin = true;
              }
            }
            global.data.cacheName["DC-" + message.author.id] = message.author.tag;
            var mentions = {};
            message.mentions.users.forEach(function (y, x) {
              mentions["DC-" + x] = y;
              global.data.cacheName["DC-" + x] = y.username + "#" + y.discrimator;
            });
            try {
              if (facebook) {
                if (!facebook.api) {
                  facebook.api = {}
                }
              } else {
                facebook = {};
                facebook.api = {};
              }
              var returndata = global.commandMapping[arg[0].substr(1)].scope("Discord", {
                args: JSON.parse(JSON.stringify(arg)),
                time: currenttime,
                msgdata: message,
                prefix: prefix,
                admin: admin,
                mentions: mentions,
                discordapi: client,
                facebookapi: facebook.api,
                log: function logPlugin(...message) {
                  log.apply(global, [
                    "[PLUGIN]",
                    "[" + global.commandMapping[arg[0].substr(1)].handler + "]"
                  ].concat(message));
                },
                return: function returndata(returndata) {
                  if (!returndata) return undefined;
                  if (returndata.handler == "internal" && typeof returndata.data == "string") {
                    message.reply("\r\n" + prefix + " " + (returndata.data || ""));
                  } else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                    var body = returndata.data.body || "";
                    delete returndata.data.body;
                    message.reply("\r\n" + prefix + " " + body, returndata.data);
                  }
                }
              });
              if (typeof returndata == "object") {
                if (returndata.handler == "internal" && typeof returndata.data == "string") {
                  message.reply("\r\n" + prefix + " " + (returndata.data || ""), { split: true });
                } else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                  var body = returndata.data.body || "";
                  delete returndata.data.body;
                  returndata.data.split = true;
                  message.reply("\r\n" + prefix + " " + body, returndata.data);
                }
              }
            } catch (ex) {
              log("[INTERNAL]", global.commandMapping[arg[0].substr(1)].handler, "contain an error:", ex)
            }
          }
        } else {
          message.reply("\r\n" + prefix + " " + global.lang["UNKNOWN_CMD"].replace("{0}", global.config.commandPrefix));
        }
      } else {
        log("[Discord]", message.author.id, "(" + message.author.tag + ")", (message.channel instanceof Discord.DMChannel ? "DMed:" : "messaged in channel " + message.channel.id + " (" + message.channel.name + "):"), message.content, (message.attachments.size > 0 ? message.attachments : ""));
      }
    } else {
      log("[Discord]", message.author.id, "(" + message.author.tag + ")", (message.channel instanceof Discord.DMChannel ? "DMed:" : "messaged in channel " + message.channel.id + " (" + message.channel.name + "):"), message.content, (message.attachments.size > 0 ? message.attachments : ""));
    }
  }
  client.on('message', discordMessageHandler);
  log("[Discord]", "Logging in...");
  client.login(global.config.discordtoken);
  global.config.discordtoken = "<censored, security measures>"
}

//Handling exit
var shutdownHandler = function (errorlevel) {
  log("[INTERNAL]", "Detected process is shutting down, handling...");
  //Stop Facebook listener
  if (facebook.listener) {
    facebook.listener();
    log("[Facebook]", "Stopped Facebook listener");
  }
  //Stop Discord listener and destroy Discord client
  if (global.config.enablediscord) {
    client.removeListener('message', discordMessageHandler);
    log("[Discord]", "Stopped Discord listener");
    client.destroy();
    log("[Discord]", "Logged out and destroyed client.");
  }
  //Logout if don't use appstates
  if (!global.config.usefbappstate && facebook.api) {
    facebook.api.logout();
    log("[Facebook]", "Logged out");
  }
  //Stop auto-saving
  try {
    clearInterval(autosave);
    log("[INTERNAL]", "Stopped auto-save.");
  } catch (ex) {
    log("[INTERNAL]", ex);
  }
  //Unload all plugins 
  unloadPlugin();

  //Save for the last time
  if (testmode) {
    fs.writeFileSync(path.join(__dirname, "data-test.json"), JSON.stringify(global.data, null, 4));
  } else {
    fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(global.data, null, 4));
  }
  log("[INTERNAL]", "Saved data");

  //Close SSH connections
  for (var conn in global.sshstream) {
    try {
      global.sshstream[conn].close();
    } catch (ex) {
      log("[SSH]", conn, "is already closed. Skipping...");
    }
  }

  //Stop model server
  NSFWJS_MODEL_PROCESSES.stop();
  log("[INTERNAL]", "Closed local HTTP Model Server.");

  //Stop local SOCK2HTTP
  if (typeof localSocksProxy != "undefined") {
    localSocksProxy.close();
    log("[INTERNAL]", "Closed local SOCKS2HTTP proxy.");
  }

  log("[INTERNAL]", "Closing bot with code " + errorlevel + "..." + "\x1b[m\r\n");
  rl.setPrompt("\x1b[m");
}
//Handle SIGINT and SIGTERM
var signalHandler = function (signal) {
  log("[INTERNAL]", signal, "detected, triggering exit function...");
  process.exit();
}

process.on('SIGTERM', function () { signalHandler("SIGTERM"); }); //Ctrl+C but not on Windows?
process.on('SIGINT', function () { signalHandler("SIGINT"); }); //Ctrl+C?
process.on('SIGHUP', function () { signalHandler("SIGHUP"); }); //Windows Command Prompt close button?
rl.on('SIGTERM', function () { process.emit('SIGTERM'); });
rl.on('SIGINT', function () { process.emit('SIGINT'); });
process.on('exit', shutdownHandler);
