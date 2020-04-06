String.prototype.pad = function (width, z) {
  z = z || '0';
  var n = this.valueOf() + '';
  return (n.length >= width ? n : (new Array(width - n.length + 1)
    .join(z) + n));
};
Number.prototype.pad = function (width, z) {
  z = z || '0';
  var n = this.valueOf() + '';
  return (n.length >= width ? n : (new Array(width - n.length + 1)
    .join(z) + n));
};
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

// object.watch
if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, "watch", {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (prop, handler) {
      var oldval = this[prop],
        newval = oldval,
        getter = function () {
          return newval;
        },
        setter = function (val) {
          oldval = newval;
          newval = handler.call(this, prop, oldval, val);
          return newval;
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
