/* eslint-disable no-undefined */
/* eslint-disable no-return-assign */
/* eslint-disable no-useless-escape */
/* eslint-disable no-redeclare */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
Number.prototype.pad = function(width, z) {
    z = z || '0';
    var n = this.valueOf() + '';
    return (n.length >= width ? n : (new Array(width - n.length + 1).join(z) + n));
}
Number.prototype.round = function(decimal) { var dec = decimal || 0; var dec2 = Math.pow(10, dec); var num = this.valueOf(); return Math.round(num * dec2) / dec2; };
Number.prototype.ceil = function(decimal) { var dec = decimal || 0; var dec2 = Math.pow(10, dec); var num = this.valueOf(); return Math.ceil(num * dec2) / dec2; };
Number.prototype.floor = function(decimal) { var dec = decimal || 0; var dec2 = Math.pow(10, dec); var num = this.valueOf(); return Math.floor(num * dec2) / dec2; };
var sizeObject = function(object) {
    return Object.keys(object).length;
};

global.nodemodule = {};
const fs = require('fs');
var path = require("path");
const util = require('util');
var streamBuffers = require('stream-buffers');
var syncrequest = require('sync-request');
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
  output: process.stdout
});
var querystring = require('querystring');
const request = require('request');
var delay = require('delay');
const StreamZip = require('node-stream-zip');

function log(...message) {
    var date = new Date();
    readline.cursorTo(process.stdout, 0);
    var x = ["\x1b[1;32m[" + (date.getUTCFullYear().pad(4) + "-" + (date.getUTCMonth()+1).pad(2) + "-" + date.getUTCDate().pad(2) + "T" + date.getUTCHours().pad(2) + "-" + date.getUTCMinutes().pad(2) + "-" + date.getUTCSeconds().pad(2) + "." + date.getUTCMilliseconds().pad(3) + "Z") + "]"];
    console.log.apply(console, x.concat(message))
    rl.prompt(true);
    var tolog = "[" + (date.getUTCFullYear().pad(4) + "-" + (date.getUTCMonth()+1).pad(2) + "-" + date.getUTCDate().pad(2) + "T" + date.getUTCHours().pad(2) + "-" + date.getUTCMinutes().pad(2) + "-" + date.getUTCSeconds().pad(2) + "." + date.getUTCMilliseconds().pad(3) + "Z") + "]";
    for (var n in message) {
        if (typeof message[n] == "object") {
            tolog += " " + util.format("%O", message[n]);
        } else {
            tolog += " " + util.format("%s", message[n]);
        }
    }
    fs.appendFile(__dirname + '/logging.log', tolog + "\r\n", (err) => {
        if (err) console.log(err);
    });
}

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
    fbuseragent: "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
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
        "DC-0"  //Replace 0 with Discord ID
    ],
    blacklistedUsers: [
        "FB-0", //Replace 0 with FBID
        "DC-0"  //Replace 0 with Discord ID
    ],
    allowAdminUseRestartCommand: false,
    allowUserUsePluginsCommand: false,
    allowUserUseReloadCommand: false,
    language: "en_US",
    enableThanosTimeGems: true, //Anti-Unsend
    allowEveryoneTagEvenBlacklisted: true
}

//Load config
global.config = fs.existsSync(__dirname + "/config.json") ? (function(){
    var readedConfig = JSON.parse(fs.readFileSync(__dirname + "/config.json"));
    for (var configName in defaultconfig) {
        if (!readedConfig.hasOwnProperty(configName)) {
            readedConfig[configName] = defaultconfig[configName];
            log("[INTERNAL]", "Missing", configName, "in config file. Adding with default value (", defaultconfig[configName], ")...");
        }
    }
    fs.writeFileSync(__dirname + "/config.json", JSON.stringify(readedConfig, null, 4));
    return readedConfig;
})() : (function(){
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

global.lang = require('js-yaml').load(fs.existsSync(__dirname + "/lang/" + global.config.language + ".yml") ? fs.readFileSync(__dirname + "/lang/" + global.config.language + ".yml", {encoding: 'utf-8'}) : (function(){log("[INTERNAL]", __dirname + "/lang/" + global.config.language + ".yml", ": not found | Defaulting to en_US.yml ..."); return fs.readFileSync(__dirname + "/lang/en_US.yml", {encoding: 'utf-8'})})());

//OBFUSCATOR PART
function obf(data) {
    function Obfuscator(repl) {
        this.nrepl = 0;
        this.replacements = {};
        this.revreplacements = {};
        
        function removeDupes(str) {
        var rv = "";
        //var p = {};
        for(var i = 0; i < str.length; i++) {
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
        
        for(var i = 0; i < repl.length; i++) {
            var r = repl[i];
            var original = r.charAt(0);
            var s = removeDupes(r);
            if (s.length > 1) {
                for(var j = 0; j < s.length; j++) {
                    this.replacements[s.charAt(j)] = s.substring(0, j) + s.substring(j + 1);
                    if (s.charAt(j) !== original) {
                        this.revreplacements[s.charAt(j)] = original;
                    }
                    this.nrepl++;
                }
            }
        }
    }

    Obfuscator.prototype.obfuscate = function(str) {
        str = str + "";
        var rv = "";
        for(var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            var r = this.replacements[c];
            if (r) {
                var j = Math.floor(Math.random()*(r.length-1));
                rv += r.charAt(r.charAt(j)==c?j+1:j);
            } else {
                rv += c;
            }
        }
        return rv;
    }

    Obfuscator.prototype.deobfuscate = function(str) {
        str = str + "";
        var rv = "";
        for(var i = 0; i < str.length; i++) {
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
var prefixObf = setInterval(() => { prefix = obf(global.config.baseprefix); }, 1000);

//Randomizer
var random = function(min, max) { 
    if (min > max) {
        var temp = min;
        min = max;
        max = temp;
    }
    var bnum = (max - min).toString(16).length / 2;
    if (bnum < 1) bnum = 1;
    return Math.round(parseInt(crypto.randomBytes(bnum).toString('hex'), 16) / Math.pow(16, bnum * 2) * (max - min)) + min; 
};
var randomBytes = function(numbytes) { numbytes = numbytes || 1; return crypto.randomBytes(numbytes).toString('hex'); };

//Cryptography
let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  log('[INTERNAL]', 'Crypto already built into Node.JS!');
}
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
function HMAC(publick, privatek){
    var hmac = crypto.createHmac('sha512', privatek);
    hmac.update(publick); 
    var value = hmac.digest('hex');
    console.log(value);
    var dec = parseInt(value.substr(0, 10), 16);
    console.log(dec);
    return dec; 
}

//Search function
function findFromDir(startPath, filter, arrayOutput, callback){
    if (!fs.existsSync(startPath)){
        console.error("No such directory: ", startPath);
        return;
    }
    var files = fs.readdirSync(startPath);
    var arrayFile = [];
    for (var i = 0; i < files.length; i++){
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory() && !arrayOutput){
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

//Check folder exists and create it 
function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        // eslint-disable-next-line no-octal
        mask = 0777;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

//Global data load
global.data = {};
if (testmode) {
    fs.existsSync(__dirname + "/data-test.json") ? global.data = JSON.parse(fs.readFileSync(__dirname + "/data-test.json")) : log("[INTERNAL]", "OwO, data file not found.");
} else {
    fs.existsSync(__dirname + "/data.json") ? global.data = JSON.parse(fs.readFileSync(__dirname + "/data.json")) : log("[INTERNAL]", "OwO, data file not found.");
}

//Auto-save global data clock
global.isDataSaving = false;
global.dataSavingTimes = 0;
var autosave = setInterval(function(testmode, log) {
    if (!global.isDataSaving || global.dataSavingTimes > 3) {
        if (global.dataSavingTimes > 3) {
            log("[INTERNAL]", "Auto-save clock is executing over 30 seconds. Attempting to restart the clock...");
            global.dataSavingTimes = 0;
        }
        global.isDataSaving = true;
        if (testmode) {
            fs.writeFile(__dirname + "/data-test.json", JSON.stringify(global.data, null, 4), function(err) {
                if (err) {
                    log("[INTERNAL]", "Auto-save encounted an error:", err);
                }
                global.isDataSaving = false;
            });
        } else {
            fs.writeFile(__dirname + "/data.json", JSON.stringify(global.data, null, 4), function(err) {
                if (err) {
                    log("[INTERNAL]", "Auto-save encounted an error:", err);
                }
                global.isDataSaving = false;
            });
        }
    } else {
        global.dataSavingTimes++;
    }
}, 10000, testmode, log);

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
var left = 0;

ensureExists(__dirname + "/plugins/", function(){});
log("[INTERNAL]", "Searching for plugin in /plugins ...");

findFromDir(__dirname + "/plugins/", /.*\.z3p$/, false, function(list) {
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
                        left -= 1;
                    } catch (ex) {
                        log("[INTERNAL]", list, "is not containing executable javascript writen in \"plugins.json\" file (\"" + plinfo["plugin_exec"] + "\") or it's malformed. This plugin can't be loaded. Additional information:", ex);
                    }
                }
            } catch (ex) {
                log("[INTERNAL]", list, "is not containing \"plugins.json\" file or it's malformed. This plugin cannot be loaded. Additional information: ", ex);
            }
            zip.close();
            blocking = false;
        });
    } catch(ex) {
        log("[INTERNAL] ", ex);
    }
});

var client = {};
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
                            global.commandMapping[cmd] = {
                                args: (cmdo.hargs ? cmdo.hargs : ""),
                                desc: cmdo.hdesc,
                                scope: global.plugins[pltemp1[plname]["plugin_scope"]][cmdo.fscope],
                                compatibly: parseInt(cmdo.compatibly),
                                handler: plname
                            }
                        }
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
            args: "",
            desc: global.lang["VERSION_DESC"],
            scope: function (type, data) {
				var githubdata = JSON.parse(syncrequest("GET", "https://api.github.com/repos/lequanglam/c3c/git/refs/tags", {
					headers: {
						"User-Agent": global.config.fbuseragent
					}
				}).body.toString());
				var latestrelease = githubdata[githubdata.length - 1];
				var latestversion = latestrelease.ref.replace("refs/tags/", "");
                return {
                    handler: "core",
                    data: "Currently running on version " + version + ".\r\nLatest GitHub version: " + latestversion
                }
            },
            compatibly: 0,
            handler: "INTERNAL"
        }
        global.commandMapping["help"] = {
            args: global.lang["HELP_ARGS"],
            desc: global.lang["HELP_DESC"],
            scope: function (type, data) {
                var page = 1;
                page = parseInt(data.args[1]) || 1; 
                if (page < 1) page = 1; 
                var mts = "";
                mts += global.lang["HELP_OUTPUT_PREFIX"];
                var hl = [];
                for (var no in global.commandMapping) {
                    var tempx = global.commandMapping[no];
                    tempx.command = no;
                    hl.push(tempx);
                }
                if (type == "Discord") {
                    mts += "\r\n```HTTP"
                }
                for (i = 5 * (page - 1); i < 5 * (page - 1) + 5; i++) { 
                    if (i < hl.length) { 
                        mts += "\r\n" + (i + 1).toString() + ". /" + hl[i].command; 
                        if (!!hl[i].args && hl[i].args != "") {
                            mts += " " + hl[i].args; 
                        }
                        mts += ": " + hl[i].desc; 
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
        
        global.commandMapping["restart"] = {
            args: "",
            desc: global.lang["RESTART_DESC"],
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

        global.commandMapping["plugins"] = {
            args: "",
            desc: global.lang["PLUGINS_DESC"],
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
        
        global.commandMapping["reload"] = {
            args: "",
            desc: global.lang["RELOAD_DESC"],
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
                left = 0;

                ensureExists(__dirname + "/plugins/", function(){});
                log("[INTERNAL]", "Searching for plugin in /plugins ...");
                findFromDir(__dirname + "/plugins/", /.*\.z3p$/, false, function(list) {
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
                                                    var fmsb = new streamBuffers.ReadableStreamBuffer({
                                                        frequency: 10,
                                                        chunkSize: 2048
                                                    }); 
                                                    fmsb.put(fmb);
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
                                                    global.nodemodule["child_process"].execSync("npm i " + nid);
                                                    try {
                                                        global.nodemodule[nid] = require(nid);
                                                    } catch (ex) {
                                                        log("[INTERNAL]", list, "is requiring node modules named", nid, "but it can't be loaded. Additional information:", ex);
                                                    }
                                                }
                                            }
                                        }
                                        log("[INTERNAL]", "Unpacked", list);
                                        left -= 1;
                                    } catch (ex) {
                                        log("[INTERNAL]", list, "is not containing executable javascript writen in \"plugins.json\" file (\"" + plinfo["plugin_exec"] + "\") or it's malformed. This plugin can't be loaded. Additional information:", ex);
                                    }
                                }
                            } catch (ex) {
                                log("[INTERNAL]", list, "is not containing \"plugins.json\" file or it's malformed. This plugin cannot be loaded. Additional information: ", ex);
                            }
                            zip.close();
                            blocking = false;
                        });
                    } catch(ex) {
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
                                        } else {
                                            global.commandMapping[cmd] = {
                                                args: (cmdo.hargs ? cmdo.hargs : ""),
                                                desc: cmdo.hdesc,
                                                scope: global.plugins[pltemp1[plname]["plugin_scope"]][cmdo.fscope],
                                                compatibly: parseInt(cmdo.compatibly),
                                                handler: plname
                                            }
                                        }
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
        
        var facebook = {};
        facebookcb = function callback(err, api) {
            if (err) { 
                facebook.error = err;
                log("[Facebook]", err);
                log("[Facebook]", "Error saved to 'facebook.error'.");
                return false;
            } else {
                facebook.error = undefined;
            }
            log("[Facebook]", "Logged in.");
            facebook.api = api;
            if (!!global.config.usefbappstate) {
                try {
                    fs.writeFileSync(__dirname + "/fbstate.json", JSON.stringify(api.getAppState()));
                } catch (ex) {
                    log("[INTERNAL]", ex);
                }
            }
            
            function fetchName(id, force, callingback) {
                if (!callingback) {
                    callingback = function(){}
                }
                if (!global.data.cacheName["FB-" + id] || !!force) {
                    api.getUserInfo(id, (err, ret) => {
                        if(err) return log("[INTERNAL]", err);
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
            
            var removePendingClock = setInterval(function(api) {
                api[0].getThreadList(10, null, ["PENDING"], function(err, list) {
                    if (err) {
                        return console.error(err);
                    }
                    for (var i in list) {
                        setTimeout(function(id) {
							api[0].handleMessageRequest(id, true);
                            api[0].sendMessage("Please send again!", id);
                        }, i * 500, list[i].threadID);
                    }
                });
            }, 60000, [api]);
            facebook.removePendingClock = removePendingClock;
            
            !global.data.messageList ? global.data.messageList = {} : "";
            facebook.listener = api.listen(function callback(err, message) {
                try {
                    if (message != undefined) { 
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
                                setTimeout(function() {
                                    api.markAsRead(message.threadID);
                                    var arg = message.body.replace((/”/g), "\"").replace((/“/g), "\"").split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(function (el) {
                                        return !(el == null || el == "" || el == " ");
                                    });
                                    arg.map(xy => xy.replace(/["]/g, ""));
                                    if (arg.indexOf("@everyone") != -1 && (global.config.allowEveryoneTagEvenBlacklisted || ((global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1) && !global.config.blacklistedUsers.hasOwnProperty("FB-" + message.senderID)))) {
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
                                            }, message.threadID, function(){}, message.messageID);
                                        });
                                    }
                                    if (message.body.startsWith("/")) {
                                        if ((global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1) && !global.config.blacklistedUsers.hasOwnProperty("FB-" + message.senderID)) {
                                            log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "issued command in", message.threadID + ":", message.body);
                                            var receivetime = new Date();
                                            var arg = message.body.replace((/”/g), "\"").replace((/“/g), "\"").split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(function (el) {
                                                return !(el == null || el == "" || el == " ");
                                            });
                                            arg.map(xy => xy.replace(/["]/g, ""));
                                            var toarg = arg;
                                            if (global.commandMapping[arg[0].substr(1)]) {
                                                if (!(global.commandMapping[arg[0].substr(1)].compatibly & 1) && global.commandMapping[arg[0].substr(1)].compatibly != 0) {
                                                    api.sendMessage(prefix + " " + global.lang["UNSUPPORTED_INTERFACE"], message.threadID, function(){}, message.messageID);
                                                } else {
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
                                                        var returndata = global.commandMapping[arg[0].substr(1)].scope("Facebook", {
                                                            args: arg,
                                                            time: receivetime,
                                                            msgdata: message,
                                                            api: api,
                                                            prefix: prefix,
                                                            admin: admin,
                                                            mentions: mentions
                                                        });
                                                        if (!returndata) return undefined;
                                                        if (returndata.handler == "core") {
                                                            if (!message.isGroup) {
                                                                var endTyping = api.sendTypingIndicator(message.threadID);
                                                            } else {
                                                                var endTyping = function(){};
                                                            }
                                                            setTimeout(function(api, returndata, endTyping, message) {
                                                                api.sendMessage(prefix + " " + returndata.data, message.threadID, function(){}, message.messageID);
                                                                endTyping();
                                                                setTimeout(function(api, message) {
                                                                    api.markAsRead(message.threadID);
                                                                }, 200, api, message);
                                                            }, returndata.data.length * 34, api, returndata, endTyping, message);
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
                                                api.sendMessage(prefix + " " + global.lang["UNKNOWN_CMD"], message.threadID, function(){}, message.messageID);
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
                                console.log(message);
                                break;
                            case "message_reaction":
                                console.log(message);
                                break;
                            case "message_unsend":
                                if (global.config.enableThanosTimeGems && global.data.messageList.hasOwnProperty(message.messageID)) {
									var attachmentArray = [];
									for (var n in removedMessage.attachments) {
										switch (removedMessage.attachments[n].type) {
											case "file": 
											case "photo":
											case "audio":
											case "video":
											case "animated_image":
												attachmentArray.push({
													type: removedMessage.attachments[n].type,
													data: syncrequest("GET", removedMessage.attachments[n].url).body,
													name: removedMessage.attachments[n].filename
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
									for (var n in attachmentArray) {
										var imagesx = new streamBuffers.ReadableStreamBuffer({
											frequency: 10,  
											chunkSize: 2048
										});
										imagesx.path = attachmentArray[n].name;
										imagesx.put(attachmentArray[n].data);
										imagesx.stop();
										att.push(imagesx);
									}
									var removedMessage = global.data.messageList[message.messageID];
                                    api.sendMessage({
										body: prefix + " " + global.lang["TIME_GEM_ACTIVATION_MSG"].replace("{0}", "@" + global.data.cacheName["FB-" + message.senderID]).replace("{1}", removedMessage.body),
										mentions: [
											{
												tag: "@" + global.data.cacheName["FB-" + message.senderID],
												id: message.senderID,
												fromIndex: 0
											}
										],
										attachments: att
									}, message.threadID, function(){});
                                    api.markAsRead(message.threadID);
                                    log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "tried to delete message in " + message.threadID, "but can't because Thanos's Time Gem is activated. Data: ", global.data.messageList[message.messageID]);
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
                                setTimeout(function() {
                                    api.markAsRead(message.threadID);
                                    var arg = message.body.replace((/”/g), "\"").replace((/“/g), "\"").split(/((?:"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S))+)(?=\s|$)/).filter(function (el) {
                                        return !(el == null || el == "" || el == " ");
                                    });
                                    arg.map(xy => xy.replace(/["]/g, ""));
                                    if (arg.indexOf("@everyone") != -1 && (global.config.allowEveryoneTagEvenBlacklisted || ((global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) != -1) || (!global.config.fblistenwhitelist && global.config.fblisten.indexOf(message.threadID) == -1) && !global.config.blacklistedUsers.hasOwnProperty("FB-" + message.senderID)))) {
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
                                            }, message.threadID, function(){}, message.messageID);
                                        });
                                    }
                                    log("[Facebook]", message.senderID, "(" + global.data.cacheName["FB-" + message.senderID] + ")", "replied to", message.messageReply.senderID, "at", message.threadID + ":", (message.body != "" ? message.body : message.attachments));
                                }, 150);
                                break;
                            default:
                                break;
                        }
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
                    log("[JAVASCRIPT]", eval(`${message}`));
                } catch (ex) {
                    log("[JAVASCRIPT]", ex);
                }
                consoles();
            });
        }
        consoles();
        !global.data.cacheName ? global.data.cacheName = {} : "";
        
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
                var instance = require("facebook-chat-api")(fbloginobj, {
                    userAgent: global.config.fbuseragent,
                    logLevel: "silent", 
                    selfListen: true,
                    listenEvents: true
                }, facebookcb);
                function forceReconnect() {
                    log("[Facebook]", "6 hours has passed. Destroying FCA instance and creating a new one...");
                    if (!!facebook.listener) {
                        facebook.listener();
                        log("[Facebook]", "Stopped Facebook listener");
                        temporaryAppState = facebook.api.getAppState();
                    }
                    try {
                        clearInterval(facebook.removePendingClock);
                    } catch (ex) {}
                    instance = undefined;
                    instance = require("facebook-chat-api")({
                        appState: temporaryAppState
                    }, {
                        userAgent: global.config.fbuseragent,
                        logLevel: "silent", 
                        selfListen: true,
                        listenEvents: true
                    }, facebookcb);
                    log("[Facebook]", "New instance created.");
                    log("[Facebook]", "Logging in...");
                    setTimeout(function(fr) {
                        if (!!facebook.error) {
                            log("[Facebook]", "Detected error. Attempting to reconnect...");
                            fr();
                        }
                    }, 15000, forceReconnect);
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
                    if (((global.config.discordlistenwhitelist && global.config.discordlisten.indexOf(message.channel.id) != -1) || (!global.config.discordlistenwhitelist && global.config.discordlisten.indexOf(message.channel.id) == -1)) && message.author.tag != client.user.tag && !global.config.blacklistedUsers.hasOwnProperty("DC-" + message.author.id)) {
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
                                message.mentions.users.forEach(function(y, x) {
                                    mentions["DC-" + x] = y;
                                    global.data.cacheName["DC-" + x] = y.username + "#" + y.discrimator;
                                });
                                try {
                                    var returndata = global.commandMapping[arg[0].substr(1)].scope("Discord", {
                                        args: arg,
                                        time: currenttime,
                                        msgdata: message,
                                        prefix: prefix,
                                        admin: admin,
                                        mentions: mentions,
                                        client: client
                                    });
                                    if (!returndata) return undefined;
                                    if (returndata.handler == "core") {
                                        message.reply("\r\n" + prefix + " " + returndata.data);
                                    }
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
            client.login(global.config.discordtoken);
        }
        
        //Handling Ctrl+C and SIGTERM (X button)
        var shutdownHandler = function() {
            //WIP
            log("[INTERNAL]", "Detected process is shutting down, handling...");
            //Stop Facebook listener
            if (!!facebook.listener) {
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
            //All finished, kill the process!
            log("[INTERNAL]", "Killing process with SIGKILL...");
            process.exit();
        }
        process.on('SIGTERM', shutdownHandler);
        process.on('SIGINT', shutdownHandler);
        rl.on('SIGINT', shutdownHandler);
    } else {
        setTimeout(temp5, 1000);
    }
}
temp5();
