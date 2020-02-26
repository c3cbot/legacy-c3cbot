/* eslint-disable no-console */
/* eslint-disable camelcase */
var child_process = require("child_process");

var errorCode = true;

while (errorCode === true || errorCode == 7378278) {
	if (!(errorCode === true)) {
		console.log(`[Loader] 7378278/RESTART error code found. Restarting...`);
	}
	var returned = child_process.spawnSync("node main.js", [], {
		cwd: __dirname,
		maxBuffer: 16384 * 1024,
		stdio: [
      'inherit', 
      'inherit', 
      'inherit'
    ]
	});
	errorCode = returned.status;
}

console.log();
console.log(`[Loader] main.js throw ${errorCode} (not 7378278/RESTART). Shutting down...`);
