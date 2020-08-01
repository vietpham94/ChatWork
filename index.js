const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const favicon = require('serve-favicon');
const apiRouter = require("./routes/api/api-routes");
const webRouter = require("./routes/web/web-routes");
const config = require("./config/config");
const https = require('https');
const fs = require('fs');

const app = express();
dotenv.config();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", apiRouter);
app.use("/", webRouter);
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(favicon('public/images/favicon.ico'));

const httpsOptions = {
    key: fs.readFileSync('../ssl/localhost.key'),
    cert: fs.readFileSync('../ssl/localhost.crt')
}
const server = https.createServer(httpsOptions, app);
// const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

io.on("connection", function (socket) {
    console.log("Socket connected: " + socket.id);
    socket.on("disconnect", function () {
        console.log("Socket disconnected: " + socket.id);
    })
});

mongoose.connect(config.dbUri, { useNewUrlParser: true });
const db = mongoose.connection;
if (!db) {
    console.log("Error connecting db");
} else {
    console.log("Db connected successfully");
}

server.listen(port, () => {
    console.log(`Server listening on: https://localhost:${server.address().port}`);
});