var http = require('http'),
  connect = require('connect'),
  httpProxy = require('http-proxy');
var fs = require('fs');

var script_to_load = fs.readFileSync('./script_to_load.js');

var selects = [];
var simpleselect = {};

simpleselect.query = 'meta[name="description"]';
simpleselect.func = function (node) {
  node.createWriteStream({ outer: true }).end('<script>'+script_to_load+'</script>');
}

selects.push(simpleselect);

var app = connect();

var proxy = httpProxy.createProxyServer({
  target: 'https://www.bhg.com/',
  secure: true,
  changeOrigin: true
})

app.use(require('./node_modules/harmon/index')([], selects));

app.use(
  function (req, res) {
    proxy.web(req, res);
  }
);

http.createServer(app).listen(8000);
console.log("Server Running on PORT: 8000, URL: localhost: 8000");