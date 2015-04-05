var mod = {
  name: "parameter.js",

  description: "The simple bakery that only produces cookies.",
  tags: ["parameter", "simple", "free", "arguments", 
         "node", "shell", "command line", "terminal", "open source"],

  usage: "node parameter.js + parameters",

  page: "https://www.github.com/Announcement",
};
String.prototype.format = function () {
  var args, s, rxa, rxo;

  s = this + "";
  args = Array.prototype.slice.call(arguments, 0);

  rxa = /\{(\d*)\}/g;
  rxo = /\{(\S+)\}/g;

  args.forEach(function (value) {
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
Object.defineProperty(String.prototype, "format", {
  enumerable: false
});

Array.prototype.flatten = function () {
  var list = this;

  function f(x) {
    return typeof x == "object" && x instanceof Array ? "array" : typeof x;
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
Object.defineProperty(Array.prototype, "flatten", {
  enumerable: false
});

JSON.flatten = function (object) {
  var q, e, c;

  q = [];
  e = "";
  c = {};

  q.push([object, "root"]);

  for (var m, b; m = q.shift(); b ? h.apply(null, m) : k.apply(null, m))
    b = [f(m[0]), e = m[1]].shift();

  function f(x) {
    return typeof x == "object" && !(x instanceof Array);
  }

  function g(x, y) {
    x.apply(null, y);
  }

  function k(x, y) {
    c[e + '.' + y] = x;
  }

  function h(x) {
    for (var m in x)
      if (!x.hasOwnProperty(m))
        continue;
      else if (f(x[m]))
      q.push([x[m], e + '.' + m]);
    else
      k(x[m], m);
  }

  e = {};
  for (var m in c)
    if (c.hasOwnProperty(m))
      e[m.substring(5)] = c[m];
  
  return e;
};

(function () {
  var args, arg, param, stray;

  stray = [];
  param = {};

  args = Array.prototype.slice.call(arguments, 2);

  function f(x) {
    return x.replace(/^-{1,2}/m, "").trim();
  }
  while(args.length > 0)
  {
    arg = args.shift();
    if (arg.indexOf("-") == 0)
    {
      arg = f(arg);
      if(arg.indexOf("=") != -1)
        param[arg.split("=")[0]] = param[arg.split("=")[1]];
      else
      if (args.length > 0 && args[0].indexOf("-") !== 0)
        param[arg] = args.shift();
      else
        param[arg] = true;
    }
    else
    {
      stray.push(arg); 
    }
  }
  
  param._ = stray;

  this.params = param;

  console.log(param);
}).apply(global || window || exports || null, (process || {
  argv: []
}).argv);

