var folder, mimes;
folder = process.cwd();
console.log(folder);
var MAX_FILE_CACHE = 8;

mimes = {
  "txt": "text/plain",
  "html": "text/html",
  "js": "text/javascript",
  "css": "text/css"
};

global.FileCache = (function() {
  //Temporarily in place until a db comes aong.
  var data, meta, info, t;
  data = {};
  meta = {};
  info = {};
  
  function update(file) {
    var i = 0, 
        keys = Object.keys(mimes);
    
    for (var j = 0;j < keys.length && i==0; j++)
      if (file.indexOf(keys[j])!=-1)
        i = j;
    if (file.indexOf(".html.js") != -1) {
      
      data[file] = require_once("../web/" + file).html;
      meta[file] = "text/html";
      info[file] = 0;
      
      return false;
    }
    data[file] = fs.readFileSync(file, "utf8");
    meta[file] = mimes[keys[i]];
    info[file] = 0;
    
    
  }
  function overflow(n) {
    var keys = Object.keys(data);
    while (keys.length > n)
    {
      delete data[keys[n]];
      delete meta[keys[n]];
      delete info[keys[n]];
    }
  }
  function fetch(file) {
    //html, javascript, page
    file = file.replace(".hsp", ".html.js");
    
    if (!data.hasOwnProperty(file))
      return false;
    
    return {
      data: data[file],
      meta: meta[file],
      info: info[file]++
    };
  }
  
  this.update = update.bind(this);
  this.overflow = overflow.bind(this);
  this.fetch = fetch.bind(this);
  
  return this;
}());

function cache(file) {
  if (!fs.existsSync(file))
    return false;

  FileCache.update(file);
  FileCache.overflow(MAX_FILE_CACHE);
}

fs.readdir(folder, function(a, b) {
  if (a) return (a)
  
  b.forEach(cache)
});

fs.watch(folder, function(a, b) {
  cache(b)
});

