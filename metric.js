var fetch = require("node-fetch");
//const url = require('url');

module.exports = {
  authenticate: function(metricID, metricSecret) {
    var params = new URLSearchParams();
    params.set("id", metricID);
    params.set("secret", metricSecret);
    params.set("type", "auth");
    var prResolve = function() {};
    var prReject = function() {};
    var returnPromise = new Promise((resolve, reject) => {
      prResolve = resolve;
      prReject = reject;
    });
    fetch("https://c3c-metric.com/metric.php", {
        method: "POST",
        body: params
      })
      .then(function(f) {
        if (f.status == 200) {
          f.json()
            .then(data => {
              if (data.valid) {
                prResolve(function ping(data) {
                  var params = new URLSearchParams();
                  for (var n in data) {
                    params.set(n, data[n]);
                  }
                  params.set("type", "ping");
                  params.set("id", metricID);
                  params.set("secret", metricSecret);
                  var prResolve = function() {};
                  var prReject = function() {};
                  var returnPromise = new Promise((resolve, reject) => {
                    prResolve = resolve;
                    prReject = reject;
                  });
                  fetch("https://c3c-metric.com/metric.php", {
                      method: "POST",
                      body: params
                    })
                    .then(function(f) {
                      if (f.status == 200) {
                        prResolve();
                      } else {
                        f.text()
                          .then(err => {
                            prReject([new Error(`HTTP ${f.status}: ${err}`), (f.status == 400), true]);
                          });
                      }
                    })
                    .catch(function(err) {
                      prReject([err, false]);
                    });
                  return returnPromise;
                });
              } else {
                prReject([new Error(`Invalid Metric ID and/or Metric Secret!`), true])
              }
            })
        } else {
          f.text()
            .then(err => {
              prReject([new Error(`HTTP ${f.status}: ${err}`), (f.status == 400)]);
            });
        }
      })
      .catch(function(err) {
        prReject([err, false]);
      });
    return returnPromise;
  },
  createNew: function(version, hide) {
    var params = new URLSearchParams();
    if (hide) {
      params.set("hide", "");
    }
    params.set("version", version);
    params.set("type", "createNewID");

    var prResolve = function() {};
    var prReject = function() {};
    var returnPromise = new Promise((resolve, reject) => {
      prResolve = resolve;
      prReject = reject;
    });
    fetch("https://c3c-metric.com/metric.php", {
        method: "POST",
        body: params
      })
      .then(function(f) {
        if (f.status == 200) {
          f.json()
            .then(data => {
              prResolve(data);
            });
        } else {
          f.text()
            .then(err => {
              prReject([new Error(`HTTP ${f.status}: ${err}`), (f.status == 400)]);
            });
        }
      })
      .catch(function(err) {
        prReject([err, false]);
      });
    return returnPromise;
  }
}
