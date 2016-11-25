const mqtt = require('mqtt')
const getImagePath = require('./lib/get_image_path')
const translate = require('./lib/translate')
const googleVision = require('node-cloud-vision-api')

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

const client  = mqtt.connect(
	'ws://std1.mqtt.shiguredo.jp/mqtt', {
		username: 'sh8@github',
		password:  process.env.SANGO_PASSWORD
	}
)

client.on('connect', function () {
	client.subscribe('sh8@github/jphacks/image')
	client.publish('sh8@github/jphacks/result', 'Hello mqtt')
})

client.on('message', function (topic, message) {
	console.log('\n')
	console.log('----- Receiving message -----')
	console.log(topic)
	if (topic == 'sh8@github/jphacks/image') {
    getImagePath(
      message.toString(),
      (filePath) => {
        // Using Google Cloud vision
        googleVision.annotate(googleReq(filePath)).then((res) => {
					item = res.responses[0].labelAnnotations[0].description
					console.log(item)
					translate(item, 'ja', (translation) => {
						console.log(translation)
						client.publish('sh8@github/jphacks/result', translation)
					})
				})
			}
		)
	}
})
