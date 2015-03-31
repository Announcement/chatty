var fs = global.fs || require("fs");
var path = process.cwd();
function values(o) {
  var k, a;

  k = Object.keys(o);
  a = [];

  while (k.length > 0)
    a.push(o[k.shift()]);

  return a;
}
function database () {
  /* TODO:
  phase 1) Save, load
  phase 2) Compress, decompress, package, unpackage
  phase 3) clean, dump, query+, sort, indexing
  phase 4) optimize
   */
  var filename = "database";
  var tables = [];
  function table(column) {
    tables.push(this);

    var data = [];
    this.column = column;
    this.name = (new Date()).getTime();

    function insert(row) {
      if (row.data.length == column.data.length)
        data.push(row.data);
      else
        return null;
      return column.data;
    }
    function get() {
      var obj = {};

      for (var x = 0; x < data.length; x++) {
        var o = {}, v = data[x];
        for (var y = 0; y < column.data.length; y++) {
          o[column.data[y]] = v[y];
        }
        obj[data[x][0]] = o;
      }

      return obj;
    }
    function query(name, value) {
      var pos = column.data.indexOf(name);

      if (pos==-1)
        return -1;

      function f(v) { return v[pos] == value; }

      function g(v) {
        var o = {};

        function h(i, j) {
          o[i] = v[j];
        }

        column.data.forEach(h);

        return o;
      }

      return data.filter(f).map(g);
    }

    this.get = get.bind(this);
    this.insert = insert.bind(this);
    this.query = query.bind(this);

    return this;
  }
  function row() {
    if (!!arguments)

    this.data = Array.prototype.slice.call(arguments, 0);

    this.read = function () { return this.data; }

    return this;
  }
  function Row(list) {
    if (!!list)

    this.data = list

    this.read = function () { return this.data; }

    return this;
  }

  function save() {
    var contents;

    contents = {};

    for (var i = 0; i < tables.length; i++){
      var value = tables[i];
      contents[value.name] = value.get();
    }

    contents = JSON.stringify(contents, null, "\t");

    fs.writeFileSync(path + "/"+ filename + ".dat", contents);
  }
  function read(value) {

  }
  function load() {
    var content, keys, value, tab, tv, tb, tk, ti;

    if (!fs.existsSync(path + "/" + filename + ".dat"))
      return false;

    content = fs.readFileSync(filename+".dat").toString("utf8");
    content = JSON.parse(content);

    keys = Object.keys(content);

    while (keys.length > 0)
    {
      key = keys.shift();

      value = content[key];

      tk = Object.keys(value);

      if (tk.length <= 0)
        continue;

      var r = new Row(Object.keys(value[tk[0]]));

      tab = new table(r);

      for (var i = 0; i < tk.length; i++)
      {
        ti = tk[i];
        tv = value[ti];

        tab.insert(new Row(values(tv)));
      }

      tab.name = key;
      tables.pop();
      tables.push(tab);
    }
  }
  function resume(name) {
    for (var i = 0; i < tables.length; i++)
      if (tables[i].name == name)
        return tables[i];
    return false;
  }
  this.resume = resume.bind(this);
  this.load = load.bind(this);
  this.save = save.bind(this);
  this.table = table.bind(this);
  this.row = row.bind(this);

  return this;
};

global.database = new database();
exports.database = database;
