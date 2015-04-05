//Hello, world!
var canvas, context,
    text,
    ascii = text = shape = {};

canvas = document.getElementsByTagName("canvas")[0];
context = canvas.getContext("2d");

function Animate(a){
  var b = a.seconds,
      g = a.maximum,
      h = a.drawing,
      i = a.exhaust,
      c = new Date();
  function Render(){
    var d = new Date(),
        e = (d - c) / (b * 1000),
        f = Math.max(0, Math.min(g, g - g * e));
    h(f);
    if (d - c < 1000 * b) requestAnimationFrame(Render);
    else i();
  }
  requestAnimationFrame(Render);
}
(function initialize_text() {
  var ascii = {};
  ascii.nums = [
    "111101101101111",//0
    "010110010010111",//1
    "111001111100111",//2
    "111001111001111",//3
    "101101111001001",//4
    "111100111001111",//5
    "111100111101111",//6
    "111001001001001",//7
    "111101111101111",//8
    "111101111001111" //9
  ];
  ascii.caps = [
    "1111110001111111000110001",/*A*/
    "1111010001111101000111110",/*B*/
    "1111110000100001000011111",/*C*/
    "1111010001100011000111110",/*D*/
    "1111110000111111000011111",/*E*/
    "1111110000111111000010000",/*F*/
    "1111110000101111000111111",/*G*/
    "1000110001111111000110001",/*H*/
    "1111100100001000010011111",/*I*/
    "1111100001100011000101110",/*J*/
    "1000110010111001001010001",/*K*/
    "1000010000100001000011111",/*L*/
    "1111110101101011010110101",/*M*/
    "1000111001101011001110001",/*N*/
    "1111110001100011000111111",/*O*/
    "1111110001111111000010000",/*P*/
    "1111110001101011001111111",/*Q*/
    "1111110001111111001010001",/*R*/
    "1111110000111110000111111",/*S*/
    "1111100100001000010000100",/*T*/
    "1000110001100011000111111",/*U*/
    "1000110001100010111000100",/*V*/
    "1010110101101011010111111",/*W*/
    "1000101010001000101010001",/*X*/
    "1000101010001000010000100",/*Y*/
    "1111100010001000100011111" /*Z*/
  ];
  ascii.special = {
    " " :  (new Array(5*5+1)).join(0),
    "?" : "0111010001000100000000010",
    "!" : "0001000010000100000000010",
    "." : "0000000000000000000000010",
    "," : "0000000000000000011000010",
    "\"": "0101001010000000000000000",
    "'" : "0010000100000000000000000",
    "/" : "0000100010001000100010000",
    "%" : "1000100010001000100010001",
    "\\": "1000001000001000001000001",
    "*" : "1010101110111110111010101",
    "#" : "0101011111010101111101010",
    "$" : "0111110101111111010111110",
    "~" : "0000001001101011001000000",
    "(" : "0001000100001000010000010",
    ")" : "0010000010000100001000100",
    ">" : "1000001000001000100010000",
    "<" : "0000100010001000001000001",
    "-" : "0000000000011100000000000",
    "+" : "0000000100111110010000000",
    "=" : "0000001110000000111000000",
    "_" : "0000000000000000000011111",
    "[" : "1110010000100001000011100",
    "]" : "0011100001000010000100111",
    "}" : "0100000100110000010001000",
    "{" : "0001000100000110010000010",
    "|" : "0010000100000000010000100",
    ":" : "0000000100000000010000000",
    "^" : "0010001010100010000000000",
    "`" : "1000001000000000000000000",
    ";" : "0000000100000000010001000",
    "@" : "0111010101110111010001110",
    "&" : "0111011001011001101001101",
    "\r":"0010101001111100100000100"};
  function find(char) {
    var code = char.toUpperCase().charCodeAt(0);

    //letter
    if (code > 64 && code <= 64 + 26)
      return ascii.caps[~-code - 64];

    //number
    if (code > 47 && code <= 47 + 10)
      return ascii.nums[~-code - 47];

    //special
    if (ascii.special.hasOwnProperty(char))
      return ascii.special[char];

    //unsupported
    return false;
  }
  function draw(f) {
        this.beginPath();

        f.apply(this, Array.prototype.slice.call(arguments, 1));

        this.fill();
        this.stroke();
        this.closePath();
  }
  function rect(x, y, w, h) {
    draw.call(this, this.rect, x, y, w, h);
  }
  function char(character, x, y, size) {
    //Basic bitmap drawing, no antialiasing.
    var bitmap, length, column, row, limit;

    bitmap = find(character);

    if (bitmap === false || !bitmap) return false;
    bitmap = bitmap.split("");
    limit = 5;
    length = bitmap.length / limit;

    this.fillStyle = "black";
    this.strokeStyle = "black";

    for (column = 0; column++ < limit; bitmap.splice(0, length))
      for (row = 0; row < length; row++)
        if (!~-bitmap[row])
          rect.call(this, x + (row * size), y + (~-column * size), size, size);

  }
  text = function text(message, position, config) {
    var text, size, x, y;
    if (!message) return false;
    text = message.split("");
    if (!config) config = {};
    if (!position) position = {};
    size = config.size || 2
    x = position.x || 0;
    y = position.y || 0;

    while(text.length > 0)
      char.call(this, text.shift(),
                x + (message.length - text.length) * 6 * size,
                y, size);
  }
}).call(null);
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
function load(){
  var index = 0, size = 2;
  var list = document.children[0].innerHTML.split("\n");
  var hr = getHandler();
  hr.onreadystatechange = function() {
    if (hr.readyState===4)
      display(hr.responseText);
  };
  hr.open("GET", "show.html", true);
  hr.send(null);

  var textarea=document.createElement("textarea");
  document.body.appendChild(textarea);
  textarea.addEventListener("keyup", function(){
    display(textarea.value);
  });
  var button=document.createElement("button");
  button.innerHTML="Evaluate?";
  document.body.appendChild(button);
  button.addEventListener("click", function(){
    var text;
    try{
      text=eval(textarea.value);
    }catch(e){
      display(e.toString());
    }
    display(text+"");
  });
  function display(txt) {
    var line, s, num, max, len, top, space;

    s = txt.match(/^(?!s\s+).+$/gim);
    num = 0; max = 0; len = s.length;
    space = size * 6;

    for (var i = 0; i < s.length; i++)
      max = (max > s[i].length) ? max: s[i].length;

    if(max > 80) {
      var stack = [];
      while (s.length > 0) {
        var value = s.shift();
        if (value.length <= 80)
          stack.push(value);
        else
        {
          stack.push(value.substring(0, 80));
          s.unshift(value.substring(80));
        }
      }
      max = 80;
      len = stack.length;
      s = stack;

    }

    canvas.height = -~len * space;
    canvas.width  = -~max * space;

    while (s.length > 0) {
      line = s.shift(); num++;
      top += space;

      text.call(context, line, {x: 0, y: num * space}, {size: size});
    }
  }
};
(function(){window.addEventListener("load",load)})();
//
