/* 
name: servers.js

features: version 1.2; 


HTTPD specifications :

get, post, sse, cookies.
navigation minimal.



TELNET specifications : 

evenly handle all clients and similar data.



Database requirements :

extremely simple to write / maintain.
easy and quick to save.
fast enough to use for page caching.



File stream:

handles caching with reading fallback.
file-type detection.
*/

var config, handle, file;

function sum() {
  var tool, args;

  tool = crypto.createHash("md5");
  args = Array.prototype.slice.call(arguments, 0);

  args.forEach(function(v) { tool.update(v); });

  return tool.digest("hex");
}

if(params.hasOwnProperty("say"))
{
  console.log(params.say);
  process.exit(0);
}

sa = http.createServer();
sa.listen(80);

sb = net.createServer();
sb.listen(23);

handle = {
  "http": function(a, b) {
    var cookies, uri, query, seed, post, head, bump;
    
    cookies = new Bakery()
    cookies.devour(a.headers.cookie)
    
    seed = sum((new Date()).toGMTString())
    
    uri = url.parse(a.url)
    
    //GET
    query = querystring.parse(uri.query)
    
    cookies.order("identity", seed)

    if (query.hasOwnProperty("id"))
      cookies.order("identity", query.id)
      
    //POST
    a.on("data", function(data) {
      post += data;
    })
    a.on("end", function() {
      a.post = querystring.parse(post)
      //console.log(post, a.post);
    })
    //console.log(query);
    
    //Server Sent Events
    head = {
      "Content-Type": "text/plain", 
      "Set-Cookie": cookies.gather()
    }
    
    if (a.headers.accept &&
        a.headers.accept == "text/event-stream")
    {
      head = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "Keep-Alive"
      }
      a.on("close", function() { clearTimeout(bump) })
    }
    
    
    function event(data) {
      b.write("id: " + seed + "\n");
      b.write("data: " + data + "\n\n");
      
      clearTimeout(bump);
      bump = setTimeout(event.bind(this, "ping"), 5 * 1000);
    }
    
    file = FileCache.fetch(uri.pathname.substring(1));
    
    if (file) {
      head["Content-Type"] = file.meta;

      b.writeHead(200, head)
      b.end(file.data);
    } else {
      b.writeHead(404, head)
      b.end("File not found!")
    }
    
  },
  
  "telnet": function(a) {
    //Telnet is already persistent by design.
    a.pipe(a)
  }
}


sa.on("request", handle.http);
sb.on("connect", handle.telnet);