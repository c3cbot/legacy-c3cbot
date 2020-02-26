/* eslint-disable no-console */
/* eslint-disable camelcase */
var child_process = require("child_process");

/**
 * C3CLoader Function
 *
 * @param   {boolean}    first  First time?
 *
 * @return  {undefined}         Nothing
 */
function loader(first) {
  if (!first) {
		console.log(`[Loader] 7378278/RESTART error code found. Restarting...`);
  }
  var child = child_process.spawn("node main.js", [], {
    cwd: __dirname,
    maxBuffer: 16384 * 1024,
    stdio: [
      'pipe',
      'pipe',
      'pipe'
    ]
  });
  child.on("close", (code, signal) => {
    if ((code || signal) == 7378278) {
      return loader(false);
    }
    
    console.log(`[Loader] main.js throw ${code || signal} (not 7378278/RESTART). Shutting down...`);
  });
  child.on("error", function (err) {
    console.log("[Loader] Error:", err);
  })
}
loader(true);

/* while (errorCode == 7378278) {
	if (!first) {
		console.log(`[Loader] 7378278/RESTART error code found. Restarting...`);
  }
  first = false;
	var returned = child_process.spawnSync("node main.js", [], {
		cwd: __dirname,
		maxBuffer: 16384 * 1024,
		stdio: [
      'inherit', 
      'inherit', 
      'inherit'
    ]
	});
	errorCode = returned.status || returned.signal;
}

console.log();
console.log(`[Loader] main.js throw ${errorCode} (not 7378278/RESTART). Shutting down...`); */
