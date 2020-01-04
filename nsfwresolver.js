/* eslint-disable object-curly-spacing */
/* eslint-disable no-redeclare */
var wait = require("wait-for-stuff");
const worker = require('worker_threads');
try {
    var NSFWJS = wait.for.promise(require("nsfwjs").load("http://localhost:2812/", { size: 299 }));
} catch (ex) {
    var NSFWJS = wait.for.promise(require("nsfwjs").load("https://lequanglam.github.io/nsfwjs-model/", { size: 299 }));
}

var data = worker.workerData;
try {
    var cl = wait.for.promise(NSFWJS.classify({
        data: data.data,
        width: data.width,
        height: data.height
    }, 1));
    worker.parentPort.postMessage({
        class: cl,
        id: data.id
    });
} catch (ex) {
    worker.parentPort.postMessage({
        error: ex
    });
}
