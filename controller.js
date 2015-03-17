//Controller::http
function httpController()
{
  //session: request

  function create(){
    function read(request){
      //Oh you wanted something?

      //Persistent   = cookies
      //Security     = POST
      //Reproducable = GET
      //Navigatable  = /url/scheme
    }
    function write(response){
      response.writeHead(200, {"Content-Type": "text/plain"});
      response.end("Hello, world!");
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

}

//Views
function robots(){}

function feeds(){}

function sitemap(){}

function cache(){}

function content(){}
