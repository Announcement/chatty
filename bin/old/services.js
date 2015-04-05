//Services
var mods, programs;

mods = ["net", "http", "fs", "url", "querystring", "fs", "crypto"];

programs = ["telnet", "httpd", /*"database", "smtp"*/
           "eventsource", "rest", "cookies", "fileserver",
           "feed", "website", "pages", "apps", "live"];

mods.forEach(function(value) {
  global[value] = require(value);
});

programs.forEach(function(value) {
  global[value] = null;
});

var translate = require("./translate.js");

telnet = function() {
  var server = net.createServer();

  server.on("connection", translate.telnet);

  server.listen(ports.telnet || translate.port.bind(server, "telnet"));
};

httpd = function() {
  var server = http.createServer();

  server.on("request", translate.httpd);

  server.listen(ports.httpd || translate.port.bind(server, "httpd"));
};

programs.forEach(function(value) {
  exports[value] = global[value];
});
