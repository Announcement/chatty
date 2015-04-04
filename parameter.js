var mod = {
  name: "parameter.js",

  description: "The simple bakery that only produces cookies.",
  tags: ["parameter", "simple", "free", "arguments", "node", "shell", "command line", "terminal", "open source"],

  usage: "node parameter.js + parameters",

  page: "https://www.github.com/Announcement",
};
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

    if (typeof value == "object") {
      var t = s;
      if (value instanceof Array)
        for (var m, i = 0, t = s, v; m = rxa.exec(s); t = t.replace(m[0], v))
          v = (m[1].length > 0) ? value[parseInt(m[1])] : value[i++];
      else
        for (var m, v, t = s; m = rxo.exec(s); t = t.replace(m[0], v))
          for (var g = m[1].split("."), i = 0, v = value;
               v && v.hasOwnProperty(g[i]); v = v[g[i++]]);
      s = t;
    }
  });
  return s;
};
Object.defineProperty(String.prototype, "format", {enumerable: false});

(function() {
  var args, param, stray;

  stray = [];
  param = {};

  args = Array.prototype.slice.call(arguments, 2);

  //args.reduce(pairs).map(soap).filter()

  param._ = stray;

  this.params = param;

}).apply(global || window || exports || null, (process || {argv: []}).argv);

Array.prototype.flatten = function() {
  var list = this;

  function f(x) {
    return typeof x == "object" && x instanceof Array ? "array": typeof x;
  }

  function g(x) {
    return f(x) == this;
  }

  function h(x) {
    return (f(x) != "array") ? [x] : x;
  }

  function i(x, y) {
    return x.concat(y);
  }

  /* while some items are arrays... */
  /* map all to arrays, concatenate */

  while (list.some(g.bind("array")))
    list = list.map(h).reduce(i);

  return list;
};
Object.defineProperty(Array.prototype, "flatten", {enumerable: false});

var tower = {
  "colors": {
    "red": "#f00",
    "green": "#0f0",
    "blue": "#00f"
  },
  "browsers": {
    "google": {
      "proprietary": "chrome",
      "opensource": "chromium",
      "development": "canary"
    },
    "mozilla": "firefox",
    "microsoft": "internet explorer",
    "apple": "safari",
    "opera": "opera"
  },
  "name": "example"
};

var array = [[[[[[[[[[9],8],7],6],5],4],3],2],1],0,[-1,[-2,[-3,[-4,[-5,[-6,[-7,[-8,[-9]]]]]]]]]];
//Non recursive flatten.
function nrf(a) {
  var b, c, d, e;
  b = [];
  c = {};
  d = [];
  e = "";

  b.push([a,"root"]);

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
    c[e+"."+g] = f;
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
JSON.flatten = function(object) {
  var q, e, c;

  q = [];
  e = "";
  c = {};

  q.push([object, "root"]);

  for(var m, b; m = q.shift(); b ? h.apply(null, m) : k.apply(null, m))
    b = f(m[0]);

  function f(x) {
    return typeof x == "object" && !(x instanceof Array);
  }
  function g(x, y) {
    x.apply(null, y);
  }
  function k(x, y) {
    c[e+'.'+y] = x;
  }

  function h(x) {
    for(var m in x)
      if (!x.hasOwnProperty(m))
        continue;
      else if (f(x[m]))
        q.push([x[m],e+'.'+m]);
      else
        k(x[m], m);
  }

  /*e = {};
  for (var m in c)
    if (c.hasOwnProperty(m))
      e[m.substring(5)] = c[m];*/
  return c;
};

console.log(array.flatten());
console.log(JSON.flatten(tower));
//tower = flatten(tower);
//console.log(JSON.stringify(array, null, "\t"));
/*
  //Parse arguments
  function identify(value) {

    if (value.indexOf("=")!=-1)
      config[value.split("=")[0]] = value.split("=")[1];
    else
      config.flags.push(value);

    config.flags = config.flags.filter(function(value, index, array) {
      if (value.indexOf("-") == 0 &&
          array.length > index + 1 &&
          array[index+1].indexOf("-") != 0)
      {
        config[value] = array[index+1];
        return false;
      }

      if (value.indexOf("-") != 0 && index > 0 &&
          array[index-1].indexOf("-") == 0)
        return false;

      return true;
    });

    var keys = Object.keys(config);
    for (var i = 0; i < keys.length; i++) {
      if (!config.hasOwnProperty(keys[i]))
        continue;

      if (!keys[i].indexOf("--")==0)
        continue;

      config[keys[i].substring(2)] = config[keys[i]];

      delete config[keys[i]];
    }
  }

  function similar(value){
    if (value.indexOf("-") == 0 && this.indexOf(value.substring(1)) != -1)
    {
      return true;
    }
    return false;
  }

  function setting(name) {
    var result = [];
    if (Object.keys(config).some(similar.bivar mod = {
    /* For errors and because it looks neat... and procastination :)

    name: "cookies.js",

    description: "The simple bakery that only produces cookies.",
    tags: ["bakery", "simple", "free", "cookies", "node", "browser", "open source"],

    usage: "Not a standalone executable, read the source.",

    page: "https://www.github.com/Announcement",
  };nd(name)))


      result = Object.keys(config).filter(similar.bind(name)).map(function(value){return config[value]})


    if (config.hasOwnProperty(name))
      result.unshift(config[name]);

    if (config.flags.some(similar.bind(name)))
      result.unshift(true);

    if (result.length > 0)
      return result;

    return false;
  }

  function $setting(name) {
    var $s = setting(name);
    if (!$s) return null;
    if ($s.length>0&&$s[0]==true) return $s[1];
    else return $s[0];
  }*/