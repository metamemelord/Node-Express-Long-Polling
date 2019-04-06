const express = require("express");
const events = require("events");
const path = require("path");

const app = express();
const emitter = new events.EventEmitter();

app.use("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

app.use(express.static(path.join(__dirname, "client")));

app.get("/poll", (req, res) => {
  emitter.on("rand", data => {
    if (!res.headersSent) {
      res.status(200).send(data);
    }
  });
  setTimeout(() => {
    if (!res.headersSent) {
      res.status(204).send();
    }
  }, 500);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

const port = process.env.PORT || 4000;

app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running on port ${port}`);
  }
});

setInterval(() => {
  emitter.emit("rand", { data: 100 * Math.random() });
}, Math.ceil(2000 * Math.random()));
