const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");

const notifRoute = require("./notif");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/notif", notifRoute);

app.get("/", (req, res) => {
    console.log("wecare");
    res.send("welcome to we care");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("port ", port));