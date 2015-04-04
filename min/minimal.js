var modules = ["fs", "http", "net", "url", "querystring", "crypto"],
    servers = {}, normalize;

require("./cookies.js");

modules.forEach(load);

function load(module) {
  delete require.cache[require.resolve(module)];
  global[module] = require(module);
}

function range(a, b) {
  if (!a) return false;

  if (!b && a)
    b = [a++, a=0].shift();

  if (a > b)
    b = b + a;

  for (this.c = []; b >= a; this.c.unshift(b--));

  return this.c;
}

function has(r) {
  return r[Math.floor(Math.random() * r.length)];
}

servers.telnet = function(socket) {
  socket.pipe(socket);
};

servers.httpd = function(request, response) {
  var headers, condition, cookies, standards, peacefully, origin;

  headers = {};
  peacefully = "";
  origin = "default";

  condition =  new Problem();
  cookies = new Bakery();

  function files(path) {
    var index, files, folder, spot;

    index = "minimal.html";

    files = {
      "minimal.html": "text/html",
      "cookies.js": "text/javascript"
    };

    path = (path == "") ? index : path;
    folder = Object.keys(files);
    spot = folder.indexOf(path);

    if (spot != -1) {
      if (fs.existsSync(folder[spot])) {
        origin = folder[spot];
        headers["Content-Type"] = files[path];
        standards = fs.readFileSync(folder[spot], "utf8");

        return true;
      }
    }
    return false;

  }
  function take(r) {
    var uri, query, path;

    uri = url.parse(r.url);

    query = querystring.parse(uri.query);

    path = uri.pathname;

    cookies.order("identity", condition.flavor);

    if (query.hasOwnProperty("id"))
      cookies.order("identity", query.id);

    cookies.devour(r.headers.cookie);

    headers["Set-Cookie"] = cookies.gather();
    headers["Content-Type"] = "text/plain";

    if (files(path.substring(1)) === true)
      console.log("Served file: " + origin);
    else if (path == "/favicon.ico") {
      //Don't care about favicon.

      response.end();
      return false;

    } else if (path == "/query")
      standards = cookies.find("identity");
    else
      standards = (new Human(condition)).greet;

    return true;
  }
  function give(r) {
    r.writeHead(200, headers);

    r.write(standards);

    r.end(peacefully);
  }

  take(request) && give(response);
};

function Problem() {
  var username, password, seed, now, position, size;

  size = 8;
  now = new Date();
  position = has(range(32 - size));

  seed = sum(now.toGMTString());
  seed = seed.substring(position, position + size);

  username = seed.replace(/\d+/g,"") + seed.replace(/[^\d]+/g, "");
  username = username.substring(0,1).toUpperCase() + username.substring(1);

  password = "";

  this.user = {"name": username, "pass": password};
  this.flavor = seed;
  this.all = {"name": username, "pass": password, "seed": seed};

  return this;
}
Human = function(info) {
  this.info = info;
};
Object.defineProperty(Human.prototype, "greet", {
  get: function() {
    var response;

    response = JSON.stringify(this.info.user, null, "  ");

    return response;
  }
});
function sum() {
  var tool, args;

  tool = crypto.createHash("md5");
  args = Array.prototype.slice.call(arguments, 0);

  args.forEach(function(v) { tool.update(v); });

  return tool.digest("hex");
}


var h, n;

h = http.createServer(servers.httpd);
n = net.createServer(servers.telnet);

h.listen(80);
n.listen(23);
