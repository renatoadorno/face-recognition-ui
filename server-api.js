const https = require("node:https");
const httpProxy = require("http-proxy");
const fs = require("node:fs");

const proxy = httpProxy.createProxyServer({});
const options = {
  key: fs.readFileSync("./https_cert/localhost-key.pem"),
  cert: fs.readFileSync("./https_cert/localhost.pem")
};

https.createServer(options, function (req, res) {
  proxy.web(req, res, { target: "http://127.0.0.1:7800" });
}).listen(9443, () => {
  console.log("HTTPS proxy running at https://192.168.0.57:9443");
});