var modules = [
  "fs",
  "http",
  "net",
  "url",
  "querystring",
  "crypto"
];

modules.forEach(function(a) {
  delete require.cache[require.resolve(a)];
  global[a] = require(a);
});

//Utility includes.
require("./bin/parameter.js");
require("./web/cookies.js");

//Programatic includes.
require("./bin/database.js"); //database & filestream
require("./bin/servers.js");  //httpd, telnet, smtp, imap