const Rx = require('rx')
const express = require('express');
const multer = require("multer");
const googleVision = require('node-cloud-vision-api')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressWs = require('express-ws');
const getImagePath = require('./lib/get_image_path')
const translate = require('./lib/translate')
const toJson = require('json-string')
const LRU = require('lru-cache');
const isDanger = require('./lib/is_danger')

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

// initialize cache
const cacheOptions = {
  max: 3, //キャッシュの最大件数
  maxAge: 5 * 1000 //保存期間の指定、単位はミリ秒
}
const cache = LRU(cacheOptions);


/**
 * starting server
 */

// listen at port 3000
const server = app.listen(3000);

// websocket
app.ws('/', (ws) => {
  ws.on('message', (msg) => {
    getImagePath(
      JSON.parse(msg).upload_file,
      (filePath) => {
        // Using Google Cloud vision
        googleVision.annotate(googleReq(filePath)).then((res) => {
            // handling response
            Rx.Observable
            .from(JSON.parse(res.responses[0].labelAnnotations)) // json to observable list
            .map(item => item.description) // unwrap
            .subscribe(
              item => {
                if(isDanger(item)){ translate(item, 'ja', (translation) => send_to_ws(translation, "true", ws) ); }
                else { send_to_ws("", "false", ws); }
              },
              err => console.log(err),
              () => console.log("completed!!!")
            )
        }, 
        (e) => {
            console.log('Error: ', e)
        });
      }
    )
    // const filePath = 'image/test.jpg'
  });
});

function send_to_ws(text, status, ws){
  // check for cache
  if (cache.has(text)) {
    status = false;
    text = ""
  } else {
    cache.set(text, text);
  }
  
  // send to ws
  ws.send(toJson({
    is_danger: status,
    text: text
  }));
}



















/**
 * TEST
 */
 // execute_test();

function execute_test(){
  // test_cache();
  test_Observable();
}

// test for cache
function test_cache(){

  function setCache(text){
    if(cache.has(text)) {
      console.log(text + " is cahced")
    } else {
      cache.set(text, text);
      console.log(text + " is not cahced")
    }
  }

  ["truck", "human", "truck"].forEach(
    item => {
      setCache(item);
    }
  )
}

// test for writing in Observable
function test_Observable(){

  function send_to_test(text, status){
  // check for cache
  if (cache.has(text)) {
    status = false;
    text = ""
  } else {
    cache.set(text, text);
  }

  console.log(toJson({
      is_danger: status,
      text: text
    }));
  }

  var json = '{"labelAnnotations":[{"description":"truck", "score":"0.992246"},{"description":"truck", "score":"0.992246"},{"description":"white", "score":"0.992246"},{"description":"human", "score":"0.992246"}]}';

  Rx.Observable
    .from(JSON.parse(json).labelAnnotations)
    .map(item => item.description)
    .subscribe(
      item => {
        if(isDanger(item)){ translate(item, 'ja', (translation) => send_to_test(translation, "true") ); } 
        else { send_to_test("", "false"); }
      })
}


