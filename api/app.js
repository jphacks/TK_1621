const express = require('express');
const multer = require("multer");
const googleVision = require('node-cloud-vision-api')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressWs = require('express-ws');

const errorHandler = (err, req, res, next) => {
  res.status(500).send({ error: 'unexpected errors occured.' });
  console.log('Do not use next() here', next);
};

const app = express()

/**
 * initialize
 */

// initialize express(handleing http req)
app.set('view engine', "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(errorHandler);

expressWs(app)

// initialize multer(handling image download upload)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'image')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
});

const upload = multer({ storage: storage })

// initialize google cloud vision api
googleVision.init({auth:'AIzaSyBBrKHAumfSaP5EBfOsA5A27qRIWaj83c4'})

const googleReq = new googleVision.Request({
    image: new googleVision.Image("image/image"),
    features: [
        new googleVision.Feature('FACE_DETECTION', 4),
        new googleVision.Feature('LABEL_DETECTION', 10),
    ]
});

/**
 * starting server
 */

// listen at port 3000
const server = app.listen(3000);

/**
 * GET
 */

// handle root page
app.get("/image", function(req, res, next){
    res.render("index", {})
});

// websocket
app.ws('/', (ws) => {
  ws.on('message', (msg) => {
    // Using Google Cloud vision
    googleVision.annotate(googleReq).then((res) => {
        // handling response
        var list = JSON.parse(JSON.stringify(res.responses[0].labelAnnotations))
        for (var i=0; i<list.length; i++){
            ws.send(list[i].description)
        } 
    }, (e) => {
        console.log('Error: ', e)
    })
  });
});

/**
 * POST
 */

// upload image and throw to google cloud vision api
app.post("/upload", upload.single('image'), function(req, res){

    var message = req.body.message;

    // redirect to top
    res.redirect(302, "../image");

    // Using Google Cloud vision
    googleVision.annotate(googleReq).then((res) => {
        // handling response
        var list = JSON.parse(JSON.stringify(res.responses[0].labelAnnotations))
        for (var i=0; i<list.length; i++){
            console.log(list[i].description)
        }
    }, (e) => {
        console.log('Error: ', e)
    })
});

