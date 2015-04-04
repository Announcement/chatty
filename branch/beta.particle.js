loading = false;
var out, button, $, request, cookies, ident, last;

$ = document.querySelector.bind(document);

out = $("#output");
button = $("button");

cookies = new Bakery();

cookies.devour(document.cookie);

ident = cookies.find("identity");

document.forms.chat.style.display = "none";

document.forms.user.addEventListener("submit", function(e) {
  e.preventDefault();

  request = new Request("/query");

  request.prepare({
    id: ident,
    name: document.forms.user.name.value,
    pass: document.forms.user.password.value,
    action: "verify"
  });

  request.action(function() {
    if (xhr.responseText != "false") {
      document.forms.user.style.display = "none";
      document.forms.chat.style.display = "block";
    }
  });

  request.start();

  return false;
});
document.forms.chat.addEventListener("submit", function(e) {
  e.preventDefault();

  var message;

  request = new Request("/query");
  message = document.forms.chat.message.value.trim();

  if (message <= 1 || message.length > 140)
    return false;

  request.prepare({
    id: ident,
    name: document.forms.user.name.value,
    message: document.forms.chat.message.value,
    action: "send"
  });

  request.action(function() {
    document.forms.chat.message.value = "";
  });

  request.start();

  return false;
});
var chat = new Chat();
var list = document.createElement("ul");
document.body.appendChild(list);

function update() {
  request = new Request("/query");
  request.prepare({
    id: ident,
    update: chat.position
  });
  request.action(function() {
    chat.read(xhr.responseText);
  });
  request.start();
  setTimeout(update, 1000);
}
function Chat() {
  this.position = 0;

  function read(logs) {
    logs = JSON.parse(logs);
    this.position += logs.length;
    if (logs.length > 0)
      print(logs);
  }
  function print(logs) {
    for (var key in logs)
      if (logs.hasOwnProperty(key))
        show(logs[key]);
  }
  function show(packet) {
    var item, text, m, un, nt, tm;

    m = "@%s %s".format(packet.name, packet.message);

    nt = document.createTextNode("@" + packet.name);
    tm = document.createTextNode(" " + packet.message);

    un = document.createElement("span");
    item = document.createElement("li");
    un.setAttribute("class", "username");
    un.appendChild(nt);
    item.appendChild(un);
    item.appendChild(tm);

    if (list.children.length > 0)
      list.insertBefore(item, list.firstChild);
    else
      list.appendChild(item);
  }
  this.read = read.bind(this);

  return this;
}
setTimeout(update, 1000);