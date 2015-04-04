var mod = {
  /* For errors and because it looks neat... and procastination :) */

  name: "cookies.js",

  description: "The simple bakery that only produces cookies.",
  tags: ["bakery", "simple", "free", "cookies", "node", "browser", "open source"],

  usage: "Not a standalone executable, read the source.",

  page: "https://www.github.com/Announcement",
};

/* Squish an object down into a list with an equals sign delim. */
function crunch(chain) {
  var keys, key, list;

  list = [];
  keys = Object.keys(chain);
  while (keys.length > 0) {
    key = keys.shift();
    if (chain.hasOwnProperty(key))
      list.push(key + "=" + chain[key]);
  }
  return list;
}


function Bakery() {
  var collection = {};

  function order(key, value) {
    collection[key] = value;
  }

  function gather() {
    return crunch(collection);
  }

  function devour(data) {
    var rx, name, value, item;

    rx = /\s*?([^=]+)=([^;]+)\s*;?/gim;

    while(item = rx.exec(data)) {
      name = item[1];
      value = item[2];
      if (["expires", "path"].indexOf(name)==-1)
        order(name, value);
    }
  }
  function find(name) {
    if (collection.hasOwnProperty(name)) {
      return collection[name];
    }
    return null;
  }

  this.find = find.bind(this);
  this.order = order.bind(this);
  this.gather = gather.bind(this);
  this.devour = devour.bind(this);

  return this;
}

String.prototype.format = function() {
  var args, s, rxa, rxo;

  s = this + "";
  args = Array.prototype.slice.call(arguments, 0);

  rxa = /\{(\d*)\}/g;
  rxo = /\{(\S+)\}/g;

  args.forEach(function(value) {
    if (typeof value == "number")
      s = s.replace(/%-?\d*[df]/, value);

    if (typeof value == "string")
      s = s.replace(/%-?\d*s/, value);

    if (typeof value == "object")
      if (value instanceof Array)
        for (var m, i = 0, val; m = rxa.exec(s); s = s.replace(m[0], val))
          val = (m[1].length > 0) ? parseInt(value[m[1]], 10) : value[i++];
      else
        for (var m, v = value; m = rxo.exec(s); s = s.replace(m[0], v))
          for (var g=m[1].split("."),i=0;v&&v.hasOwnProperty(g[i]); v = v[g[i++]]);
  });

  return s;
};
Object.defineProperty(String.prototype, "format", {enumerable: false});


function flatten(a) {
  var b, c, d, e;

  b = d = [];
  c = {};
  e = "";

  b.push([a, "root"]);

  while (b.length > 0)
  {
    a = b.shift();
    e = a[1];
    a = a[0];

    if (typeof a == "object")
      queue(a);
    else
      recognize(a, e);
  }

  function queue(h) {
    var f, g;

    f = Object.keys(h);

    while(f.length > 0) {
      g = f.shift();

      if (!h.hasOwnProperty(g))
        continue;

      if (typeof h[g] == "object")
        b.push([h[g], e+"."+g]);

      else
        recognize(h[g], g);
    }
  }
  function recognize(f, g) {
    c[e + "." + g] = f;
  }

  e = {};
  b = Object.keys(c);

  while (b.length > 0)
  {
    a = b.shift();
    e[a.substring(5)] = c[a];
  }
  return e;
}

/* Code injection, has to be usable somehow, no? */
try {
  exports.Bakery = Bakery;
  exports.flatten = flatten;
} catch(e) {
  console.warn("Couldn't bind {name} to %s.".format(mod, "exports"));
}
try {
  window.Bakery = Bakery;
  window.flatten = flatten;
} catch(e) {
  console.warn("Couldn't bind {name} to %s.".format(mod, "window"));
}
try {
  global.Bakery = Bakery;
  global.flatten = queryify;
} catch(e) {
  console.warn("Couldn't bind {name} to %s.".format(mod, "global"));
}
