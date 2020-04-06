/* eslint-env worker */

onmessage = function (event) {
  var wait = require("wait-for-stuff");
  var NSFWJS;
  var data = event.data;
  try {
    NSFWJS = wait.for.promise(require("nsfwjs")
      .load(`http://127.0.0.1:${data.tfjsPort}/`, {
        size: (event.data.small ? 224 : 299)
      }));
  } catch (ex) {
    NSFWJS = wait.for.promise(require("nsfwjs")
      .load("https://lequanglam.github.io/nsfwjs-model/", {
        size: 299
      }));
  }
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
};
