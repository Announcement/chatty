var pseudo, document, code, page, html, form;

pseudo = require("../bin/pseudo.js");

code = {
  title: "Hello, world!",
};

page = new Page(code);
document = page.dom;

var form = {
  "_action": "login",
  "_name": "user",
  "username": "plain",
  "password": "secure",
  "identity": "hidden"
};


document.body.children = [];

var form = new Form(form);

var h1 = document.createElement("h1");

h1.innerHTML = "beta";
document.body.appendChild(h1);

document.body.appendChild(form);

var scripts = [], styles = [];

scripts.push("beta.fish.js");
scripts.push("cookies.js");
scripts.push("beta.particle.js");

styles.push("beta.css");

scripts = scripts.map(function(value) {
  var script = document.createElement("script");
  
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", value);
  
  script.innerHTML = " ";
  
  return script;
});

styles = styles.map(function(value) {
  var style = document.createElement("link");
  
  style.setAttribute("rel", "stylesheet");
  style.setAttribute("type", "text/css");
  style.setAttribute("href", value);
  
  return style;
});

document.head.appendChild(scripts.shift());
document.head.appendChild(scripts.shift());
document.body.appendChild(scripts.shift());
document.head.appendChild(styles.shift());

html = document.outerHTML;
html += pseudo.comment("html javascript page");
html = pseudo.Beautify(html);
exports.html = html;
