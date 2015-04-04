var modules = ["fs", "http", "net", "url", "querystring", "crypto"],
    servers = {}, normalize, mimes;

var path = process.cwd();
mimes = {
  "txt": "text/plain",
  "js": "text/javascript",
  "html": "text/html",
  "css": "text/css"
}
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

var db = {}, messages = [], users = {};
function access(username, id) {
  var user;

  if (users.hasOwnProperty(username))
    user = users[username];
  else
    return false;


  return user.id == id;
}
function send(username, message, id) {
  var blob, now;
  now = new Date();

  blob = {
    name: username,
    time: now.getTime(),
    channel: "global",
    message: message
  };

  if (access(username, id))
    messages.push(blob);

  if (messages.length > 0xFF)
    messages.shift();

  return messages.length+"";
}
function recv(after) {
  var response;

  if (after >= messages.length)
    return [];

  response = messages.slice(after);

  if (response.length > 8)
    response = response.slice(0, 8);

  return response;
}
function account(username, password, id) {
  var user, token;

  token = sum(username, password);

  if (users.hasOwnProperty(username))
  {
    user = users[username];
    if (user.hash == token)
      user.id = id;
    else
      return "false";

  } else {

    user = {
      id: id,
      hash: token
    };

    users[username] = user;
  }
  return user.hash;
}
db.parse = function(q, c) {

  if (q.hasOwnProperty("update")) {
    return JSON.stringify(recv(parseInt(q.update, 10)));
  }

  if (q.hasOwnProperty("action")) {
    if (q.action == "verify")
      return account(q.name, q.pass, q.id);

    if (q.action == "send")
      return send(q.name, q.message, q.id);
  }
  return c.find("identity");
}
var files = {}, fcache = {};

function addFileName(name) {
  var e;
  e = name.split(".");
  if (e.length > 1)
    e = e[e.length - 1];
  else
    e = e[0];

  files[name] = mimes[e];
}

function cache(file, reason) {
  if (!fs.existsSync(file))
    return "false";

  addFileName(file);

  fcache[file] = fs.readFileSync(file, "utf8");

  console.log("Loaded %s into cache for %s".format(file, reason));

  if (Object.keys(fcache).length > 8)
    delete fcache[Object.keys(fcache)[0]];
}

function getFile(file) {
  if (!fs.existsSync(file))
    return "false";

  if (Object.keys(fcache) == -1)
    cache(file, "request");

  return fcache[file];
}

fs.readdir(path, function(a, b) {
  //... caches  ...//
  if (a) return ( a );
  b.forEach(g);

  function g(a){cache(a,"construction");}
});
fs.watch(path, function(a, b) {
  //... updates ...//

  cache(b, "update");
});


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

  function disk(path) {
    var index, folder, spot;

    index = "beta.html";
    path = (path == "") ? index : path;
    folder = Object.keys(files);
    spot = folder.indexOf(path);

    if (spot != -1) {
      if (fs.existsSync(folder[spot])) {
        origin = folder[spot];
        headers["Content-Type"] = files[path];
        standards = getFile(path);

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

    if (disk(path.substring(1)) === true)
    {}//console.log("Served file: " + origin);
    else if (path == "/favicon.ico")
      return response.end() && false;
    else if (path == "/query")
      standards = db.parse(query, cookies); //cookies.find("identity");
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
function close() {
  if (this) {
    var save = {
      "users": users,
      "messages": messages,
    };

    save = JSON.stringify(save, null, "\t");

    fs.writeFileSync(path + "/betadb.dat", save);
  }
  console.log(this, arguments);
  process.exit(1);
}
(function load() {
  var content;
  if (!fs.existsSync(path + "/betadb.dat"))
    return false;

  content = fs.readFileSync("betadb.dat").toString("utf8");
  content = JSON.parse(content);

  users = content.users;
  messages = content.messages;
}).call(null);
(function host() {
  var h, n;

  h = http.createServer(servers.httpd);
  n = net.createServer(servers.telnet);

  h.listen(80);
  n.listen(23);
}).call(null);

(function finalize() {
  process.on('exit', close.bind(true));
  process.on('SIGINT', close.bind(true));
  process.on('uncaughtException', close.bind(false));
}).call(null);
