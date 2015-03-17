var controller, cn, ch;

controller = require("./controller.js");

cn = new controller.net();
ch = new controller.http();

exports.port = function(name) {
  address = this.address();
  console.log("opened %j server on port %j", name, address.port);
};

exports.telnet = function(socket) {
  cn.start(socket);

  socket.on("data", function(data) {
    cn.parse(socket, data.toString());
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

  book = ch.create();
  book.read(request);
  book.write(response);
};
