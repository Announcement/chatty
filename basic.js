var services, config, debug, experiments;
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
    if (value.indexOf("-") != 0 &&
        index > 0 &&
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

//Handle configuration and prerequisites.
(function configure() {
  services = require("./services.js");

  experiments = [];
  config = {flags: []};

  Array.prototype.forEach.call(arguments, identify);

  ports.telnet = $setting("telnet-port");
  ports.httpd = $setting("httpd-port");
  debug = !$setting("experiment");
}).apply(null, process.argv.slice(2));

//Turn some gears...
(function initialize() {

}).call(null);

//Modulation
(function install() {
}).call(null);

//Start the services.
(function finalize() {
  if (debug)
    return experiment();

  services.httpd();

  /*telnet is disabled for maintenance.
  services.telnet();//*/
}).call(null);

function prepare(){
experiments.push(function(){
  console.log("Running database test: ");
  var db, ri, table, ur;

  try {
    db = new database();
    console.log("Database created successfully.");
  }
  catch(e){ throw "Couldn't instantiate database"}

  try{
    ri = new db.row("username", "password");
  }catch(e){ throw "Couldn't create row:index"}

  try{
    table = new db.table(ri);
    console.log("Database table created sucessfully.");
  }catch(e){ throw "Couldn't create a new table";}

  try{
    ur = new db.row("scientist", "theoretical");
    table.insert(ur);
    console.log("Sucessful table insert completed.");
  }catch(e){
    throw "Inserting row into database not allowed."
  }
  try
  {console.log(table.query("username","scientist"));}
  catch(e){
    throw "Something went wrong attempting to query the database."}

  console.log("Benchmarking database access.");

  table = new db.table(new db.row("id", "seed"));

  for (var i = Math.pow(10, 6); i--; table.insert(ur))
       ur = new db.row(i, Math.floor(Math.random() * i));

});
}
function experiment() {
  prepare();
  for (var test in experiments) {
    try {
      experiments[test].call(null);
    } catch(e) {
      console.error(e.toString());
    }
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
