var controller, cn, ch, cname;

cname = "./controller.js";
controller = require(cname);

cn = new controller.net();
ch = new controller.http();

exports.port = function(name) {
  address = this.address();
  console.log("opened %j server on port %j", name, address.port);
};

exports.telnet = function(socket) {
  var client = new cn.start(socket);

  socket.on("data", function(data) {
    client.parse(data.toString());
  });
  socket.on("close", function(e){
    cn.close(socket);
  });
  socket.on("error", function(e) {
    cn.close(socket);
  });
};

exports.httpd = function(request, response) {
  var book;

  delete require.cache[require.resolve(cname)];
  controller = require(cname);
  ch = new controller.http();

  book = ch.create();
  book.read(request);
  book.write(response);
};
