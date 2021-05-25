const couchbase = require("couchbase");
const Express = require("express");
const BodyParser = require("body-parser");
const app = Express();
const cluster = new couchbase.Cluster("couchbase://localhost", {
  username: "Admin",
  password: "secretkey",
});

const bucket = cluster.bucket("default");
const collection = bucket.defaultCollection();

app.use(BodyParser.json());

/*
Example of a doucment : {
  "type": "airline",
  "id": 8096,
  "callsign": "CBS",
  "iata": null,
  "icao": null,
  "name":
*/
app.get("/", function (request, response) {
  response.send("Welcome!");
});
/*
Get the document that you want fromm the couchbaseDB by using the corret key
Keys are represented as the type_id for example : airline_9083
*/
app.get("/get", async function (req, res) {
  try {
    const result = await collection.get(req.query.id);
    console.log("Get Result: ");
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Key not in the database");
  }
});
/*
Saves a document - represting flight object to the couchbaseDB
Keys are represented as the type_id for example : airline_9083
*/

app.post("/save", async function (req, res) {
  try {
    const key = `${req.body.type}_${req.body.id}`;
    const result = await collection.upsert(key, req.body);
    console.log("Upsert Result: ");
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

var server = app.listen(process.env.APPLICATION_PORT || 3000, function () {
  console.log("Listening on port " + server.address().port + "...");
});
