var services, config, debug;
global.ports = {
  telnet: null,
  httpd: null,
  smtp: null,
  ftp: null,
};

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
  if (Object.keys(config).some(similar.bind(name)))
    result = Object.keys(config).filter(similar.bind(name)).map(function(value){return config[value]});

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
}
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
