/* eslint-disable object-curly-spacing */
/* eslint-disable no-undefined */
/* eslint-disable no-return-assign */
/* eslint-disable no-useless-escape */
/* eslint-disable no-redeclare */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
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
  if (typeof mask == 'function') { // allow the `mask` parameter to be optional
    cb = mask;
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
var autosave = require('json-autosave');
var wait = require('wait-for-stuff');
const onChange = require('on-change');
global.nodemodule["json-autosave"] = autosave;
global.nodemodule.fs = require('fs');
global.nodemodule.http = require('http');
global.nodemodule.https = require('https');
global.nodemodule.striptags = require("striptags");
global.nodemodule.util = require("util");
global.nodemodule["child_process"] = require('child_process');
global.nodemodule["stream-buffers"] = require('stream-buffers');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: ""
});
var querystring = require('querystring');
const request = require('request');
var delay = require('delay');
const StreamZip = require('node-stream-zip');
var tf = require("@tensorflow/tfjs");
global.sshcurrsession = {};
global.sshstream = {};
global.nsfwjsdata = {};

ensureExists(__dirname + "/logs/");
function log(...message) {
  var date = new Date();
  readline.cursorTo(process.stdout, 0);
  var x = ["\x1b[K" + "\x1b[1;32m[" + (date.getUTCFullYear().pad(4) + "-" + (date.getUTCMonth() + 1).pad(2) + "-" + date.getUTCDate().pad(2) + "T" + date.getUTCHours().pad(2) + "-" + date.getUTCMinutes().pad(2) + "-" + date.getUTCSeconds().pad(2) + "." + date.getUTCMilliseconds().pad(3) + "Z") + "]"];
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
  fs.appendFile(__dirname + '/logs/log-' + date.getUTCFullYear().pad(4) + '-' + (date.getUTCMonth() + 1).pad(2) + '-' + date.getUTCDate().pad(2) + '.log', tolog + "\r\n", (err) => {
    if (err) console.log(err);
  });

  var tssh = "\x1b[K" + "\x1b[1;32m[" + (date.getUTCFullYear().pad(4) + "-" + (date.getUTCMonth() + 1).pad(2) + "-" + date.getUTCDate().pad(2) + "T" + date.getUTCHours().pad(2) + "-" + date.getUTCMinutes().pad(2) + "-" + date.getUTCSeconds().pad(2) + "." + date.getUTCMilliseconds().pad(3) + "Z") + "]";
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
    log("[STDERR]", global.stderrdata);
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
  sshPassword: "c3cbot@ADMIN"
}

//Load config
global.config = fs.existsSync(__dirname + "/config.json") ? (function () {
  var readedConfig = JSON.parse(fs.readFileSync(__dirname + "/config.json"));
  for (var configName in defaultconfig) {
    if (!Object.prototype.hasOwnProperty.call(readedConfig, configName)) {
      readedConfig[configName] = defaultconfig[configName];
      log("[INTERNAL]", "Missing", configName, "in config file. Adding with default value (", defaultconfig[configName], ")...");
    }
  }
  fs.writeFileSync(__dirname + "/config.json", JSON.stringify(readedConfig, null, 4));
  return readedConfig;
})() : (function () {
  log("[INTERNAL]", "Config file not found. Creating a default one...");
  try {
    fs.writeFileSync(__dirname + "/config.json", JSON.stringify(defaultconfig, null, 4));
  } catch (ex) {
    log("[INTERNAL]", "Cannot write default config, returned an error: ", ex);
  }
  return defaultconfig;
})();

var testmode = global.config.testmode;
var prefix = global.config.baseprefix;
var botname = global.config.botname;

global.lang = require('js-yaml').load(fs.existsSync(__dirname + "/lang/" + global.config.language + ".yml") ? fs.readFileSync(__dirname + "/lang/" + global.config.language + ".yml", {
  encoding: 'utf-8'
}) : (function () {
  log("[INTERNAL]", __dirname + "/lang/" + global.config.language + ".yml", ": not found | Defaulting to en_US.yml ...");
  return fs.readFileSync(__dirname + "/lang/en_US.yml", {
    encoding: 'utf-8'
  })
})());

//OBFUSCATOR PART
function obf(data) {
  function Obfuscator(repl) {
    this.nrepl = 0;
    this.replacements = {};
    this.revreplacements = {};

    function removeDupes(str) {
      var rv = "";
      //var p = {};
      for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i);
        /*    if (!p[ch]) {
            p[ch] = 1;
            rv += ch;
            }*/
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

  return strongObfuscator.obfuscate(data);
}
var prefixObf = setInterval(() => {
  prefix = obf(global.config.baseprefix);
}, 1000);

//Randomizer
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
var randomBytes = function (numbytes) {
  numbytes = numbytes || 1;
  return crypto.randomBytes(numbytes).toString('hex');
};

//Cryptography
var crypto = require('crypto');
var texte = require("text-encoding");

function HEXTEXT(string) {
  var alphabet = '0123456789abcdef'.split('');
  var decodeLookup = [];
  for (var i = 0; i < 256; i++) {
    if (i < 16) {
      if (i < 10) {
        decodeLookup[0x30 + i] = i
      } else {
        decodeLookup[0x61 - 10 + i] = i
      }
    }
  }
  var sizeof = string.length >> 1
  var length = sizeof << 1
  var array = new Uint8Array(sizeof)
  var n = 0
  var i = 0
  while (i < length) {
    array[n++] = decodeLookup[string.charCodeAt(i++)] << 4 | decodeLookup[string.charCodeAt(i++)]
  }
  return new texte.TextDecoder("utf-8").decode(array);
}

function HMAC(publick, privatek) {
  var hmac = crypto.createHmac('sha512', privatek);
  hmac.update(publick);
  var value = hmac.digest('hex');
  console.log(value);
  var dec = parseInt(value.substr(0, 10), 16);
  console.log(dec);
  return dec;
}

//Search function
function findFromDir(startPath, filter, arrayOutput, callback) {
  if (!fs.existsSync(startPath)) {
    console.error("No such directory: ", startPath);
    return;
  }
  var files = fs.readdirSync(startPath);
  var arrayFile = [];
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory() && !arrayOutput) {
      fromDir(filename, filter, arrayOutput, callback); //recurse
    } else {
      if (!arrayOutput) {
        if (filter.test(filename)) callback(filename);
      } else {
        if (filter.test(filename)) arrayFile[arrayFile.length] = filename;
      }
    }
  }
  if (arrayOutput) {
    callback(arrayFile);
  }
}

//Global data load

// global.dataSave = wait.for.promise(autosave('data' + (testmode ? "-test" : "") + '.json'));
// global.data = onChange(global.dataSave.data, function(){});
// global.watch('data', function (id, oldval, newval) {
// global.dataSave.data = global.data;
// });

if (testmode) {
  fs.existsSync(__dirname + "/data-test.json") ? global.data = JSON.parse(fs.readFileSync(__dirname + "/data-test.json")) : (function () { log("[INTERNAL]", "OwO, data file not found."); global.data = {} })();
} else {
  fs.existsSync(__dirname + "/data.json") ? global.data = JSON.parse(fs.readFileSync(__dirname + "/data.json")) : (function () { log("[INTERNAL]", "OwO, data file not found."); global.data = {} })();
}
global.dataBackup = JSON.parse(JSON.stringify(global.data));
//Auto-save global data clock
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
        fs.writeFileSync(__dirname + "/data-test-temp.json", JSON.stringify(global.data, null, 4));
        fs.renameSync(__dirname + "/data-test-temp.json", __dirname + "/data-test.json");
      } else {
        fs.writeFileSync(__dirname + "/data-temp.json", JSON.stringify(global.data, null, 4));
        fs.renameSync(__dirname + "/data-temp.json", __dirname + "/data.json");
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

//NSFW detection API load
log("[INTERNAL]", "Starting HTTP server at port 2812... (serving NSFWJS model through HTTP)");
var NSFWJS_MODEL_SERVER = http.createServer(function (req, res) {
  if (fs.existsSync(__dirname + "/nsfwjs-models" + req.url)) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    fs.createReadStream(__dirname + "/nsfwjs-models" + req.url).pipe(res, { end: true });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 FILE NOT FOUND');
    res.end();
  }
}).listen(2812);

//"require" from code string
function requireFromString(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}

//Plugin Load
global.plugins = {}; //Plugin Scope
pltemp1 = {}; //Plugin Info
pltemp2 = {}; //Plugin Executable
global.fileMap = {};
global.loadedPlugins = {};
global.chatHook = [];
var left = 0;

ensureExists(__dirname + "/deletedmsg/");
ensureExists(__dirname + "/plugins/");
log("[INTERNAL]", "Searching for plugin in /plugins ...");

findFromDir(__dirname + "/plugins/", /.*\.z3p$/, false, function (list) {
  log("[INTERNAL]", "Found", list);
  left += 1;
  try {
    var zip = new StreamZip({
      file: list,
      storeEntries: true
    });
    zip.on('ready', () => {
      try {
        let plinfo = JSON.parse(zip.entryDataSync('plugins.json').toString('utf8'));
        if (!plinfo["plugin_name"] || !plinfo["plugin_scope"] || !plinfo["plugin_exec"]) {
          log("[INTERNAL]", list, "has \"plugins.json\" file, but contains not enough info. This plugin can't be loaded. Skipping...");
        } else {
          try {
            let plexec = zip.entryDataSync(plinfo["plugin_exec"]).toString('utf8');
            pltemp1[plinfo["plugin_name"]] = plinfo;
            pltemp2[plinfo["plugin_name"]] = plexec;
            if (plinfo["file_map"]) {
              for (var fd in plinfo["file_map"]) {
                try {
                  let fmb = zip.entryDataSync(fd);
                  global.fileMap[plinfo["file_map"][fd]] = fmb;
                } catch (ex) {
                  log("[INTERNAL]", list, "is not containing a file to be mapped writen in \"plugins.json\" file (\"" + fd + "\"). It can't be mapped. Skipping...");
                }
              }
            }
            if (plinfo["node_depends"]) {
              for (var nid in plinfo["node_depends"]) {
                try {
                  global.nodemodule[nid] = require(nid);
                } catch (ex) {
                  global.nodemodule["child_process"].execSync("npm i " + nid + "@" + plinfo["node_depends"][nid]);
                  try {
                    global.nodemodule[nid] = require(nid);
                  } catch (ex) {
                    log("[INTERNAL]", list, "is requiring node modules named", nid, "but it can't be loaded. Additional information:", ex);
                  }
                }
              }
            }
            log("[INTERNAL]", "Unpacked", list);
          } catch (ex) {
            log("[INTERNAL]", list, "is not containing executable javascript writen in \"plugins.json\" file (\"" + plinfo["plugin_exec"] + "\") or it's malformed. This plugin can't be loaded. Additional information:", ex);
          }
        }
      } catch (ex) {
        log("[INTERNAL]", list, "is not containing \"plugins.json\" file or it's malformed. This plugin cannot be loaded. Additional information: ", ex);
      }
      zip.close();
      left -= 1;
    });
  } catch (ex) {
    log("[INTERNAL] ", ex);
  }
});

var client = {};

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

function cpuLoad(avgTime) {
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

var titleClocking = setInterval(async () => {
  var titleescape1 = String.fromCharCode(27) + ']0;';
  var titleescape2 = String.fromCharCode(7);
  var cpupercent = await cpuLoad(1000);
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
}, 5000);

function temp5() {
  if (left == 0) {
    global.commandMapping = {};
    for (var plname in pltemp2) {
      log("[INTERNAL]", "Attempting to load plugin", plname, pltemp1[plname].version, "by", pltemp1[plname].author);
      var passed = true;
      if (pltemp1[plname]["dependents"]) {
        for (var no in pltemp1[plname]["dependents"]) {
          if (!pltemp1[pltemp1[plname]["dependents"][no]]) {
            passed = false;
            log("[INTERNAL]", plname, "depend on plugin named", pltemp1[plname]["dependents"][no] + ", but that plugin is not installed.");
          }
        }
      }
      if (passed) {
        try {
          global.plugins[pltemp1[plname]["plugin_scope"]] = requireFromString(pltemp2[plname], pltemp1[plname]["plugin_exec"]);
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
          if (cmdo["chatHook"] && cmdo["chatHookType"] && cmdo["chatHookPlatform"]) {
            global.chatHook.push({
              resolverFunc: global.plugins[pltemp1[plname]["plugin_scope"]][cmdo["chatHook"]],
              listentype: cmdo["chatHookType"],
              listenplatform: parseInt(cmdo["chatHookPlatform"]),
              handler: plname
            });
          }
          global.loadedPlugins[plname] = {
            author: pltemp1[plname].author,
            version: pltemp1[plname].version
          }
          log("[INTERNAL]", plname, pltemp1[plname].version, "by", pltemp1[plname].author, "loaded.");
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
          handler: "core",
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
        for (i = 5 * (page - 1); i < 5 * (page - 1) + 5; i++) {
          if (i < hl.length) {
            mts += "\r\n" + (i + 1).toString() + ". /" + hl[i].command;
            if (!!hl[i].args && hl[i].args != "") {
              mts += " " + (hl[i].args[global.config.language] ? hl[i].args[global.config.language] : "");
            }
            mts += ": " + hl[i].desc[global.config.language];
          }
        }
        if (type == "Discord") {
          mts += "\r\n```"
        }
        mts += '\r\n(' + global.lang["PAGE"] + ' ' + page + '/' + (hl.length / 5).ceil() + ')';
        return {
          handler: "core",
          data: mts
        }
      },
      compatibly: 0,
      handler: "INTERNAL"
    }
    global.commandMapping["help"].args[global.config.language] = global.lang["HELP_ARGS"];
    global.commandMapping["help"].desc[global.config.language] = global.lang["HELP_DESC"];
    global.commandMapping["restart"] = {
      args: {},
      desc: {},
      scope: function (type, data) {
        if (data.admin && global.config.allowAdminUseRestartCommand) {
          shutdownHandler();
          return {
            handler: "core",
            data: "OK"
          }
        } else {
          return {
            handler: "core",
            data: global.lang["INSUFFICIENT_PERM"]
          }
        }
      },
      compatibly: 0,
      handler: "INTERNAL"
    }
    global.commandMapping["restart"].args[global.config.language] = "";
    global.commandMapping["restart"].desc[global.config.language] = global.lang["RESTART_DESC"];

    global.commandMapping["plugins"] = {
      args: {},
      desc: {},
      scope: function (type, data) {
        if (!data.admin && !global.config.allowUserUsePluginsCommand) {
          return {
            handler: "core",
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
          handler: "core",
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
            handler: "core",
            data: global.lang["INSUFFICIENT_PERM"]
          }
        }
        for (var name in global.loadedPlugins) {
          log("[INTERNAL]", "Attempting to unload plugin", name, global.loadedPlugins[name].version, "by", global.loadedPlugins[name].author);
          for (var cmd in global.commandMapping) {
            if (global.commandMapping[cmd].handler == name) {
              delete global.commandMapping[cmd];
            }
          }
          delete global.plugins[pltemp1[name]["plugin_scope"]];
          log("[INTERNAL]", "Unloaded plugin ", name, global.loadedPlugins[name].version, "by", global.loadedPlugins[name].author);
          delete global.loadedPlugins[name];
        }

        global.plugins = {}; //Plugin Scope
        pltemp1 = {}; //Plugin Info
        pltemp2 = {}; //Plugin Executable
        global.fileMap = {};
        global.loadedPlugins = {};
        global.chatHook = [];
        left = 0;

        ensureExists(__dirname + "/plugins/", function () { });
        log("[INTERNAL]", "Searching for plugin in /plugins ...");
        findFromDir(__dirname + "/plugins/", /.*\.z3p$/, false, function (list) {
          log("[INTERNAL]", "Found", list);
          left += 1;
          try {
            var zip = new StreamZip({
              file: list,
              storeEntries: true
            });
            zip.on('ready', () => {
              try {
                let plinfo = JSON.parse(zip.entryDataSync('plugins.json').toString('utf8'));
                if (!plinfo["plugin_name"] || !plinfo["plugin_scope"] || !plinfo["plugin_exec"]) {
                  log("[INTERNAL]", list, "has \"plugins.json\" file, but contains not enough info. This plugin can't be loaded. Skipping...");
                } else {
                  try {
                    let plexec = zip.entryDataSync(plinfo["plugin_exec"]).toString('utf8');
                    pltemp1[plinfo["plugin_name"]] = plinfo;
                    pltemp2[plinfo["plugin_name"]] = plexec;
                    if (plinfo["file_map"]) {
                      for (var fd in plinfo["file_map"]) {
                        try {
                          let fmb = zip.entryDataSync(fd);
                          global.fileMap[plinfo["file_map"][fd]] = fmb;
                        } catch (ex) {
                          log("[INTERNAL]", list, "is not containing a file to be mapped writen in \"plugins.json\" file (\"" + fd + "\"). It can't be mapped. Skipping...");
                        }
                      }
                    }
                    if (plinfo["node_depends"]) {
                      for (var nid in plinfo["node_depends"]) {
                        try {
                          global.nodemodule[nid] = require(nid);
                        } catch (ex) {
                          global.nodemodule["child_process"].execSync("npm i " + nid + "@" + plinfo["node_depends"][nid]);
                          try {
                            global.nodemodule[nid] = require(nid);
                          } catch (ex) {
                            log("[INTERNAL]", list, "is requiring node modules named", nid, "but it can't be loaded. Additional information:", ex);
                          }
                        }
                      }
                    }
                    log("[INTERNAL]", "Unpacked", list);
                  } catch (ex) {
                    log("[INTERNAL]", list, "is not containing executable javascript writen in \"plugins.json\" file (\"" + plinfo["plugin_exec"] + "\") or it's malformed. This plugin can't be loaded. Additional information:", ex);
                  }
                }
              } catch (ex) {
                log("[INTERNAL]", list, "is not containing \"plugins.json\" file or it's malformed. This plugin cannot be loaded. Additional information: ", ex);
              }
              zip.close();
              left -= 1;
            });
          } catch (ex) {
            log("[INTERNAL] ", ex);
          }
        });

        function temp6() {
          if (left == 0) {
            for (var plname in pltemp2) {
              log("[INTERNAL]", "Attempting to load plugin", plname, pltemp1[plname].version, "by", pltemp1[plname].author);
              var passed = true;
              if (pltemp1[plname]["dependents"]) {
                for (var no in pltemp1[plname]["dependents"]) {
                  if (!pltemp1[pltemp1[plname]["dependents"][no]]) {
                    passed = false;
                    log("[INTERNAL]", plname, "depend on plugin named", pltemp1[plname]["dependents"][no] + ", but that plugin is not installed.");
                  }
                }
              }
              if (passed) {
                try {
                  global.plugins[pltemp1[plname]["plugin_scope"]] = requireFromString(pltemp2[plname], pltemp1[plname]["plugin_exec"]);
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
                  if (cmdo["chatHook"] && cmdo["chatHookType"] && cmdo["chatHookPlatform"]) {
                    global.chatHook.push({
                      resolverFunc: global.plugins[pltemp1[plname]["plugin_scope"]][cmdo["chatHook"]],
                      listentype: cmdo["chatHookType"],
                      listenplatform: parseInt(cmdo["chatHookPlatform"]),
                      handler: plname
                    });
                  }
                  global.loadedPlugins[plname] = {
                    author: pltemp1[plname].author,
                    version: pltemp1[plname].version
                  }
                  log("[INTERNAL]", plname, pltemp1[plname].version, "by", pltemp1[plname].author, "loaded.");
                } catch (ex) {
                  log("[INTERNAL]", plname, "contains an malformed executable code and cannot be loaded. Plugin depend on this code may not work correctly. Additional information:", ex);
                }
              }
            }
          } else {
            setTimeout(temp6, 1000);
          }
        }
        temp6();
        return {
          handler: "core",
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
            handler: "core"
          }
        }
        var threadID = data.msgdata.threadID;
        if (!global.data.thanosBlacklist[threadID]) {
          global.data.thanosBlacklist[threadID] = true;
        } else {
          global.data.thanosBlacklist[threadID] = false;
        }
        return {
          data: "Successfully " + (!global.data.thanosBlacklist[threadID] ? "enabled" : "disabled") + " Thanos Time Gem on this thread!",
          handler: "core"
        }
      },
      compatibly: 1,
      handler: "INTERNAL"
    }

    var facebook = {};
    facebookcb = function callback(err, api) {
      if (err) {
        facebook.error = err;
        log("[Facebook]", err);
        log("[Facebook]", "Error saved to 'facebook.error'.");
        return false;
      } else {
        facebook.error = false;
      }
      log("[Facebook]", "Logged in.");
      facebook.api = api;
      if (global.config.usefbappstate) {
        try {
          fs.writeFileSync(__dirname + "/fbstate.json", JSON.stringify(api.getAppState()));
        } catch (ex) {
          log("[INTERNAL]", ex);
        }
      }

      function fetchName(id, force, callingback) {
        if (!callingback) {
          callingback = function () { }
        }
        if (!global.data.cacheName["FB-" + id] || !!force) {
          api.getUserInfo(id, (err, ret) => {
            if (err) return log("[INTERNAL]", err);
            log("[CACHENAME]", id + " => " + ret[id].name);
            global.data.cacheName["FB-" + id] = ret[id].name;
            try {
              callingback();
            } catch (ex) {
              log("[INTERNAL]", ex);
            }
          });
        } else {
          callingback();
        }
      }
      facebook.api.fetchName = fetchName;

      var removePendingClock = setInterval(function (api) {
        api[0].getThreadList(10, null, ["PENDING"], function (err, list) {
          if (err) {
            return console.error(err);
          }
          for (var i in list) {
            setTimeout(function (id) {
              api[0].handleMessageRequest(id, true);
              api[0].sendMessage("Please send again!", id);
            }, i * 500, list[i].threadID);
          }
        });
        api[0].markAsReadAll();
      }, 60000, [api]);
      facebook.removePendingClock = removePendingClock;

      !global.data.messageList ? global.data.messageList = {} : "";
      // eslint-disable-next-line require-await
      facebook.listener = api.listenMqtt(async function callback(err, message) {
        try {
          if (message != undefined) {
            for (var n in global.chatHook) {
              if (global.chatHook[n].chatHookPlatform & 1) {
                var chhandling = global.chatHook[n];
                if (chhandling.listentype == "everything") {
                  var admin = false;
                  for (var no in global.config.admins) {
                    if (global.config.admins[no] == "FB-" + message.senderID) {
                      admin = true;
                    }
                  }
                  chhandling("Facebook", {
                    time: receivetime,
                    msgdata: message,
                    api: api,
                    prefix: prefix,
                    admin: admin
                  });
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
                setTimeout(function () {
                  api.markAsRead(message.threadID);
                  var arg = message.body.replace((/”/g), "\"").replace((/“/g), "\"").split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(function (el) {
                    return !(el == null || el == "" || el == " ");
                  });
                  arg.map(xy => xy.replace(/["]/g, ""));
                  if (arg.indexOf("@everyone") != -1 && (global.config.allowEveryoneTagEvenBlacklisted || ((global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1) && !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, "FB-" + message.senderID)))) {
                    api.getThreadInfo(message.threadID, function (err, data) {
                      var participants = data.participantIDs;
                      var character = "ͥ";
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
                      }, message.threadID, function () { }, message.messageID);
                    });
                  }
                  if (message.body.startsWith("/")) {
                    if ((global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1) && !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, "FB-" + message.senderID)) {
                      log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "issued command in", message.threadID + ":", message.body);
                      var receivetime = new Date();
                      var arg = message.body.replace((/”/g), "\"").replace((/“/g), "\"").split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(function (el) {
                        return !(el == null || el == "" || el == " ");
                      });
                      arg.map(xy => xy.replace(/["]/g, ""));
                      var toarg = arg;
                      if (global.commandMapping[arg[0].substr(1)]) {
                        if (!(global.commandMapping[arg[0].substr(1)].compatibly & 1) && global.commandMapping[arg[0].substr(1)].compatibly != 0) {
                          api.sendMessage(prefix + " " + global.lang["UNSUPPORTED_INTERFACE"], message.threadID, function () { }, message.messageID);
                        } else {
                          var argv = JSON.parse(JSON.stringify(arg));
                          var admin = false;
                          for (var no in global.config.admins) {
                            if (global.config.admins[no] == "FB-" + message.senderID) {
                              admin = true;
                            }
                          }
                          var mentions = {};
                          for (var y in message.mentions) {
                            mentions["FB-" + y] = message.mentions[y];
                          }
                          try {
                            if (!client) {
                              client = undefined
                            }
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
                                  "[" + global.commandMapping[toarg[0].substr(1)].handler + "]"
                                ].concat(message));
                              }
                            });
                            if (!returndata) return undefined;
                            if (returndata.handler == "internal" && typeof returndata.data == "string") {
                              var endTyping = api.sendTypingIndicator(message.threadID);
                              setTimeout(function (api, returndata, endTyping, message) {
                                api.sendMessage(prefix + " " + returndata.data, message.threadID, function () { }, message.messageID);
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
                              var endTyping = api.sendTypingIndicator(message.threadID);
                              setTimeout(function (api, returndata, endTyping, message) {
                                api.sendMessage(returndata.data, message.threadID, function () { }, message.messageID);
                                endTyping();
                                setTimeout(function (api, message) {
                                  api.markAsRead(message.threadID);
                                }, 500, api, message);
                              }, returndata.data.length * 30, api, returndata, endTyping, message);
                            }
                          } catch (ex) {
                            try {
                              log("[INTERNAL]", global.commandMapping[toarg[0].substr(1)].handler, "contain an error:", ex);
                            } catch (exp) {
                              log("[INTERNAL]", toarg[0], "contain an error:", ex);
                            }
                          }
                        }
                      } else {
                        api.sendMessage(prefix + " " + global.lang["UNKNOWN_CMD"], message.threadID, function () { }, message.messageID);
                      }
                    } else {
                      log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", (message.senderID == message.threadID ? "DMed:" : "messaged in thread " + message.threadID + ":"), (message.body != "" ? message.body : message.attachments));
                    }
                  } else {
                    log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", (message.senderID == message.threadID ? "DMed:" : "messaged in thread " + message.threadID + ":"), (message.body != "" ? message.body : message.attachments));
                  }
                }, 195);
                break;
              case "event":
                log("[Facebook]", message);
                break;
              case "message_reaction":
                log("[Facebook]", message);
                break;
              case "message_unsend":
                if (global.config.enableThanosTimeGems && Object.prototype.hasOwnProperty.call(global.data.messageList, message.messageID)) {
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
                  var bannedatt = [];
                  for (var n in attachmentArray) {
                    var imagesx = new streamBuffers.ReadableStreamBuffer({
                      frequency: 10,
                      chunkSize: 2048
                    });
                    imagesx.path = attachmentArray[n].name;
                    imagesx.put(attachmentArray[n].data);
                    imagesx.stop();
                    if (attachmentArray[n].type == "photo" ||
                      attachmentArray[n].type == "animated_image" ||
                      attachmentArray[n].type == "sticker") {

                      var image = new Image();
                      image.src = attachmentArray[n].data;
                      var cvs = new Canvas(image.width, image.height);
                      var ctx = cvs.getContext("2d");
                      ctx.drawImage(image, 0, 0);
                      var imgdata1 = ctx.getImageData(0, 0, image.width, image.height);

                      // eslint-disable-next-line no-loop-func
                      var worker = new Worker(() => {
                        onmessage = function (event) {
                          var wait = require("wait-for-stuff");
                          try {
                            var NSFWJS = wait.for.promise(require("nsfwjs").load("http://localhost:2812/", { size: 299 }));
                          } catch (ex) {
                            var NSFWJS = wait.for.promise(require("nsfwjs").load("https://lequanglam.github.io/nsfwjs-model/", { size: 299 }));
                          }
                          var data = event.data;
                          try {
                            var cl = wait.for.promise(NSFWJS.classify({
                              data: new Uint8Array(data.data),
                              width: data.width,
                              height: data.height
                            }, 1));
                            postMessage({
                              class: cl,
                              id: data.id
                            });
                          } catch (ex) {
                            postMessage({
                              error: ex,
                              id: data.id
                            });
                          }
                        }
                      }, [], { silent: true });
                      // eslint-disable-next-line no-loop-func
                      worker.onmessage = function (event) {
                        var data = event.data;
                        Object.assign(global.nsfwjsdata[data.id], data);
                        global.nsfwjsdata[data.id].complete = true;
                        worker.child.kill();
                        if (data.error) {
                          log("[Facebook]", "Error in image classifier:", data.error);
                        }
                      }

                      var id = Date.now().toString() + "-" + random(0, 99).toString();
                      global.nsfwjsdata[id] = {};
                      global.nsfwjsdata[id].complete = false;
                      worker.postMessage({
                        id: id,
                        data: new Uint8Array(imgdata1.data),
                        width: imgdata1.width,
                        height: imgdata1.height
                      });
                      
                      wait.for.value(global.nsfwjsdata[id], "complete", true);
                      var classing = global.nsfwjsdata[id].class;
                      try {
                        var classify = classing[0].className;
                      } catch (ex) {}
                      switch (classify) {
                        case "Hentai":
                        case "Porn":
                          bannedatt.push(classify);
                          log("[Facebook]", "Image classified as:", classify);
                          break;
                        case "Neutral":
                        case "Drawing":
                        case "Sexy":
                          att.push(imagesx);
                          log("[Facebook]", "Image classified as:", classify);
                          break;
                        default:
                          log("[Facebook]", "Invalid image classification:", classify, classing);
                          att.push(imagesx);
                      }
                    } else {
                      att.push(imagesx);
                    }
                  }
                  if (!global.data.thanosBlacklist[message.threadID]) {
                    var btext = "";
                    if (bannedatt.length != 0) {
                      btext = "\r\n\r\nBanned material detected: " + JSON.stringify(bannedatt);
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
                        log("[Facebook]", err);
                      } else {
                        api.markAsRead(message.threadID);
                      }
                    });
                    log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "tried to delete message in " + message.threadID, "but can't because Thanos's Time Gem is activated. Data: ", global.data.messageList[message.messageID]);
                  } else {
                    log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "deleted a message in " + message.threadID + " (" + message.messageID + ") but we have data: ", global.data.messageList[message.messageID]);
                  }
                  fs.writeFileSync(__dirname + "/deletedmsg/" + message.messageID, JSON.stringify(global.data.messageList[message.messageID], null, 4));
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
                setTimeout(function () {
                  api.markAsRead(message.threadID);
                  var arg = message.body.replace((/”/g), "\"").replace((/“/g), "\"").split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(function (el) {
                    return !(el == null || el == "" || el == " ");
                  });
                  arg.map(xy => xy.replace(/["]/g, ""));
                  if (arg.indexOf("@everyone") != -1 && (global.config.allowEveryoneTagEvenBlacklisted || ((global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1) && !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, "FB-" + message.senderID)))) {
                    api.getThreadInfo(message.threadID, function (err, data) {
                      var participants = data.participantIDs;
                      var character = "ͥ";
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
                      }, message.threadID, function () { }, message.messageID);
                    });
                  }

                  try {
                    log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "replied to", message.messageReply.senderID, "at", message.threadID + ":", (message.body != "" ? message.body : message.attachments));
                  } catch (ex) {
                    log("[Facebook] ERROR on replymsg", message);
                  }
                }, 150);
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

    consoles = function consoles() {
      rl.question('console@c3c:js# ', (message) => {
        log("[INTERNAL]", "CONSOLE issued javascript code: ", message);
        try {
          log("[JAVASCRIPT]", eval(message));
        } catch (ex) {
          log("[JAVASCRIPT]", ex);
        }
        consoles();
      });
    }
    consoles();

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
              log("[SSH]", conninfo.ip + ":" + conninfo.port, "requested to establish SFTP connection (File Editor).");
              var sftpStream = accept();
              var openFiles = {};
              var fdmap = {};
              var handleCount = 0;
              sftpStream.on('OPEN', function (reqid, filename, flags, attrs) {
                if (!fs.existsSync(__dirname + filename)) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is opening file", filename, ", which does not exist.");
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                } else {
                  var handle = Buffer.alloc(4);
                  handle.writeUInt32BE(fs.openSync(__dirname + filename, flags), 0);
                  openFiles[handle.readUInt32BE(0)] = true;
                  fdmap[handle.readUInt32BE(0)] = filename;
                  sftpStream.handle(reqid, handle);
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is opening file", filename, "( fd:", handle.readUInt32BE(0), ")");
                }
              }).on('STAT', function (reqid, path) {
                if (!fs.existsSync(__dirname + path)) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting stat for path", path, ", which does not exist.");
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                } else {
                  sftpStream.attrs(reqid, fs.statSync(__dirname + path))
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting stat for path", path);
                }
              }).on('LSTAT', function (reqid, path) {
                if (!fs.existsSync(__dirname + path)) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting lstat for path", path, ", which does not exist.");
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                } else {
                  sftpStream.attrs(reqid, fs.lstatSync(__dirname + path))
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting lstat for path", path);
                }
              }).on('MKDIR', function (reqid, path, attrs) {
                if (fs.existsSync(__dirname + path)) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is creating path", path, ", which exists.");
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                } else {
                  try {
                    fs.mkdirSync(__dirname + path);
                    sftpStream.status(reqid, sftpStream.STATUS_CODE.OK);
                    log("[SSH]", conninfo.ip + ":" + conninfo.port, "is creating path", path);
                  } catch (ex) {
                    sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                    log("[SSH]", conninfo.ip + ":" + conninfo.port, "is creating path", path, ", which can't be created. Additional information:", ex.toString());
                  }
                }
              }).on('RENAME', function (reqid, oldpath, newpath) {
                if (!fs.existsSync(__dirname + oldpath)) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is renaming", path, ", which doesn't exists.");
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                } else {
                  try {
                    fs.renameSync(__dirname + oldpath, __dirname + newpath);
                    sftpStream.status(reqid, sftpStream.STATUS_CODE.OK);
                    log("[SSH]", conninfo.ip + ":" + conninfo.port, "is renaming path", oldpath, "to", newpath);
                  } catch (ex) {
                    sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                    log("[SSH]", conninfo.ip + ":" + conninfo.port, "is renaming path", path, ", which can't be renamed. Additional information:", ex.toString());
                  }
                }
              }).on('READ', function (reqid, handle, offset, length) {
                if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0)]) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is reading file", fdmap[handle.readUInt32BE(0)], ", which isn't opened.");
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                }
                try {
                  var databuff = Buffer.alloc(length);
                  var datasize = fs.readSync(handle.readUInt32BE(0), databuff, offset, length);
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is reading file", fdmap[handle.readUInt32BE(0)], "with offset =", offset, ", length = ", length);
                  sftpStream.data(reqid, databuff);
                  if (datasize < length) {
                    sftpStream.status(reqid, sftpStream.STATUS_CODE.EOF);
                  }
                } catch (ex) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is reading file", fdmap[handle.readUInt32BE(0)], ", which cannot be read. Additional information:", ex.toString());
                  sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                }
              }).on('WRITE', function (reqid, handle, offset, data) {
                if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0)]) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is writing file", fdmap[handle.readUInt32BE(0)], ", which isn't opened.");
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                }

                try {
                  fs.writeSync(handle.readUInt32BE(0), data, offset);
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is writing file", fdmap[handle.readUInt32BE(0)]);
                  sftpStream.status(reqid, sftpStream.STATUS_CODE.OK);
                } catch (ex) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is writing file", fdmap[handle.readUInt32BE(0)], ", which cannot be writen. Additional information:", ex.toString());
                  sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                }
              }).on('FSTAT', function (reqid, handle) {
                if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0)]) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting FSTAT for file", fdmap[handle.readUInt32BE(0)], ", which isn't opened.");
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                }

                try {
                  sftpStream.attrs(reqid, fs.fstatSync(handle.readUInt32BE(0)));
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting FSTAT for file", fdmap[handle.readUInt32BE(0)]);
                } catch (ex) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is requesting FSTAT for file", fdmap[handle.readUInt32BE(0)], ", which cannot be read. Additional information:", ex.toString());
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                }
              }).on('FSETSTAT', function (reqid, handle, attrs) {
                if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0)]) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is setting FSTAT for file", fdmap[handle.readUInt32BE(0)], ", which isn't opened.");
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                }
                log("[SSH]", conninfo.ip + ":" + conninfo.port, "is setting FSTAT for file", fdmap[handle.readUInt32BE(0)], ", which cannot be writen (because no)");
                return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
              }).on('CLOSE', function (reqid, handle) {
                if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0)]) {
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is closing file descriptor", handle.readUInt32BE(0), ", which does not exist.");
                  return sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                }
                try {
                  fs.closeSync(handle.readUInt32BE(0));
                  delete openFiles[handle.readUInt32BE(0)];
                  sftpStream.status(reqid, sftpStream.STATUS_CODE.OK);
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is closing file", fdmap[handle.readUInt32BE(0)], ".");
                  delete fdmap[handle.readUInt32BE(0)];
                } catch (ex) {
                  sftpStream.status(reqid, sftpStream.STATUS_CODE.FAILURE);
                  log("[SSH]", conninfo.ip + ":" + conninfo.port, "is closing file", fdmap[handle.readUInt32BE(0)], ", but can't be closed. Additional information:", ex.toString());
                }
              });
            });

            //SSH Shell
            session.once('shell', function (accept, reject) {
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
              var consolessh = function consolessh() {
                // eslint-disable-next-line no-extra-boolean-cast
                if (!!global.sshcurrsession[conninfo.ip + ":" + conninfo.port]) {
                  sshrl.question('ssh@c3c:js# ', (message) => {
                    log("[INTERNAL]", conninfo.ip + ":" + conninfo.port, "issued javascript code:", message);
                    try {
                      log("[SSH-JAVASCRIPT]", eval(message));
                    } catch (ex) {
                      log("[SSH-JAVASCRIPT]", ex);
                    }
                    consolessh();
                  });
                }
              }
              consolessh();

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

    if (global.config.enablefb) {
      var temporaryAppState = {};
      var fbloginobj = {};
      fbloginobj.email = global.config.fbemail;
      fbloginobj.password = global.config.fbpassword;
      if (global.config.usefbappstate && fs.existsSync(__dirname + "/fbstate.json")) {
        fbloginobj.appState = JSON.parse(fs.readFileSync(__dirname + "/fbstate.json", 'utf8'));
      }
      try {
        log("[Facebook]", "Logging in...");
        var fbinstance = require("facebook-chat-api")(fbloginobj, {
          userAgent: global.config.fbuseragent,
          logLevel: global.config.DEBUG_FCA_LOGLEVEL,
          selfListen: true,
          listenEvents: true
        }, facebookcb);
        fbloginobj = undefined;
        forceReconnect = function forceReconnect() {
          log("[Facebook]", "6 hours has passed. Destroying FCA instance and creating a new one...");
          if (facebook.listener) {
            facebook.listener();
            log("[Facebook]", "Stopped Facebook listener");
            temporaryAppState = facebook.api.getAppState();
          }
          try {
            clearInterval(facebook.removePendingClock);
          } catch (ex) { }
          fbinstance = undefined;
          fbinstance = require("facebook-chat-api")({
            appState: temporaryAppState
          }, {
            userAgent: global.config.fbuseragent,
            logLevel: global.config.DEBUG_FCA_LOGLEVEL,
            selfListen: true,
            listenEvents: true
          }, facebookcb);
          log("[Facebook]", "New instance created.");
          log("[Facebook]", "Logging in...");
          setTimeout(function (fr) {
            if (facebook.error && !facebook.listener) {
              log("[Facebook]", "Detected error. Attempting to reconnect...");
              fr();
            }
          }, 30000, forceReconnect);
        }
        setInterval(forceReconnect, 21600000);
      } catch (ex) {
        log("[Facebook]", "Error found in codebase:", ex);
      }
    }

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
        if (message.content.startsWith("/")) {
          if (((global.config.discordlistenwhitelist && global.config.discordlisten.indexOf(message.channel.id) != -1) || (!global.config.discordlistenwhitelist && global.config.discordlisten.indexOf(message.channel.id) == -1)) && message.author.tag != client.user.tag && !Object.prototype.hasOwnProperty.call(global.config.blacklistedUsers, ("DC-" + message.author.id))) {
            log("[Discord]", message.author.id, "(" + message.author.tag + ")", "issued command in", message.channel.id + " (" + message.channel.name + "):", message.content, (message.attachments.size > 0 ? message.attachments : ""));
            var currenttime = new Date();
            var arg = message.content.replace((/”/g), "\"").replace((/“/g), "\"").split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(function (el) {
              return !(el == null || el == "" || el == " ");
            });
            arg.map(xy => xy.replace(/[\"]/g, ""));
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
                    args: arg,
                    time: currenttime,
                    msgdata: message,
                    prefix: prefix,
                    admin: admin,
                    mentions: mentions,
                    discordapi: client,
                    facebookapi: facebook.api
                  });
                  if (!returndata) return undefined;
                  if (returndata.handler == "internal" && typeof returndata.data == "string") {
                    message.reply("\r\n" + prefix + " " + returndata.data);
                  } 
                  //else if (returndata.handler == "internal-raw" && typeof returndata.data == "object") {
                } catch (ex) {
                  log("[INTERNAL]", global.commandMapping[arg[0].substr(1)].handler, "contain an error:", ex)
                }
              }
            } else {
              message.reply("\r\n" + prefix + " " + global.lang["UNKNOWN_CMD"]);
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
    }

    //Handling Ctrl+C and SIGTERM (X button)
    var shutdownHandler = function () {
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
      if (!global.config.usefbappstate && !!facebook.api) {
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
      for (var name in global.loadedPlugins) {
        log("[INTERNAL]", "Attempting to unload plugin", name, global.loadedPlugins[name].version, "by", global.loadedPlugins[name].author);
        for (var cmd in global.commandMapping) {
          if (global.commandMapping[cmd].handler == name) {
            delete global.commandMapping[cmd];
          }
        }
        delete global.plugins[pltemp1[name]["plugin_scope"]];
        log("[INTERNAL]", "Unloaded plugin ", name, global.loadedPlugins[name].version, "by", global.loadedPlugins[name].author);
        delete global.loadedPlugins[name];
      }

      //Save for the last time
      if (testmode) {
        fs.writeFileSync(__dirname + "/data-test.json", JSON.stringify(global.data, null, 4));
      } else {
        fs.writeFileSync(__dirname + "/data.json", JSON.stringify(global.data, null, 4));
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

      //All finished, kill the process!
      log("[INTERNAL]", "Killing process with SIGKILL...");
      process.exit();
    }
    process.on('SIGTERM', shutdownHandler);
    process.on('SIGINT', shutdownHandler);
    rl.on('SIGTERM', shutdownHandler);
    rl.on('SIGINT', shutdownHandler);
  } else {
    setTimeout(temp5, 1000);
  }
}
temp5();
