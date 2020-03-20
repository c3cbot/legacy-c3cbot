var semver = require("semver");
var currVersion = require("./package.json").version;
var syncrequest = require("sync-request");
var childProcess = require("child_process");
var fetch = require("node-fetch");
var fs = require("fs");
var AdmZip = require('adm-zip');

var pr = semver.prerelease(currVersion);
var gitCheck = childProcess.spawnSync("git", [
    "rev-parse",
    "--is-inside-work-tree"
], {
    shell: true,
    stdio: "pipe",
    cwd: __dirname
});
var gitCheckX = (!gitCheck.error ? gitCheck.stdout.toString("utf8") == "true" : false);

module.exports = {
    checkForUpdate: function checkForUpdate(forceStable) {
        if ((Array.isArray(pr) && pr.length >= 1 && (pr[0] == "beta" || pr[0] == "alpha")) && gitCheckX && !forceStable) {
            //Handling the alpha/beta github version
            var currentHash = childProcess.spawnSync("git", [
                "rev-parse",
                "--short",
                "HEAD"
            ], {
                shell: true,
                stdio: "pipe",
                cwd: __dirname
            }).stdout.toString("utf8").replace(/\r/g, "").replace(/\n/g, "");
            if (currentHash == "") {
                return this.checkForUpdate(true);
            }
            var githubHash = JSON.parse(syncrequest("GET", "https://api.github.com/repos/lequanglam/c3c/git/ref/heads/master", {
                headers: {
                    "User-Agent": `C3CBot/${currVersion} request/0.0-sync`,
                    "Accept": "application/vnd.github.v3.full+json"
                }
            }).body.toString()).object.sha.substr(0, 7);
            return {
                newUpdate: githubHash != currentHash,
                version: `0.0.0-git.${githubHash}`,
                currVersion: `0.0.0-git.${currentHash}`
            }
        } else if (pr == null || forceStable) {
            //Handling stable version
            var githubdata = JSON.parse(syncrequest("GET", "https://api.github.com/repos/lequanglam/c3c/git/refs/tags", {
                headers: {
                    "User-Agent": `C3CBot/${currVersion} request/0.0-sync`,
                    "Accept": "application/vnd.github.v3.full+json"
                }
            }).body.toString());
            var latestrelease = githubdata[githubdata.length - 1].ref.replace("refs/tags/", "");
            return {
                newUpdate: semver.lt(currVersion, latestrelease),
                version: latestrelease,
                currVersion: currVersion
            }
        } else {
            //Handling custom version?
            return {
                newUpdate: false,
                version: "0.0.0-custom",
                currVersion: currVersion
            }
        }
    },
    installUpdate: function installUpdate() {
        var returnResolve = function () { };
        var returnPromise = new Promise(resolve => {
            returnResolve = resolve;
        });
        var latestRelease = "";
        if (gitCheckX) {
            latestRelease = "latest";
            var gitProcess = childProcess.spawn("git", ["stash"], {
                shell: true,
                stdio: "pipe",
                cwd: __dirname
            });
            gitProcess.on("close", function () {
                var gitProcessX = childProcess.spawn("git", ["pull"], {
                    shell: true,
                    stdio: "pipe",
                    cwd: __dirname
                });
                gitProcessX.on("close", function (code) {
                    if (code != 0) {
                        return returnResolve(false, "GIT-" + code);
                    }
                    fs.unlinkSync("package-lock.json");
                    var npmProcess = childProcess.spawn("npm", ["install"], {
                        shell: true,
                        stdio: "pipe",
                        cwd: __dirname
                    });
                    npmProcess.on("close", function (code) {
                        if (code != 0) {
                            return returnResolve(false, "NPM-" + code);
                        }
                        returnResolve(true, "?");
                    });
                });
            });
        } else {
            var githubdata = JSON.parse(syncrequest("GET", "https://api.github.com/repos/lequanglam/c3c/git/refs/tags", {
                headers: {
                    "User-Agent": `C3CBot/${currVersion} request/0.0-sync`,
                    "Accept": "application/vnd.github.v3.full+json"
                }
            }).body.toString());
            latestRelease = githubdata[githubdata.length - 1].ref.replace("refs/tags/", "");
            //HTTP ZIP package method
            //var zipDownload = https.get(`https://github.com/lequanglam/c3c/archive/${latestRelease}.zip`);
            fetch(`https://github.com/lequanglam/c3c/archive/${latestRelease}.zip`)
                .then(f => {
                    if (!f.ok) {
                        throw new Error(`HTTP/1.1 ${f.status}`);
                    } else {
                        return f.buffer();
                    }
                })
                .then(buf => {
                    var zip = new AdmZip(buf);
                    zip.extractAllTo(__dirname, true);
                    fs.unlinkSync("package-lock.json");
                    var npmProcess = childProcess.spawn("npm", ["install"], {
                        shell: true,
                        stdio: "pipe",
                        cwd: __dirname
                    });
                    npmProcess.on("close", function (code) {
                        if (code != 0) {
                            return returnResolve(false, "NPM-" + code);
                        }
                        returnResolve(true, zip.getEntries().length);
                    });
                })
                .catch(err => {
                    returnPromise(false, `Error: ${err}`);
                });
        }
        return returnPromise;
    }
}
