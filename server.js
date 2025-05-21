const https = require("node:https");
const httpProxy = require("http-proxy");
const fs = require("node:fs");

const proxy = httpProxy.createProxyServer({});
const options = {
  key: fs.readFileSync("./https_cert/localhost-key.pem"),
  cert: fs.readFileSync("./https_cert/localhost.pem")
};

https.createServer(options, function (req, res) {
  proxy.web(req, res, { target: "http://localhost:8080" });
}).listen(8443, () => {
  console.log("HTTPS proxy running at https://localhost:8443");
});