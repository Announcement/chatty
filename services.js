//Services
var mods, programs;

mods = ["net", "http", "fs", "url", "querystring", "fs"];

programs = ["telnet", "httpd", "database", /*"smtp"*/
           "eventsource", "rest", "cookies", "fileserver",
           "feed", "website", "pages", "apps", "live"];


mods.forEach(function(value) {
  global[value] = require(value);
});
var translate = require("./translate.js");
programs.forEach(function(value) {
  global[value] = null;
});

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
database = function() {
  /* TODO:
  phase 1) Save, load
  phase 2) Compress, decompress, package, unpackage
  phase 3) clean, dump, query+, sort, indexing
  phase 4) optimize
   */
  function table(column) {
    var data = [];
    this.column = column;
    function insert(row) {
      if (row.data.length == column.data.length)
        data.push(row.data);
      else
        return null;
      return column.data;
    }
    function get() {
      return column.data;
    }
    function query(name, value) {
      var pos = column.data.indexOf(name);
      //return pos;
      if (pos==-1)
        return -1;
      return data.filter(function(v){
        return v[pos] == value;
      }).map(function(v){
        var o = {};
        for (var i = 0; i < column.data.length; i++)
          o[column.data[i]] = v[i];
        return o;
      });
    }

    this.get = get.bind(this);
    this.insert = insert.bind(this);
    this.query = query.bind(this);

    return this;
  }
  function row() {
    if (!!arguments)

    this.data = Array.prototype.slice.call(arguments, 0);

    return this;
  }

  this.table = table.bind(this);
  this.row = row.bind(null);

  return this;
};

programs.forEach(function(value) {
  exports[value] = global[value];
});
