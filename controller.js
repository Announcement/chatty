var db, reg, tlk, normalize;

db = global.database;

reg = db.resume("usereg");
tlk = db.resume("talkai");

if (reg === false) {
  reg = new db.table(new db.row("id", "name", "password"));
  reg.name = "usereg";
}
if (tlk === false){
  tlk = new db.table(new db.row("id", "phrase", "response"));
  tlk.name = "talkai";
}
function register() {
      var sd, id, un, pw;

      sd = (new Date()).getTime();
      id = Math.floor(sd / 100 % Math.pow(10, 4));
      un = "USER" + id;
      pw = "";

      return {"seed": sd, "id": id, "name": un, "password": pw};
}

//Can't be implemented until have a better way of handling (multiple) cookies. Oops.
function token() {
  var tool, args;

  tool = crypto.createHash("md5");
  args = Array.prototype.slice.call(arguments, 0);

  args.forEach(function(v) { tool.update(v); });

  return tool.digest("hex");
}

//Controller::http
function httpController()
{
  //session: request

  function create(){
    var info, req;

    info = register();

    function insert() {
        var row = new db.row(info.id, info.name, info.password);
        reg.insert(row);
    }
    function login(imuser) {
      info.id = imuser;

      var user;
      user = reg.query("id", info.id);

      if (user.length == 0)
        return insert();

      user = user.shift();

      info.name = user.name;
      info.password = user.password;
    }
    function read(request){
      var ck, rx, im, up, uq;

      if (request.url == "/favicon.ico")
        return false;

      ck = request.headers.cookie;

      if (!ck) return false;

      rx = /\s*?([^=]+)=([^;]+)((?:;.+;?)+|;?)\s*/im;

      for (var i = 0xFF; (im = rx.exec(ck)) && i --> 0; );
      {
        console.log(im);
        if (im && im[1] == "ident")
          login(im[2]);
        else insert();
      }

      if (request.method == "post")
        receive(request);

      up = url.parse(request.url);
      uq = querystring.parse(up.query);

      //Persistent   = cookies
      //Security     = POST
      //Reproducable = GET
      //Navigatable  = /url/scheme
    }
    function write(response){
      var cookies, message;

      cookies = [];

      cookies.push("ident=" + info.id);
      cookies.push("token=" + token(info.name, info.password));
      cookies.push("date=" + (new Date()).getTime());
      cookies.push("name=" + info.name);


      response.writeHead(200, {"Set-Cookie": cookies,
                               "Content-Type": "text/plain"});

      message = normalize.greet(info.name);

      response.end(message);
    }
    function receive(request){
      data = "";

      request.on("data", chunk);
      request.on("close",close);

      function chunk(of) {
        data += of;

        if (data >= 1e6)
          request.connection.flush();
      }
      function close() {
        info.post = querystring.parse(data);
        console.log(info.post);
      }
    }

    this.read = read;
    this.write = write;

    return this;
  }
  this.create = create.bind(null);

  return this;
}
//Controller::net
function netController()
{
  //session: connection
  var clients;

  clients = [];

  function start(sock) {
    clients.push(sock);

    return new Client(sock);
  }
  function close(sock) {
    var index;

    sock.destroy();

    index = (typeof sock == "number") ? sock : clients.indexOf(sock);
    sock = clients.splice(index, 1);

  }

  function parse(message) {
    try {
      this.write(message);
      return "Server state is currently ECHO only.";
    } catch (e) {
      var err = "Controller is not a client!";
      console.log(err);
      return err;
    }
  }

  this.start = start.bind(this);
  this.close = close.bind(this);
  this.parse = parse.bind(null);

  return this;

  function Client(sock) {
    var info, buffer, phrase;



    (function init(){
      info = register();

      buffer = "";
      phrase = "Hello";

      respond(normalize.greet(info.name));
    }).call(null);

    function parse(m){
      var content, r;

      r = /(\s)+/g

      content = m.trim().replace(r, "$1");

      if (content.length > 1 && m[m.length - 1] == "\n")
        handle(content);
      else

        if (content.length == 1)
          buffer += content;
      else

        if (content.length == 0 && m.match("\s"))
          handle(buffer);
      else

        buffer = "";
    }

    function handle(c) {
      if (c.match(/^[A-Z].+?(\.|\?|\!)$/gm))
        learn(c);
      else
        respond(c);
    }

    this.parse = parse.bind(sock);

    function learn(a) {
      var now, rep;
      now = (new Date()).getTime();

      tlk.insert(db.row(now, phrase, a));

      var res = tlk.query("phrase", a);

      phrase = a;

      if (res.length >= 1)
        rep = res[Math.floor(Math.random() * res.length)].response;
      else
        rep = a;

      respond(rep);
    }

    function respond(message) {
      sock.write(message + "\r\n");
    }
  };
}


//Controller::database
function databaseController()
{ //Technically a controller, but not an accessible one.
}


exports.http = httpController;
exports.net = netController;

function model()
{
  //Extension to connect controllers
  //Handle request and provide relevant content.
  function greet(name) {
    return "Welcome to the club, " + name + "! ";
  }

  this.greet = greet.bind(this);

  return this;
}

normalize = new model();

//Views
function robots(){}

function feeds(){}

function sitemap(){}

function cache(){}

function content(){}
