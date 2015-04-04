var services, config, debug;
global.ports = {
  telnet: null,
  httpd: null,
  smtp: null,
  ftp: null,
};
function close() {
  console.log(arguments);
  global.database.save();
  process.exit();
}



//Handle configuration and prerequisites.
(function configure() {
  require("./database.js");

  global.database.load();

  services = require("./services.js");

  config = {flags: []};

  Array.prototype.forEach.call(arguments, identify);

  if (-~config.flags.indexOf("-s"))
  { ports.telnet = 23; ports.httpd = 80 }

  ports.telnet = $setting("telnet-port") || ports.telnet;
  ports.httpd = $setting("httpd-port") || ports.httpd;

  debug = !$setting("experiment");
}).apply(null, process.argv.slice(2));

//Turn some gears...
(function initialize() {
}).call(null);

//Modulation
(function install() {
  services.httpd();
  services.telnet();
}).call(null);

(function finalize() {
  process.on('exit', close.bind(null));
  process.on('SIGINT', close.bind(null));
  process.on('uncaughtException', close.bind(null));
}).call(null);



process.stdin.resume();

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
