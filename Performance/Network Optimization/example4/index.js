const express = require("express");
const spdy = require('spdy');
const fs = require("fs");


const PORT = 3010;
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log(req.url);
    res.sendFile(__dirname + '/index.html');
});

// Use this to run it on protocol http/1.1, spdy server will run it on https and protocol http2
// app.listen(PORT, () => {
//   console.log(`Server started at http://localhost:${PORT}`)
// })

const CERT_DIR = `${__dirname}/cert`;

const server = spdy.createServer(
    {
      key: fs.readFileSync(`${CERT_DIR}/server.key`),
      cert: fs.readFileSync(`${CERT_DIR}/server.cert`),
    },
    app
  );

server.listen(PORT, () => {
    console.log(`Server started at https://localhost:${PORT}`);
});







