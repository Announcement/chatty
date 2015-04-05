var experiments;
experiments = [];
function prepare(){
experiments.push(function(){
  console.log("Running database test: ");
  var db, ri, table, ur;

  try {
    db = new database();
    console.log("Database created successfully.");
  }
  catch(e){ throw "Couldn't instantiate database"}

  try{
    ri = new db.row("username", "password");
  }catch(e){ throw "Couldn't create row:index"}

  try{
    table = new db.table(ri);
    console.log("Database table created sucessfully.");
  }catch(e){ throw "Couldn't create a new table";}

  try{
    ur = new db.row("scientist", "theoretical");
    table.insert(ur);
    console.log("Sucessful table insert completed.");
  }catch(e){
    throw "Inserting row into database not allowed."
  }
  try
  {console.log(table.query("username","scientist"));}
  catch(e){
    throw "Something went wrong attempting to query the database."}

  console.log("Benchmarking database access.");

  table = new db.table(new db.row("id", "seed"));

  for (var i = Math.pow(10, 6); i--; table.insert(ur))
       ur = new db.row(i, Math.floor(Math.random() * i));

});
}
function experiment() {
  prepare();
  for (var test in experiments) {
    try {
      experiments[test].call(null);
    } catch(e) {
      console.error(e.toString());
    }
  }
}
exports.experiment = experiment;