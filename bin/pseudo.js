function Element(tagName){
  var children, innerHTML, id, isTextNode, attributes;
  
  children = [];
  innerHTML = "";
  id = null;
  isTextNode = false;
  attributes = {};
  
  this.tagName = tagName;
  this.children = children;
  this.innerHTML = innerHTML;
  this.id = id;
  this.isTextNode = false;
  this.attributes = {};
  
  this.appendChild = appendChild.bind(this);
  this.createElement = createElement.bind(this);
  this.insertBefore = insertBefore.bind(this);
  this.getElementById = getElementById.bind(this);
  this.createTextNode = createTextNode.bind(this);
  this.getAttribute = getAttribute.bind(this);
  this.setAttribute = setAttribute.bind(this);
  
  return this;
}

function TextNode(text) {
  this.isTextNode = true;
  this.text = text;
}
function esc(str) {
  return str.replace(/"/g, '\\"').trim();
}
function appendChild(aChild){
  this.children.push(aChild);
}
function createElement(tagName){
  return new Element(tagName);
}
function insertBefore(newElement, referenceElement){
  var index;
  
  index = this.children.indexOf(referenceElement);
  
  this.children.splice(index, 0, newElement);
}
function getElementById(id){
  //...no thanks.
}
function createTextNode(data){
  return new TextNode(data);
}
function getAttribute(attribute) {
  return this.attributes[attribute];
}
function setAttribute(name, value) {
  return this.attributes[name] = esc(value);
}
Object.defineProperties(Element.prototype, {
  "innerHTML": {
    get: function() {
      var string = "";
      this.children.forEach(function(value) {
        if (value.isTextNode) {
          string += value.text;
        }
        else
          string += value.outerHTML;
      });
      return string;
    },
    set: function(value) {
      this.children = [new TextNode(value)];
    }
  },
  "outerHTML": {
    get: function() {
      var open, close, attr;
      
      if (Object.keys(this.attributes).length > 0)
        attr = " " + (this.attributes).pair('%s="%s"').join(" ");
      else
        attr = "";
      
      open =  "<" + this.tagName + attr + ">";
      close = "</" + this.tagName + ">";
      
      if (this.children.length == 0 || this.children.length == 1 && this.children[0].text == '')
        return open.substring(0, open.length - 1) + " />";
      
      return open + this.innerHTML + close;
    }
  }
});

exports.appendChild = appendChild;
exports.createElement = createElement;
exports.insertBefore = insertBefore;
exports.getElementById = getElementById;
exports.createTextNode = createTextNode;

function Page(json) {
  var document, head, body, title, text, meta, charset;

  document = new Element("html");
  head = document.createElement("head");
  body = document.createElement("body");
  title = document.createElement("title");
  meta = document.createElement("meta");
  charset = document.createElement("meta");
  
  text = document.createTextNode(json.title);

  document.body = body;
  document.head = head;
  document.forms = {};
  
  title.appendChild(text);
  
  meta.setAttribute("name", "revised");
  meta.setAttribute("content", (new Date()).toUTCString());
  
  charset.setAttribute("charset", "utf8");
  
  document.appendChild(body);
  document.insertBefore(head, body);
  document.head.appendChild(title);
  document.body.appendChild(text);
  document.head.appendChild(charset);
  document.head.appendChild(meta);
  
  this.dom = document;
  this.html = document.outerHTML;
  
  return this;
}
function Beautify(html) {
  var i, spacer, f, x, y, z, bump;
  
  x = /(<\/|\/>)/gi;
  y = /<\w/gi;
  z = /></g;
  f = ">\n<"
  
  html = html.replace(z, f); 
  i = 0;
  spacer = "  ";
  
  html = html.split("\n").map(function(v) {
    while (y.exec(v)) i++;
    var b = (new Array(i)).join(spacer);
    while (x.exec(v)) i--;
    
    return b + v.trim();
  }).join("\n");
  
  return html;
}
function Form(config) {
  var form, value, input, submit, label, x, y;
  form = new Element("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", "/" + config._action);
  
  x = ["plain", "secure", "hidden"];
  y = ["text", "password", "hidden"];
  
  for (var key in config)
    if (key.indexOf("_") != 0 && config.hasOwnProperty(key))
    {
      value = config[key];
      
      if (value == "secure")
        form.setAttribute("method", "POST");
      
      input = new Element("input");     
      input.setAttribute("type", y[x.indexOf(value)]);

      input.setAttribute("name", key);
      input.setAttribute("placeholder", key);
      
      form.appendChild(input);
     
      if (value != "hidden")
      {
        label = new Element("label");
        label.setAttribute("for", key); 
        label.appendChild(new TextNode(key));
        form.insertBefore(label, input);
      }
      
      form[key] = input;
    }
  
  submit = new Element("button");
  submit.setAttribute("name", "action");
  submit.setAttribute("value", config._action); 
  submit.innerHTML = config._action;
  
  form.appendChild(submit);
  form.action = submit;
  
  if (config._name)
    form.setAttribute("name", config._name);
  
  return form;
}
global.require_once = function(name) {
  delete require.cache[require.resolve(name)];
  return require(name);
}

global.Page = Page;
global.Form = Form;

exports.Beautify = Beautify;
exports.comment = function() {
  return Array.prototype.map.call(arguments, c);
  function c(v) {
    return "<!-- %s -->".format(v);
  }
}