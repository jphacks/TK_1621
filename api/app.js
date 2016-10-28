/**
 * initialize
 */

// initialize express
var express = require("express");
var app = express();
app.set('view engine', "ejs");

// initialize multer(handling image download upload)
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'image')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
});
var upload = multer({ storage: storage })

// initialize google cloud vision api
var googleVision = require('node-cloud-vision-api')
googleVision.init({auth:'AIzaSyBBrKHAumfSaP5EBfOsA5A27qRIWaj83c4'})

var googleReq = new googleVision.Request({
    image: new googleVision.Image("image/image"),
    features: [
        new googleVision.Feature('FACE_DETECTION', 4),
        new googleVision.Feature('LABEL_DETECTION', 10),
    ]
});

// initialize microsoft computer vision api
var msVision = require('request')
var msHeaders = {
  'Content-Type':'application/json',
  'Ocp-Apim-Subscription-Key' : 'c2bcfce9c3594063944ca801616a7ff7'
}
var msOptions = {
  url: 'https://api.projectoxford.ai/vision/v1.0/analyze',
  method: 'POST',
  headers: msHeaders,
  json: {
      "url":"file:./image/image"
  },
  form: {
      "visualFeatures":"Categories",
      "language": "en",
    }
}


/**
 * starting server
 */

// listen at port 3000
var server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

/**
 * GET
 */

// handle root page
app.get("/", function(req, res, next){
    res.render("index", {})
});

/**
 * POST
 */

// upload image and throw to google cloud vision api
app.post("/upload", upload.single('image'), function(req, res){
    console.log(req.file);
    var message = req.body.message;

    // Using Google Cloud vision
    googleVision.annotate(googleReq).then((res) => {
        // handling response
        console.log(JSON.stringify(res.responses, null, 4))
    }, (e) => {
        console.log('Error: ', e)
    })
});

/**
 * Throw to other api
 */

// throw to ms computer vision
msVision(msOptions, function (error, response, body) {
  console.log(response);
  //console.log(body);
})
