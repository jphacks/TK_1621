const express = require('express');
const multer = require("multer");
const googleVision = require('node-cloud-vision-api')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressWs = require('express-ws');
const getImagePath = require('./lib/get_image_path')
const translate = require('./lib/translate')

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

const googleReq = (filePath) => {
  return new googleVision.Request({
    image: new googleVision.Image(filePath),
    features: [
        new googleVision.Feature('FACE_DETECTION', 4),
        new googleVision.Feature('LABEL_DETECTION', 10),
    ]
  });
};

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
    getImagePath(
      JSON.parse(msg).upload_file,
      (filePath) => {
        // Using Google Cloud vision
        googleVision.annotate(googleReq(filePath)).then((res) => {
            // handling response
            const list = JSON.parse(JSON.stringify(res.responses[0].labelAnnotations))
            for (var i=0; i<list.length; i++){
              translate(list[i].description, 'ja', (translation) => {
                ws.send(translation);
              });
            }
        }, (e) => {
            console.log('Error: ', e)
        });
      }
    )
    // const filePath = 'image/test.jpg'
  });
});
