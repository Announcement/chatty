var http, fs, url, qs,
    server, web, users, messages, mimes,
    events, database, httpd;

http = require("http")
fs = require("fs")
url = require("url")
qs = require("querystring")

server = http.createServer()

(function configure() {
  web = {}
  users = messages = mimes = {}

  web.service = {}

  mimes.html = "text/html";
  mimes.css = "text/css";
  mimes.js = "text/javascript";

  mimes.txt = "text/plain";

  mimes.jpeg = "image/jpeg";
  mimes.jpg = "image/jpeg";
  mimes.ico = "image/x-icon";

  mimes.form = "application/x-www-form-urlencoded"

}());

(function initialize() {
  server.on("request", web.request)

  database.enable("users");
  database.enable("messages");

  httpd.enable("login");

  events.enable("news");

  web.reserve(database)
  web.reserve(httpd)
  web.reserve(events)

  server.listen(8000)
}());

web.reserve =  function(service) {}

web.request = function(request, response){
  var client, complete;


  //Server Side Events
  if (request.headers.accept &&
      request.headers.accept == "text/event-stream")
  {
    events(request, response);
  }
  else
  {
    client = new Client(complete, request);
  }

  complete = function() {
  };
}

function Client(callback, request) {
  var $get, $post, $cookie, $rest,
      method, gatherk;

  method = request.method.toLowerCase()

  uri = url.parse(request.url)

  $get = qs.parse(uri.query)


  $cookie = cookies(request.storage.cookie)

  $rest = restify(uri)

  $post = {};

  this.get = $get;
  this.rest = $rest;
  this.post = $post;
  this.cookie = $cookie;
  this.request = request;

  (method == "post" && gather.call(this) || callback.call(this));

  return this;

  gather = function() {
    var content;

    content = "";

    request.on("data", data);
    request.on("end", end);

    function data() {
      content += arguments[0] || "";
      if (content > 1e6)
          request.connection.destroy();
    }
    function end() {
      $post = qs.parse(content);

      this.post = $post;

      callback.call(this);
    }
  }
}
function cookies(data) {
  var chef, baked, sale;

  sale = {}

  baked = data.split(";").map(chef)

  chef = function(dough) {
    var sheet, name, value;

    sheet = dough.split("=");
    name = sheet.shift().trim();
    value = decodeURIComponent((sheet[0]||"").trim());

    sale[name] = value;
  }

  return sale;
}
web.response = function() {
  function header() {
    this.data = {}
    this.code = 200;
    function content(ctype) {
      data["Content-Type"] = ctype;

      return this;
    }
    function cookie(name, value) {
      var cook;

      cook = name +"="+ encodeURIComponent(value.trim());

      if (this.data.hasOwnProperty("Set-Cookie"))
        data["Set-Cookie"] += "&" + cook;
      else
        data["Set-Cookie"] = cook;

      return this;
    }
    function error(code) {
      var ei; //Error index
      ei = [
        "informational",
        "success",
        "redirect",
        "client",
        "server"
      ];
      eiInfo = ["Continue", "Switching Protocols", "Processing"];
      eiSuccess = ["OK",
                   "Created",
                   "Accepted",
                   "Non-Authoritative Information",
                   "No Content",
                   "Reset Content",
                   "Partial Content",
                   "Multi-Status",
                   "Already Reported",
                   "IM Used"];
      eiRedirect = ["Multiple Choicess];
      eiClient = [];
      eiServer = [];
      if (typeof code === "number")
        this.code = code;
    }

    this.content = content.bind(this);
    this.cookie = coockie.bind(this);

    return this;
  }
  function content() {
  }
}


//    'Set-Cookie': 'mycookie=test',
//Reply with a requested resource
function provide(response, filename) {
    var parts, extension;

    parts = filename.split(".");
    extension = parts[parts.length-1];

    response.writeHead(200, {"Content-Type": mimes[extension] || "text/plain"});
    response.end(fs.readFileSync(filename));
}

function doGetRequest(request, response, information) {
    var path, respond;

    path = request.url;
    respond = provide.bind(this, response);

    if (request.url = "/")
        respond("basic.html");
}

function eventStream(request, response) {
    var timer, initialize, update;

    initialize = function init() {
        response.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "Keep-Alive"
        });
        request.connection.on("close", function() {
            clearTimeout(timer);
        });
        bump("bump");
    }

    update = function bump(data, id) {
        id = (id || (new Date()).toLocaleTimeString());

        response.write("id: " + id + "\n");
        response.write("data: " + data + "\n\n");

        timer = setTimeout(bump.bind(this, data, id), 5 * 1000);
    }
}


/*
index.html
admin.html
support.html

home.page
register.page
help.page

offline.cache
robots.txt
sitemap.xml
feed.rss
feed.atom

settings.json
mimetypes.txt
setup.js

framework.js

reset.css
default.css
more.less

* bonus *
download.bat
download.sh*/
