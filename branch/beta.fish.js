var xhr, requests, callback, loading;

callback = requests = [];
loading = true;

function getHandler() {
  try{
    return new XMLHttpRequest();
  }catch(e){}

  try{
    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
  }catch(e){}

  try{
    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
  }catch(e){}

  try{
    return new ActiveXObject("Microsoft.XMLHttp");
  }catch(e){}

  console.err("Could not find XMLHttpRequest");
}

xhr = new getHandler();

function pair(object, w) {
  var array, i;
  array = Object.keys(object);
  for (i = 0; i < array.length; i++)
    array[i] += w + object[array[i]];
  return array;
}
function transit(x) {
  return x.split("=").map(function(y){ return encodeURIComponent(y); }).join("=");
}
function prepare(object) {
  var a = pair(flatten(object), "=").map(transit).join("&");
  this.query = a;
  return a;
}

function Request(url) {
  var method = "GET";
  function getMethod() {
    return method;
  }
  function setMethod(v) {
    v = v.toUpperCase();
    if (v != "GET" && v != "POST")
      return false;

    method = v;
  }
  function action(cb) {
    this.callback = cb.bind(this);
  }
  function start() {
    if (this.used === false)
      requests.push(this);

    if(loading)
      return false;

    loading = this.used = true;

    if (method == "GET")
    {
      xhr.open(method, url +"?" + this.query);
      xhr.send(null);
    }
    else if (method == "POST")
    {
      xhr.open(method, url);
      xhr.send(this.query);
    }
  }
  this.setMethod = setMethod.bind(this);
  this.getMethod = getMethod.bind(this);
  this.action = action.bind(this);
  this.start = start.bind(this);
  this.prepare = prepare.bind(this);
  this.used = false;
  this.callback = (function(){}).bind(this);

  return this;
}

xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    requests.shift().callback();

    loading = false;

    if (requests.length > 0 && requests[0].used === false)
      requests[0].start();
  }
};