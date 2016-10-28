/**
 * field
 */

// reactive
var Rx = require('Rx');
var subject = new Rx.Subject();

subject.subscribe(
     x => console.log(x)
)

/**
 * json 2 object
 */

function breakJson(json){
    for (var i=0; i<json.item.length; i++){
        subject.onNext(json.item[i].description)
    }   
}

function loop(){
    for (var i=0; i<10; i++){
        subject.onNext(i)
    }  
}

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

/**
 * starting server
 */

// listen at port 3000
var server = app.listen(3000, function(){
    //console.log("Node.js is listening to PORT:" + server.address().port);
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

    var message = req.body.message;

    // Using Google Cloud vision
    googleVision.annotate(googleReq).then((res) => {
        // handling response
        //console.log(JSON.stringify(res.responses, null, 4))
        //breakJson(JSON.parse(JSON.stringify));
        loop();
        
    }, (e) => {
        console.log('Error: ', e)
    })
});

