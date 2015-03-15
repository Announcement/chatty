exports.telnet = function(socket) {
  socket.write("Hello, world!");
  socket.on("data", function(data) {
    socket.write(data.toString().toUpperCase().trim());
  });
  socket.on("close", function(e){
    socket.destroy();
  });
  socket.on("error", function(e) {
    console.error(e.toString());
    socket.destroy();
  });
};
exports.httpd = function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello, world!");
};
exports.port = function(name) {
  address = this.address();
  console.log("opened %j server on port %j", name, address.port);
};