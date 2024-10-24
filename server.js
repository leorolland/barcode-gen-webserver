var http = require('http');
var JsBarcode = require('jsbarcode');
var { createCanvas } = require("canvas");

function getData(req) {
  const urlParts = req.url.split('/');
  if (urlParts.length != 2) {
    throw new Error('le chemin doit contenir seulement 1 element, chemin actuel'+ req.url);
  }

  if (urlParts[1] == "") {
    throw new Error('le chemin est vide, vous devez ajouter du texte au chemin (exemple: /monMessage)');
  }

  return urlParts[1];
}

function generate(data) {
  var canvas = createCanvas();
  JsBarcode(canvas, data);

  return canvas.toBuffer("image/png")
}

http.createServer(function (req, res) {
  let data;
  try {
    data = getData(req);
  } catch(e) {
    res.writeHead(400)
    res.end('URL invalide: ' + e.message)
    return
  }

  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(generate(data));
}).listen(process.env.PORT || 8080);
