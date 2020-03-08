/* eslint-disable no-console */
var childProcess = require("child_process");

/**
 * C3CLoader Function
 *
 * @param   {boolean}    first  First time?
 *
 * @return  {undefined}         Nothing
 */
function loader(first) {
  if (!first) {
    console.log();
		console.log(`[Loader] 7378278/RESTART error code found. Restarting...`);
  }
  var child = childProcess.spawn("node", ["main.js"], {
    cwd: __dirname,
    maxBuffer: 16384 * 1024,
    stdio: 'inherit',
    shell: true
  });
  child.on("close", (code) => {
    //UNIX, why? (limited to 8-bit)
    //Original code: 7378278
    if (code % 256 == 102) {
      return loader(false);
    }
    
    console.log();
    console.log(`[Loader] main.js throw ${code} (not 7378278/RESTART). Shutting down...`);
  });
  child.on("error", function (err) {
    console.log();
    console.log("[Loader] Error:", err);
  })
}
loader(true);
